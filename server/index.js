const BRAND_SLUGS = new Set([
  'naiwan',
  'guxiaotui',
  'zukangshu',
  'hengqingshu',
  'leguangli',
  'aixiaowan',
  'shisixun',
]);

class LeadError extends Error {
  constructor(code, message, status = 500) {
    super(message);
    this.name = 'LeadError';
    this.code = code;
    this.status = status;
  }
}

class EcError extends LeadError {
  constructor(code, message, status = 502) {
    super(code, message, status);
    this.name = 'EcError';
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function region(value) {
  if (!value || typeof value !== 'object') return { code: '', name: '' };
  return { code: text(value.code, 20), name: text(value.name, 40) };
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new LeadError('INVALID_PAYLOAD', '请求内容无效。', 400);
  }
  const name = text(payload.name, 50);
  const phone = text(payload.phone, 20).replace(/\D/g, '');
  const province = region(payload.province);
  const city = region(payload.city);
  const district = region(payload.district);
  const brands = [...new Set(Array.isArray(payload.brands) ? payload.brands.map((item) => text(item, 40)) : [])]
    .filter((slug) => BRAND_SLUGS.has(slug));
  const message = text(payload.message, 2000);

  if (!name) throw new LeadError('NAME_REQUIRED', '请填写称呼。', 400);
  if (!/^1[3-9]\d{9}$/.test(phone)) throw new LeadError('PHONE_INVALID', '请输入11位有效手机号码。', 400);
  if (!province.code || !province.name || !city.code || !city.name || !district.code || !district.name) {
    throw new LeadError('REGION_REQUIRED', '请选择完整的省、市、区/县。', 400);
  }
  if (!brands.length) throw new LeadError('BRAND_REQUIRED', '请至少选择一个意向品牌。', 400);

  return { name, phone, province, city, district, brands, message };
}

function md5(input) {
  const bytes = new TextEncoder().encode(input);
  const bitLength = bytes.length * 8;
  const paddedLength = ((bytes.length + 9 + 63) >> 6) << 6;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;
  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  const shift = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000));
  const rotateLeft = (value, amount) => (value << amount) | (value >>> (32 - amount));
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let index = 0; index < 64; index += 1) {
      let f;
      let g;
      if (index < 16) {
        f = (b & c) | (~b & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * index) % 16;
      }
      const next = d;
      const sum = (a + f + constants[index] + words[g]) >>> 0;
      d = c;
      c = b;
      b = (b + rotateLeft(sum, shift[index])) >>> 0;
      a = next;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return [a0, b0, c0, d0]
    .flatMap((word) => [word & 0xff, (word >>> 8) & 0xff, (word >>> 16) & 0xff, (word >>> 24) & 0xff])
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(input) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readEcConfig(env) {
  const followUserIds = text(env.EC_FOLLOW_USER_IDS, 500)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const config = {
    baseUrl: text(env.EC_BASE_URL, 200).replace(/\/$/, '') || 'https://open.workec.com/v2',
    corpId: text(env.EC_CORP_ID, 100),
    appId: text(env.EC_APP_ID, 100),
    appSecret: text(env.EC_APP_SECRET, 200),
    operatorUserId: text(env.EC_OPERATOR_USER_ID, 100),
    departmentId: text(env.EC_DEPARTMENT_ID, 100),
    assignmentMode: text(env.EC_ASSIGNMENT_MODE, 30) || 'round_robin',
    followUserIds,
  };
  const required = ['corpId', 'appId', 'appSecret', 'operatorUserId', 'departmentId'];
  if (required.some((key) => !config[key]) || !config.followUserIds.length) {
    throw new LeadError('EC_NOT_READY', 'EC 线索服务尚未完成配置。', 503);
  }
  if (!['fixed', 'round_robin'].includes(config.assignmentMode)) {
    throw new LeadError('EC_ASSIGNMENT_MODE_INVALID', 'EC 客资分配策略尚未确认。', 503);
  }
  if (config.assignmentMode === 'fixed' && config.followUserIds.length !== 1) {
    throw new LeadError('EC_ASSIGNMENT_CONFIG_INVALID', '固定跟进人配置不唯一。', 503);
  }
  return config;
}

function numericId(value) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : value;
}

function chooseFollowUserId(leadId, config) {
  const index = config.assignmentMode === 'fixed'
    ? 0
    : (Math.max(1, Number(leadId)) - 1) % config.followUserIds.length;
  return numericId(config.followUserIds[index]);
}

function ecErrorMessage(payload, fallback) {
  if (!payload || typeof payload !== 'object') return fallback;
  return text(payload.msg || payload.message || payload.error, 240) || fallback;
}

function ecCode(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const value = payload.code ?? payload.errCode ?? payload.errorCode;
  return value == null ? '' : String(value);
}

function assertEcSuccess(payload) {
  const code = ecCode(payload);
  if (code && !['0', '200'].includes(code)) {
    throw new EcError(`EC_${code}`, ecErrorMessage(payload, 'EC 接口返回失败。'));
  }
  return payload;
}

async function ecRequest(config, method, path, body) {
  const timeStamp = Date.now();
  const sign = md5(`appId=${config.appId}&appSecret=${config.appSecret}&timeStamp=${timeStamp}`).toUpperCase();
  const response = await fetch(`${config.baseUrl}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Ec-Cid': config.corpId,
      'X-Ec-Sign': sign,
      'X-Ec-TimeStamp': String(timeStamp),
    },
    body: method === 'GET' ? undefined : JSON.stringify(body || {}),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new EcError(`HTTP_${response.status}`, 'EC 接口返回了无效响应。');
  }
  if (!response.ok) throw new EcError(`HTTP_${response.status}`, ecErrorMessage(payload, 'EC 接口请求失败。'));
  return assertEcSuccess(payload);
}

function findCrmId(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return '';
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findCrmId(item, seen);
      if (found) return found;
    }
    return '';
  }
  for (const key of ['crmId', 'crmID', 'crm_id']) {
    if (value[key] != null && String(value[key])) return String(value[key]);
  }
  for (const key of ['data', 'list', 'result', 'items', 'rows']) {
    const found = findCrmId(value[key], seen);
    if (found) return found;
  }
  return '';
}

function leadMemo(payload, config) {
  const lines = [
    '官网咨询线索',
    `意向品牌：${payload.brands.join('、')}`,
    `所在城市：${payload.province.name} / ${payload.city.name} / ${payload.district.name}`,
    `EC目标部门：${config.departmentId}`,
  ];
  if (payload.message) lines.push(`补充说明：${payload.message}`);
  return lines.join('\n').slice(0, 1900);
}

async function selectLead(db, dedupeKey) {
  return db.prepare(`
    SELECT id, status, ec_crm_id, assigned_user_id
    FROM consultation_leads
    WHERE dedupe_key = ?
    LIMIT 1
  `).bind(dedupeKey).first();
}

async function updateLead(db, id, fields) {
  await db.prepare(`
    UPDATE consultation_leads
    SET status = ?, ec_crm_id = ?, ec_department_id = ?, assigned_user_id = ?, error_code = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    fields.status,
    fields.ecCrmId || null,
    fields.ecDepartmentId || null,
    fields.assignedUserId || null,
    fields.errorCode || null,
    fields.errorMessage || null,
    id,
  ).run();
}

async function submitLead(payload, env) {
  const config = readEcConfig(env);
  if (!env.DB) throw new LeadError('DB_NOT_READY', '线索存储尚未完成配置。', 503);

  const day = new Date().toISOString().slice(0, 10);
  const dedupeKey = await sha256([
    day,
    payload.phone,
    payload.province.code,
    payload.city.code,
    payload.district.code,
    [...payload.brands].sort().join(','),
  ].join('|'));
  let lead = await selectLead(env.DB, dedupeKey);
  if (lead?.status === 'succeeded') return { duplicate: true, leadId: lead.id, crmId: lead.ec_crm_id };
  if (lead?.status === 'pending') return { pending: true, leadId: lead.id };

  if (!lead) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO consultation_leads
        (dedupe_key, name, phone, province_code, province_name, city_code, city_name, district_code, district_name, brands_json, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      dedupeKey,
      payload.name,
      payload.phone,
      payload.province.code,
      payload.province.name,
      payload.city.code,
      payload.city.name,
      payload.district.code,
      payload.district.name,
      JSON.stringify(payload.brands),
      payload.message,
    ).run();
    lead = await selectLead(env.DB, dedupeKey);
  } else {
    await updateLead(env.DB, lead.id, { status: 'pending' });
  }
  if (!lead) throw new LeadError('LEAD_STORE_FAILED', '线索保存失败，请稍后重试。', 503);
  if (lead.status === 'succeeded') return { duplicate: true, leadId: lead.id, crmId: lead.ec_crm_id };
  if (lead.status === 'pending' && lead.ec_crm_id) return { duplicate: true, leadId: lead.id, crmId: lead.ec_crm_id };

  const followUserId = chooseFollowUserId(lead.id, config);
  await updateLead(env.DB, lead.id, {
    status: 'pending',
    ecDepartmentId: config.departmentId,
    assignedUserId: String(followUserId),
  });

  try {
    const existingResponse = await ecRequest(config, 'POST', 'customer/queryExist', {
      mobile: payload.phone,
      maxNumsPreMobile: 1,
      includes: [],
    });
    const existingCrmId = findCrmId(existingResponse);
    let crmId = existingCrmId;
    let action = 'created';
    if (existingCrmId) {
      await ecRequest(config, 'POST', 'customer/change/user', {
        optUserId: numericId(config.operatorUserId),
        crmIds: existingCrmId,
        followUserId,
      });
      action = 'reassigned-existing';
    } else {
      const createdResponse = await ecRequest(config, 'POST', 'customer/addCustomer', {
        optUserId: numericId(config.operatorUserId),
        list: [{
          name: payload.name,
          mobile: payload.phone,
          followUserId,
          memo: leadMemo(payload, config),
        }],
        notify: true,
        repeat: false,
      });
      crmId = findCrmId(createdResponse);
      if (!crmId) throw new EcError('EC_CRM_ID_MISSING', 'EC 创建客户后未返回客户 ID。');
    }
    await updateLead(env.DB, lead.id, {
      status: 'succeeded',
      ecCrmId: crmId,
      ecDepartmentId: config.departmentId,
      assignedUserId: String(followUserId),
    });
    return { leadId: lead.id, crmId, assignedUserId: String(followUserId), action };
  } catch (error) {
    const code = error instanceof LeadError ? error.code : 'EC_UNKNOWN';
    const message = error instanceof Error ? error.message : 'EC 请求失败。';
    await updateLead(env.DB, lead.id, {
      status: 'failed',
      ecDepartmentId: config.departmentId,
      assignedUserId: String(followUserId),
      errorCode: code,
      errorMessage: message.slice(0, 240),
    });
    throw error;
  }
}

export async function handleConsultation(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 32 * 1024) return jsonResponse({ error: 'PAYLOAD_TOO_LARGE' }, 413);

  try {
    const payload = normalizePayload(await request.json());
    const result = await submitLead(payload, env);
    if (result.pending) return jsonResponse({ ok: false, status: 'pending', leadId: result.leadId }, 202);
    if (result.duplicate) return jsonResponse({ ok: true, status: 'duplicate', leadId: result.leadId }, 200);
    return jsonResponse({ ok: true, status: 'created', leadId: result.leadId }, 201);
  } catch (error) {
    const leadError = error instanceof LeadError ? error : new LeadError('LEAD_UNKNOWN', '线索提交失败。');
    console.error('[consultation]', leadError.code, leadError.message);
    return jsonResponse({ error: leadError.code }, leadError.status);
  }
}

const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/consultations') return handleConsultation(request, env);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    let response = await env.ASSETS.fetch(assetRequest(request, pathname));
    if (response.status === 404 && pathname.endsWith('/')) {
      response = await env.ASSETS.fetch(assetRequest(request, `${pathname}index.html`));
    }
    return response;
  },
};

export { ecRequest, findCrmId };

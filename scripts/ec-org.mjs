import { ecRequest } from '../server/index.js';

const config = {
  baseUrl: (process.env.EC_BASE_URL || 'https://open.workec.com/v2').replace(/\/$/, ''),
  corpId: process.env.EC_CORP_ID || '',
  appId: process.env.EC_APP_ID || '',
  appSecret: process.env.EC_APP_SECRET || '',
};

if (!config.corpId || !config.appId || !config.appSecret) {
  console.error('EC_CORP_ID、EC_APP_ID、EC_APP_SECRET 均为必填环境变量。');
  process.exit(2);
}

function displayName(value) {
  if (!value || typeof value !== 'object') return '';
  return value.name || value.deptName || value.departmentName || value.userName || value.realName || value.employeeName || '';
}

function knownId(value) {
  if (!value || typeof value !== 'object') return '';
  return value.deptId || value.departmentId || value.userId || value.employeeId || '';
}

function collectMatches(value, matches = [], parentDepartment = '') {
  if (!value || typeof value !== 'object') return matches;
  if (Array.isArray(value)) {
    value.forEach((item) => collectMatches(item, matches, parentDepartment));
    return matches;
  }
  const name = displayName(value);
  const id = knownId(value);
  const department = value.deptName || value.departmentName || parentDepartment;
  if (name === '测试部门' || name === '葛子新' || name === '汪文皓') {
    matches.push({ name, id: String(id || ''), department });
  }
  const nextDepartment = name === '测试部门' ? name : parentDepartment;
  Object.values(value).forEach((child) => collectMatches(child, matches, nextDepartment));
  return matches;
}

try {
  const response = await ecRequest(config, 'GET', 'org/struct/info');
  const matches = collectMatches(response);
  console.log(JSON.stringify({ matches }, null, 2));
} catch (error) {
  console.error(JSON.stringify({
    code: error?.code || 'EC_UNKNOWN',
    message: error?.message || 'EC 组织架构查询失败。',
  }));
  process.exit(1);
}

CREATE TABLE IF NOT EXISTS consultation_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dedupe_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province_code TEXT NOT NULL,
  province_name TEXT NOT NULL,
  city_code TEXT NOT NULL,
  city_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  brands_json TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  ec_crm_id TEXT,
  ec_department_id TEXT,
  assigned_user_id TEXT,
  error_code TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultation_leads_phone
  ON consultation_leads(phone);

CREATE INDEX IF NOT EXISTS idx_consultation_leads_status
  ON consultation_leads(status, updated_at);

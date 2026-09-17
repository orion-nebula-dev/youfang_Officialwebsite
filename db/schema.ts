// D1 schema source of truth for the raw Worker queries in server/index.js.
// The production migration lives in drizzle/0000_consultation_leads.sql.
export const consultationLeads = {
  table: 'consultation_leads',
  columns: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    dedupeKey: 'TEXT NOT NULL UNIQUE',
    name: 'TEXT NOT NULL',
    phone: 'TEXT NOT NULL',
    provinceCode: 'TEXT NOT NULL',
    provinceName: 'TEXT NOT NULL',
    cityCode: 'TEXT NOT NULL',
    cityName: 'TEXT NOT NULL',
    districtCode: 'TEXT NOT NULL',
    districtName: 'TEXT NOT NULL',
    brandsJson: 'TEXT NOT NULL',
    message: "TEXT NOT NULL DEFAULT ''",
    status: "TEXT NOT NULL DEFAULT 'pending'",
    ecCrmId: 'TEXT',
    ecDepartmentId: 'TEXT',
    assignedUserId: 'TEXT',
    errorCode: 'TEXT',
    errorMessage: 'TEXT',
    createdAt: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
  },
};

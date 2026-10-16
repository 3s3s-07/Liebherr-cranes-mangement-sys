import {
  pgTable, pgEnum, bigint, varchar, text, boolean, timestamp,
  integer, numeric, date, index, customType,
} from 'drizzle-orm/pg-core';

// PostgreSQL bigint accommodates the source MySQL unsigned INT identifiers.
const id = () => bigint({ mode: 'number' }).generatedByDefaultAsIdentity().primaryKey();
const createdAt = () => timestamp('created_at', { mode: 'string' }).notNull().defaultNow();
const updatedAt = () => timestamp('updated_at', { mode: 'string' }).notNull().defaultNow();
const bytea = customType<{ data: Buffer }>({ dataType: () => 'bytea' });

export const userRole = pgEnum('user_role', ['admin', 'user']);
export const craneStatus = pgEnum('crane_status', ['Active', 'Under Maintenance', 'Inactive']);
export const craneTransactionType = pgEnum('crane_transaction_type', ['revenue', 'expense']);
export const personTransactionType = pgEnum('person_transaction_type', ['expense', 'payment']);
export const companyCategory = pgEnum('company_category', ['ahmed', 'abdalla', 'ayman', 'aly', 'general', 'revenue']);

export const users = pgTable('users', {
  id: id(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRole().notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const cranes = pgTable('cranes', {
  id: id(),
  modelName: varchar('model_name', { length: 255 }).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().unique(),
  location: varchar({ length: 255 }),
  currentLocation: varchar('current_location', { length: 255 }),
  modelYear: integer('model_year'),
  status: craneStatus().notNull().default('Active'),
  capacityTons: numeric('capacity_tons', { precision: 10, scale: 2 }),
  operatorName: varchar('operator_name', { length: 255 }),
  helperName: varchar('helper_name', { length: 255 }),
  additionalNotes: text('additional_notes'),
  maintenanceDetails: text('maintenance_details'),
  financeDetails: text('finance_details'),
  imageData: text('image_data'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const craneCertificates = pgTable('crane_certificates', {
  id: id(),
  craneId: bigint('crane_id', { mode: 'number' }).notNull().references(() => cranes.id, { onDelete: 'cascade' }),
  certificateName: varchar('certificate_name', { length: 255 }).notNull(),
  issueDate: date('issue_date').notNull(),
  expireDate: date('expire_date').notNull(),
  fileName: varchar('file_name', { length: 255 }),
  fileData: bytea('file_data'),
  createdAt: createdAt(),
}, (table) => [index('idx_crane_certificates_crane_id').on(table.craneId)]);

export const craneMaintenanceRecords = pgTable('crane_maintenance_records', {
  id: id(),
  craneId: bigint('crane_id', { mode: 'number' }).notNull().references(() => cranes.id, { onDelete: 'cascade' }),
  maintenanceDate: date('maintenance_date').notNull(),
  problemCause: varchar('problem_cause', { length: 500 }).notNull(),
  repairedBy: varchar('repaired_by', { length: 255 }).notNull(),
  sparePartUsed: varchar('spare_part_used', { length: 500 }),
  costEgp: numeric('cost_egp', { precision: 12, scale: 2 }).notNull().default('0'),
  invoiceName: varchar('invoice_name', { length: 255 }),
  invoiceData: bytea('invoice_data'),
  createdAt: createdAt(),
}, (table) => [index('idx_crane_maintenance_crane_id').on(table.craneId)]);

export const craneFinanceTransactions = pgTable('crane_finance_transactions', {
  id: id(),
  craneId: bigint('crane_id', { mode: 'number' }).notNull().references(() => cranes.id, { onDelete: 'cascade' }),
  type: craneTransactionType().notNull(),
  transactionDate: date('transaction_date').notNull(),
  amount: numeric({ precision: 14, scale: 2 }).notNull(),
  details: varchar({ length: 500 }).notNull(),
  createdAt: createdAt(),
}, (table) => [index('idx_crane_finance_crane_date').on(table.craneId, table.transactionDate)]);

export const persons = pgTable('persons', {
  id: id(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 150 }).notNull(),
  createdAt: createdAt(),
}, (table) => [index('idx_persons_name').on(table.name)]);

export const personTransactions = pgTable('person_transactions', {
  id: id(),
  personId: bigint('person_id', { mode: 'number' }).notNull().references(() => persons.id, { onDelete: 'cascade' }),
  type: personTransactionType().notNull(),
  transactionDate: date('transaction_date').notNull(),
  amount: numeric({ precision: 14, scale: 2 }).notNull(),
  details: varchar({ length: 500 }),
  createdAt: createdAt(),
}, (table) => [index('idx_person_transactions_person').on(table.personId)]);

export const companyTransactions = pgTable('company_transactions', {
  id: id(),
  category: companyCategory().notNull(),
  transactionDate: date('transaction_date').notNull(),
  amount: numeric({ precision: 14, scale: 2 }).notNull(),
  details: varchar({ length: 500 }),
  createdAt: createdAt(),
}, (table) => [index('idx_company_tx_date').on(table.transactionDate)]);

import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Interfaces ---
export interface ITenant extends Document {
  companyName: string;
  adminEmail: string;
  password?: string;
  licenseKey: string;
  uninstallerKey: string;
  allowedSeats: number;
  usedSeats: number;
  status: 'active' | 'suspended';
  plan: 'starter' | 'enterprise';
  settings: {
    aiSecurityOnly: boolean;
    strictMode: boolean;
    disableClipboard: boolean;
    disableInspectElement: boolean;
    whitelist: string[];
  };
}

export interface IAgent extends Document {
  tenantId: mongoose.Types.ObjectId;
  hostname: string;
  hardwareId: string;
  lastPulse: Date;
  status?: string;
  os: string;
  version: string;
}

export interface IViolation extends Document {
  tenantId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  domain: string;
  action: string;
  payloadSnippet: string;
  severity: string;
  appName?: string;
  windowTitle?: string;
}

export interface IGlobalConfig extends Document {
  masterRecoveryKey: string;
  lastUpdated: Date;
}

// --- Schemas ---

const TenantSchema = new Schema({
  companyName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  licenseKey: { type: String, required: true, unique: true },
  uninstallerKey: { type: String, required: true },
  allowedSeats: { type: Number, default: 5 },
  usedSeats: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  plan: { type: String, enum: ['starter', 'enterprise'], default: 'starter' },
  settings: {
    aiSecurityOnly: { type: Boolean, default: true },
    strictMode: { type: Boolean, default: false },
    disableClipboard: { type: Boolean, default: false },
    disableInspectElement: { type: Boolean, default: false },
    whitelist: [{ type: String }],
  }
}, { timestamps: true });

const AgentSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  hostname: { type: String },
  hardwareId: { type: String, required: true, unique: true },
  lastPulse: { type: Date, default: Date.now },
  status: { type: String, default: 'ACTIVE' },
  os: { type: String },
  version: { type: String },
}, { timestamps: true });

const ViolationSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  domain: { type: String, required: true },
  action: { type: String, enum: ['blocked', 'monitored'], default: 'blocked' },
  payloadSnippet: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  appName: { type: String, default: 'Unknown' },
  windowTitle: { type: String, default: 'Background Process' },
}, { timestamps: true });

const GlobalConfigSchema = new Schema({
  masterRecoveryKey: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

// Marketing Schemas
const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
}, { timestamps: true });

const AppointmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  googleMeetLink: { type: String },
}, { timestamps: true });

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

// --- Exports with Type Safety ---
export const Tenant: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
export const Agent: Model<IAgent> = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
export const Violation: Model<IViolation> = mongoose.models.Violation || mongoose.model<IViolation>('Violation', ViolationSchema);
export const GlobalConfig: Model<IGlobalConfig> = mongoose.models.GlobalConfig || mongoose.model<IGlobalConfig>('GlobalConfig', GlobalConfigSchema);
export const User: Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);
export const Contact: Model<any> = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Appointment: Model<any> = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

import type {
  FinanceRecord,
  GateEntry,
  GrnRecord,
  LedgerEntry,
  SkuMasterEntry,
  TeamMember,
  UnloadingRecord,
  ValidationIssue,
  VendorMasterEntry,
  VendorSubmission,
} from './types';

// Closed-loop demo: Hindustan Chemical Corporation, PO RM-2627-0020.
// Walked fully through Guard -> Validation -> Unloading -> GRN/QC -> Ledger -> Finance
// so a fresh install already shows one complete, trustworthy story end to end.
const HCC_GATE_ID = 'GE-1001';

export const seedGateEntries: GateEntry[] = [
  {
    id: HCC_GATE_ID,
    gateNo: 'GATE-1001',
    entryType: 'inward',
    poNumber: 'PO RM 2627 0020',
    vendorName: 'Hindustan Chemical Corporation',
    invoiceNumber: 'HCC/INV/4471',
    invoiceQty: 700,
    material: 'Sodium Fluoride',
    vehicleNumber: 'MH 04 GT 5521',
    driverName: 'Ramesh Yadav',
    transporter: 'Shree Logistics',
    location: 'Bhiwandi',
    gps: '19.2967 N, 73.0631 E',
    billScanned: true,
    status: 'closed',
    createdAt: '2026-06-25 09:12:04',
    slaDeadline: '2026-06-25 21:12:04',
  },
  {
    id: 'GE-1002',
    gateNo: 'GATE-1014',
    entryType: 'inward',
    poNumber: 'PO RM 2627 0031',
    vendorName: 'Konkan Minerals Pvt Ltd',
    invoiceNumber: 'KM/INV/1187',
    invoiceQty: 450,
    material: 'Calcium Carbonate',
    vehicleNumber: 'MH 12 KL 9902',
    driverName: 'Suresh Patil',
    transporter: 'Konkan Freight',
    location: 'Bhiwandi',
    gps: '19.2971 N, 73.0644 E',
    billScanned: true,
    status: 'pending_validation',
    createdAt: '2026-06-30 04:32:51',
    slaDeadline: '2026-06-30 16:32:51',
  },
  {
    id: 'GE-1003',
    gateNo: 'GATE-1015',
    entryType: 'inward',
    poNumber: 'PO RM 2627 0031',
    vendorName: 'Konkan Minerals Pvt Ltd',
    invoiceNumber: 'KM/INV/1187',
    invoiceQty: 450,
    material: 'Calcium Carbonate',
    vehicleNumber: 'MH 12 KL 4410',
    driverName: 'Anil More',
    transporter: 'Konkan Freight',
    location: 'Bhiwandi',
    gps: '19.2971 N, 73.0644 E',
    billScanned: true,
    status: 'pending_validation',
    createdAt: '2026-06-30 04:21:38',
    slaDeadline: '2026-06-30 16:21:38',
  },
  {
    id: 'GE-1004',
    gateNo: 'GATE-1009',
    entryType: 'inward',
    poNumber: 'PO RM 2627 0018',
    vendorName: 'Sagar Industrial Chemicals',
    invoiceNumber: 'SIC/INV/8820',
    invoiceQty: 300,
    material: 'Sodium Sulphate',
    vehicleNumber: 'MH 04 BT 7712',
    driverName: 'Vijay Sharma',
    transporter: 'Sagar Transport',
    location: 'Bhiwandi',
    gps: '19.2968 N, 73.0629 E',
    billScanned: true,
    status: 'pending_validation',
    createdAt: '2026-06-27 23:10:08',
    slaDeadline: '2026-06-28 11:10:08',
  },
];

export const seedValidationIssues: ValidationIssue[] = [
  {
    id: 'VI-2201',
    gateEntryId: 'GE-1002',
    code: 'DUP_INVOICE',
    title: 'Duplicate Invoice',
    description: 'Possible duplicate invoice detected',
    severity: 'hardFail',
    status: 'open',
    raisedAt: '2026-06-30 04:32:51',
  },
  {
    id: 'VI-2202',
    gateEntryId: 'GE-1003',
    code: 'DUP_INVOICE',
    title: 'Duplicate Invoice',
    description: 'Possible duplicate invoice detected',
    severity: 'hardFail',
    status: 'open',
    raisedAt: '2026-06-30 04:21:38',
  },
  {
    id: 'VI-2203',
    gateEntryId: 'GE-1004',
    code: 'DUP_INVOICE',
    title: 'Duplicate Invoice',
    description: 'Possible duplicate invoice detected',
    severity: 'hardFail',
    status: 'open',
    raisedAt: '2026-06-27 23:10:08',
  },
];

export const seedVendorSubmissions: VendorSubmission[] = [
  {
    id: 'VS-501',
    poNumber: 'PO RM 2627 0020',
    vendorName: 'Hindustan Chemical Corporation',
    invoiceNumber: 'HCC/INV/4471',
    invoiceQty: 700,
    material: 'Sodium Fluoride',
    hasInvoice: true,
    hasEwayBill: true,
    hasLrPod: true,
    status: 'acknowledged',
    submittedAt: '2026-06-25 07:40:00',
  },
];

export const seedUnloadingRecords: UnloadingRecord[] = [
  {
    gateEntryId: HCC_GATE_ID,
    boxCount: 28,
    stagingArea: 'Staging Bay 3',
    unloadedBy: 'Prakash Store Team',
    podLrRef: 'LR-88213',
    startedAt: '2026-06-25 09:40:00',
    completedAt: '2026-06-25 10:55:00',
  },
];

export const seedGrnRecords: GrnRecord[] = [
  {
    gateEntryId: HCC_GATE_ID,
    sku: 'Sodium Fluoride',
    poQty: 700,
    invoiceQty: 700,
    physicalReceived: 695,
    split: { accepted: 690, qcHold: 0, defective: 5, rejected: 0 },
    missing: 5,
    qcReasons: 'Minor bag damage on 1 pallet, 5 KG loss confirmed',
    suggestedBin: 'BHW-CHEM-A1',
    posted: true,
    createdAt: '2026-06-25 11:20:00',
  },
];

export const seedLedgerEntries: LedgerEntry[] = [
  {
    id: 'LG-9001',
    timestamp: '2026-06-25 11:22:00',
    gateEntryId: HCC_GATE_ID,
    sku: 'Sodium Fluoride',
    bin: 'BHW-CHEM-A1',
    bucket: 'available',
    qty: 690,
  },
  {
    id: 'LG-9002',
    timestamp: '2026-06-25 11:22:00',
    gateEntryId: HCC_GATE_ID,
    sku: 'Sodium Fluoride',
    bin: 'BHW-CHEM-A1',
    bucket: 'defective',
    qty: 5,
  },
];

export const seedFinanceRecords: FinanceRecord[] = [
  {
    gateEntryId: HCC_GATE_ID,
    vendorName: 'Hindustan Chemical Corporation',
    invoiceNumber: 'HCC/INV/4471',
    ratePerUnit: 42,
    invoiceValue: 700 * 42,
    acceptedValue: 690 * 42,
    deductions: { defective: 5 * 42, rejected: 0, missing: 5 * 42 },
    finalPayable: 690 * 42,
    vendorStatus: 'cleared',
    notes: 'Defective + missing deducted, debit note DN-3312 issued',
    createdAt: '2026-06-25 12:00:00',
  },
];

export const seedTeamMembers: TeamMember[] = [
  { id: 'TM-001', name: 'Ramesh Yadav', phone: '+91 98200 11223', description: 'Gate 1, day shift', role: 'guard', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-002', name: 'Hindustan Chemical Corporation', phone: '+91 22 6712 4400', description: 'Primary raw-material vendor', role: 'vendor', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-003', name: 'Vikram Rao', phone: '+91 98200 33445', description: 'Unloading bay 3-4', role: 'storeExec', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-004', name: 'Arjun Mehta', phone: '+91 98200 55667', description: 'QC — chemicals line', role: 'qc', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-005', name: 'Priya Deshmukh', phone: '+91 98200 77889', description: 'Bhiwandi warehouse', role: 'storeManager', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-006', name: 'Farhan Ali', phone: '+91 98200 99001', description: 'Vendor payments', role: 'finance', superAdmin: false, createdAt: '2026-05-02 09:00:00' },
  { id: 'TM-007', name: 'Priya Admin', phone: '+91 98200 11000', description: 'Founder — full access', role: 'admin', superAdmin: true, createdAt: '2026-05-02 09:00:00' },
];

export const seedSkuMaster: SkuMasterEntry[] = [
  { id: 'SKU-001', sku: 'Sodium Fluoride', category: 'Chemical — Raw Material', unit: 'KG', defaultBin: 'BHW-CHEM-A1', mapped: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'SKU-002', sku: 'Calcium Carbonate', category: 'Chemical — Raw Material', unit: 'KG', defaultBin: 'BHW-CHEM-A2', mapped: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'SKU-003', sku: 'Sodium Sulphate', category: 'Chemical — Raw Material', unit: 'KG', defaultBin: 'BHW-CHEM-A3', mapped: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'SKU-004', sku: 'Barium Chloride (new)', category: 'Chemical — Trial', unit: 'KG', defaultBin: '', mapped: false, createdAt: '2026-06-20 09:00:00' },
];

export const seedVendorMaster: VendorMasterEntry[] = [
  { id: 'VM-001', vendorName: 'Hindustan Chemical Corporation', gstNumber: '27AACCH1234K1Z5', contactPhone: '+91 22 6712 4400', contactEmail: 'accounts@hindustanchem.example', category: 'Raw material', active: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'VM-002', vendorName: 'Konkan Minerals Pvt Ltd', gstNumber: '27AAFCK5566L1Z2', contactPhone: '+91 22 6600 1122', contactEmail: 'sales@konkanminerals.example', category: 'Raw material', active: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'VM-003', vendorName: 'Sagar Industrial Chemicals', gstNumber: '27AADCS7788M1Z9', contactPhone: '+91 22 6600 3344', contactEmail: 'orders@sagarindustrial.example', category: 'Raw material', active: true, createdAt: '2026-05-02 09:00:00' },
  { id: 'VM-004', vendorName: 'Trial Run Minerals', gstNumber: '27AAGCT9911N1Z4', contactPhone: '+91 22 6600 5566', category: 'Trial vendor', active: false, createdAt: '2026-06-20 09:00:00' },
];

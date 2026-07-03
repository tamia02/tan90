// Mock PO master data — stands in for the real PO/vendor master (ERP or
// Zoho-backed) that Rate/Quantity/GST/SKU checks would run against. There is
// no such system connected yet, so this is a small known table used purely
// to make the Validation Engine's cross-checks demonstrable end to end.

export interface PoMasterRecord {
  poNumber: string;
  vendorName: string;
  vendorGst: string;
  expectedRate: number;
  expectedQty: number;
  sku: string;
  skuMapped: boolean;
}

export const poMaster: PoMasterRecord[] = [
  {
    poNumber: 'PO RM 2627 0020',
    vendorName: 'Hindustan Chemical Corporation',
    vendorGst: '27AACCH1234K1Z5',
    expectedRate: 42,
    expectedQty: 700,
    sku: 'Sodium Fluoride',
    skuMapped: true,
  },
  {
    poNumber: 'PO RM 2627 0031',
    vendorName: 'Konkan Minerals Pvt Ltd',
    vendorGst: '27AAFCK5566L1Z2',
    expectedRate: 18,
    expectedQty: 450,
    sku: 'Calcium Carbonate',
    skuMapped: true,
  },
  {
    poNumber: 'PO RM 2627 0018',
    vendorName: 'Sagar Industrial Chemicals',
    vendorGst: '27AADCS7788M1Z9',
    expectedRate: 26,
    expectedQty: 300,
    sku: 'Sodium Sulphate',
    skuMapped: true,
  },
  {
    poNumber: 'PO RM 2627 0045',
    vendorName: 'Trial Run Minerals',
    vendorGst: '27AAGCT9911N1Z4',
    expectedRate: 30,
    expectedQty: 200,
    sku: 'Barium Chloride (new)',
    skuMapped: false,
  },
];

export function findPoMaster(poNumber: string): PoMasterRecord | undefined {
  const q = poNumber.trim().toLowerCase();
  return poMaster.find((p) => p.poNumber.trim().toLowerCase() === q);
}

const knownSkus = new Set(poMaster.filter((p) => p.skuMapped).map((p) => p.sku.toLowerCase()));

export function isSkuMapped(material: string): boolean {
  return knownSkus.has(material.trim().toLowerCase());
}

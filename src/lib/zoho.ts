// Mocked Zoho Books/Inventory integration. There is no real Zoho API app
// configured yet (no Client ID/Secret/Org ID) — this simulates the sync
// behavior described in the blueprint so the flow is demoable end to end,
// and can be swapped for real API calls once credentials + a backend exist.

export interface ZohoInvoiceRecord {
  poNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceQty: number;
  material: string;
  ewayBillNumber: string;
}

const mockZohoInvoices: ZohoInvoiceRecord[] = [
  {
    poNumber: 'PO RM 2627 0020',
    invoiceNumber: 'HCC/INV/4471',
    invoiceDate: '2026-06-25',
    invoiceQty: 700,
    material: 'Sodium Fluoride',
    ewayBillNumber: 'EWB-3312890021',
  },
  {
    poNumber: 'PO RM 2627 0031',
    invoiceNumber: 'KM/INV/1187',
    invoiceDate: '2026-06-30',
    invoiceQty: 450,
    material: 'Calcium Carbonate',
    ewayBillNumber: 'EWB-3312890099',
  },
];

// Simulated network latency so the "Fetch from Zoho" action feels real.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchZohoInvoiceForPO(poNumber: string): Promise<ZohoInvoiceRecord | null> {
  await delay(650 + Math.random() * 400);
  const match = mockZohoInvoices.find((r) => r.poNumber.trim().toLowerCase() === poNumber.trim().toLowerCase());
  return match ?? null;
}

import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import RequireAuth from './components/RequireAuth';
import { StoreProvider } from './lib/store';
import ModuleLogin from './pages/ModuleLogin';
import RoleLogin from './pages/RoleLogin';

import CommandCenter from './pages/CommandCenter';

import GuardDashboard from './pages/GuardDashboard';
import GuardBillScan from './pages/GuardBillScan';
import GuardEntries from './pages/GuardEntries';
import GuardSlaTracker from './pages/GuardSlaTracker';

import VendorDashboard from './pages/VendorDashboard';
import VendorNewSubmission from './pages/VendorNewSubmission';
import VendorSubmissions from './pages/VendorSubmissions';
import VendorIssues from './pages/VendorIssues';

import StoreExecDashboard from './pages/StoreExecDashboard';
import UnloadingDesk from './pages/UnloadingDesk';
import UnloadingHistory from './pages/UnloadingHistory';
import StagingAreas from './pages/StagingAreas';

import QcDashboard from './pages/QcDashboard';
import QcModule from './pages/QcModule';
import QcHistory from './pages/QcHistory';
import QualityHolds from './pages/QualityHolds';
import QcStockLedger from './pages/QcStockLedger';

import StoreManagerDashboard from './pages/StoreManagerDashboard';
import GrnCheck from './pages/GrnCheck';
import GrnRegister from './pages/GrnRegister';
import StockBalance from './pages/StockBalance';
import StockLedgerPage from './pages/StockLedgerPage';
import ShelfBin from './pages/ShelfBin';
import ValidationIssues from './pages/ValidationIssues';

import FinanceDashboard from './pages/FinanceDashboard';
import FinanceReview from './pages/FinanceReview';
import VendorClaims from './pages/VendorClaims';
import FinanceReports from './pages/FinanceReports';

import AdminModule from './pages/AdminModule';
import TeamRoles from './pages/TeamRoles';
import Integrations from './pages/Integrations';
import SkuMaster from './pages/SkuMaster';
import VendorMaster from './pages/VendorMaster';
import AdminReports from './pages/AdminReports';

import Notifications from './pages/Notifications';
import SettingsPage from './pages/SettingsPage';
import ActivityLog from './pages/ActivityLog';
import HelpSupport from './pages/HelpSupport';

function guarded(role: Parameters<typeof RequireRole>[0]['role'], element: React.ReactNode) {
  return <RequireRole role={role}>{element}</RequireRole>;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ModuleLogin />} />
          <Route path="/login/:role" element={<RoleLogin />} />
          <Route element={<Layout />}>
            <Route path="/command-center" element={guarded('admin', <CommandCenter />)} />

            <Route path="/guard" element={guarded('guard', <GuardDashboard />)} />
            <Route path="/guard/scan" element={guarded('guard', <GuardBillScan />)} />
            <Route path="/guard/entries" element={guarded('guard', <GuardEntries />)} />
            <Route path="/guard/sla" element={guarded('guard', <GuardSlaTracker />)} />

            <Route path="/vendor" element={guarded('vendor', <VendorDashboard />)} />
            <Route path="/vendor/new" element={guarded('vendor', <VendorNewSubmission />)} />
            <Route path="/vendor/submissions" element={guarded('vendor', <VendorSubmissions />)} />
            <Route path="/vendor/issues" element={guarded('vendor', <VendorIssues />)} />

            <Route path="/unloading" element={guarded('storeExec', <StoreExecDashboard />)} />
            <Route path="/unloading/desk" element={guarded('storeExec', <UnloadingDesk />)} />
            <Route path="/unloading/history" element={guarded('storeExec', <UnloadingHistory />)} />
            <Route path="/unloading/staging" element={guarded('storeExec', <StagingAreas />)} />

            <Route path="/qc" element={guarded('qc', <QcDashboard />)} />
            <Route path="/qc/queue" element={guarded('qc', <QcModule />)} />
            <Route path="/qc/history" element={guarded('qc', <QcHistory />)} />
            <Route path="/qc/holds" element={guarded('qc', <QualityHolds />)} />
            <Route path="/qc/ledger" element={guarded('qc', <QcStockLedger />)} />

            <Route path="/grn" element={guarded('storeManager', <StoreManagerDashboard />)} />
            <Route path="/grn/check" element={guarded('storeManager', <GrnCheck />)} />
            <Route path="/grn/register" element={guarded('storeManager', <GrnRegister />)} />
            <Route path="/grn/stock-balance" element={guarded('storeManager', <StockBalance />)} />
            <Route path="/grn/ledger" element={guarded('storeManager', <StockLedgerPage />)} />
            <Route path="/grn/bins" element={guarded('storeManager', <ShelfBin />)} />
            <Route path="/validation" element={guarded('storeManager', <ValidationIssues />)} />

            <Route path="/finance" element={guarded('finance', <FinanceDashboard />)} />
            <Route path="/finance/review" element={guarded('finance', <FinanceReview />)} />
            <Route path="/finance/claims" element={guarded('finance', <VendorClaims />)} />
            <Route path="/finance/reports" element={guarded('finance', <FinanceReports />)} />

            <Route path="/admin" element={guarded('admin', <AdminModule />)} />
            <Route path="/admin/team" element={guarded('admin', <TeamRoles />)} />
            <Route path="/admin/integrations" element={guarded('admin', <Integrations />)} />
            <Route path="/admin/sku" element={guarded('admin', <SkuMaster />)} />
            <Route path="/admin/vendors" element={guarded('admin', <VendorMaster />)} />
            <Route path="/admin/reports" element={guarded('admin', <AdminReports />)} />

            <Route
              path="/notifications"
              element={
                <RequireAuth>
                  <Notifications />
                </RequireAuth>
              }
            />
            <Route
              path="/activity"
              element={
                <RequireAuth>
                  <ActivityLog />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/help"
              element={
                <RequireAuth>
                  <HelpSupport />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}

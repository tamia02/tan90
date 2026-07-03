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
import VendorPortal from './pages/VendorPortal';
import ValidationIssues from './pages/ValidationIssues';
import UnloadingDesk from './pages/UnloadingDesk';
import QcModule from './pages/QcModule';
import GrnCheck from './pages/GrnCheck';
import FinanceModule from './pages/FinanceModule';
import AdminModule from './pages/AdminModule';
import Notifications from './pages/Notifications';
import SettingsPage from './pages/SettingsPage';
import ActivityLog from './pages/ActivityLog';
import HelpSupport from './pages/HelpSupport';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ModuleLogin />} />
          <Route path="/login/:role" element={<RoleLogin />} />
          <Route element={<Layout />}>
            <Route
              path="/command-center"
              element={
                <RequireRole role="admin">
                  <CommandCenter />
                </RequireRole>
              }
            />
            <Route
              path="/guard"
              element={
                <RequireRole role="guard">
                  <GuardDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/guard/scan"
              element={
                <RequireRole role="guard">
                  <GuardBillScan />
                </RequireRole>
              }
            />
            <Route
              path="/guard/entries"
              element={
                <RequireRole role="guard">
                  <GuardEntries />
                </RequireRole>
              }
            />
            <Route
              path="/vendor"
              element={
                <RequireRole role="vendor">
                  <VendorPortal />
                </RequireRole>
              }
            />
            <Route
              path="/unloading"
              element={
                <RequireRole role="storeExec">
                  <UnloadingDesk />
                </RequireRole>
              }
            />
            <Route
              path="/qc"
              element={
                <RequireRole role="qc">
                  <QcModule />
                </RequireRole>
              }
            />
            <Route
              path="/grn"
              element={
                <RequireRole role="storeManager">
                  <GrnCheck />
                </RequireRole>
              }
            />
            <Route
              path="/validation"
              element={
                <RequireRole role="storeManager">
                  <ValidationIssues />
                </RequireRole>
              }
            />
            <Route
              path="/finance"
              element={
                <RequireRole role="finance">
                  <FinanceModule />
                </RequireRole>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <AdminModule />
                </RequireRole>
              }
            />
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

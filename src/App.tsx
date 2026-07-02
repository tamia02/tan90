import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import { StoreProvider } from './lib/store';
import ModuleLogin from './pages/ModuleLogin';
import RoleLogin from './pages/RoleLogin';
import CommandCenter from './pages/CommandCenter';
import GuardPortal from './pages/GuardPortal';
import VendorPortal from './pages/VendorPortal';
import ValidationIssues from './pages/ValidationIssues';
import StoreManager from './pages/StoreManager';
import QcModule from './pages/QcModule';
import FinanceModule from './pages/FinanceModule';
import AdminModule from './pages/AdminModule';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ModuleLogin />} />
            <Route path="/login/:role" element={<RoleLogin />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route
              path="/guard"
              element={
                <RequireRole role="guard">
                  <GuardPortal />
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
              path="/validation"
              element={
                <RequireRole role="store">
                  <ValidationIssues />
                </RequireRole>
              }
            />
            <Route
              path="/store"
              element={
                <RequireRole role="store">
                  <StoreManager />
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
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}

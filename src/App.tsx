import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useWallet } from "./context/WalletContext";

// Pages
import Welcome from "./pages/Welcome";
import CreateWallet from "./pages/CreateWallet";
import ImportWallet from "./pages/ImportWallet";
import Dashboard from "./pages/Dashboard";
import BackupWallet from "./pages/BackupWallet";
import SendPage from "./pages/Send";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Setting from "./pages/Settings";

function App() {
  const { isInitialized, checkWalletExists } = useWallet();

  useEffect(() => {
    checkWalletExists();
    
  }, [checkWalletExists]);

  // Show loading while checking wallet existence
  if (isInitialized === null) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-neutral-300">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isInitialized ? <Navigate to="/dashboard" replace /> : <Welcome />
        }
      />
      <Route path="/create" element={<CreateWallet />} />
      <Route path="/import" element={<ImportWallet />} />
      <Route path="/backup" element={<BackupWallet />} />
      <Route path="/settings" element={<Setting />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/send"
        element={
          <ProtectedRoute>
            <SendPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

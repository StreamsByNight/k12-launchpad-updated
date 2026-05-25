import { AuthProvider, useAuth } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { AppLayout } from "./components/AppLayout";
import { Header } from "./components/Header";
import { BentoGrid } from "./components/BentoGrid";
import { CoursesSection } from "./components/CoursesSection";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

function DashboardApp() {
  return (
    <DashboardProvider>
      <AppLayout>
        <main className="mx-auto max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <Header />
          <BentoGrid />
          <CoursesSection />
        </main>
      </AppLayout>
    </DashboardProvider>
  );
}

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  if (window.location.pathname === "/auth/callback") {
    return <AuthCallbackPage />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

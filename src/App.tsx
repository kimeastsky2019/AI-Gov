import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { AuthProvider, useAuth } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";

// Import Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import RiskAssessmentPage from "@/pages/RiskAssessment";
import Compliance from "@/pages/Compliance";
import AIServices from "@/pages/AIServices";
import Reports from "@/pages/Reports";
import AIIntelligence from "@/pages/AIIntelligence";
import RiskAssessmentWizard from "@/pages/RiskAssessmentWizard";
import SLLMStudio from "@/pages/SLLMStudio";

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/**
 * ProtectedRoute - 로그인 필요 페이지 보호
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <>{children}</>;
}

/**
 * AppRoutes - 인증 상태 기반 라우팅
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTE_PATHS.HOME} element={<Home />} />
      <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
      <Route path={ROUTE_PATHS.REGISTER} element={<Register />} />

      {/* Protected Routes - 로그인 필요 */}
      <Route path={ROUTE_PATHS.DASHBOARD} element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.RISK_ASSESSMENT} element={
        <ProtectedRoute><RiskAssessmentPage /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.COMPLIANCE} element={
        <ProtectedRoute><Compliance /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.AI_SERVICES} element={
        <ProtectedRoute><AIServices /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.REPORTS} element={
        <ProtectedRoute><Reports /></ProtectedRoute>
      } />
      <Route path="/ai-intelligence" element={
        <ProtectedRoute><AIIntelligence /></ProtectedRoute>
      } />
      <Route path="/risk-assessment/wizard" element={
        <ProtectedRoute><RiskAssessmentWizard /></ProtectedRoute>
      } />
      <Route path="/sllm-studio" element={
        <ProtectedRoute><SLLMStudio /></ProtectedRoute>
      } />

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">
              요청하신 페이지를 찾을 수 없습니다.
            </p>
            <a
              href={ROUTE_PATHS.HOME}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              홈으로 돌아가기
            </a>
          </div>
        }
      />
    </Routes>
  );
}

/**
 * App Component
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand={false} richColors />
        <BrowserRouter>
          <I18nProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </I18nProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

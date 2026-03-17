import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { AuthProvider, useAuth } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";

// Import Pages - Public
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Import Pages - AI 거버넌스 필라
import GovernanceDashboard from "@/pages/GovernanceDashboard";
import RiskManagement from "@/pages/RiskManagement";
import Organization from "@/pages/Organization";
import AIServiceManagement from "@/pages/AIServiceManagement";
import GovernanceReports from "@/pages/GovernanceReports";

// Import Pages - AI 기술 검토 필라
import DataQualityReview from "@/pages/DataQualityReview";
import ModelPerformance from "@/pages/ModelPerformance";
import FairnessReview from "@/pages/FairnessReview";
import ExplainabilityReview from "@/pages/ExplainabilityReview";
import SecurityReview from "@/pages/SecurityReview";
import SLLMStudio from "@/pages/SLLMStudio";

// Import Pages - 플로우
import GovernanceFlowStepPage from "@/pages/flow/GovernanceFlowStepPage";
import DataQualityFlowStepPage from "@/pages/flow/DataQualityFlowStepPage";

// Import Pages - AI관련 규제 검토 필라
import PrivacyReview from "@/pages/PrivacyReview";
import ConsumerProtection from "@/pages/ConsumerProtection";
import EthicsReview from "@/pages/EthicsReview";
import ComplianceManagement from "@/pages/ComplianceManagement";
import AIIntelligence from "@/pages/AIIntelligence";

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
 * AppRoutes - 3대 필라 기반 라우팅
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path={ROUTE_PATHS.HOME} element={<Home />} />
      <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
      <Route path={ROUTE_PATHS.REGISTER} element={<Register />} />

      {/* ══════════════════════════════════════════════
          AI 거버넌스 필라
         ══════════════════════════════════════════════ */}
      <Route path={ROUTE_PATHS.GOVERNANCE_DASHBOARD} element={
        <ProtectedRoute><GovernanceDashboard /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.RISK_MANAGEMENT} element={
        <ProtectedRoute><RiskManagement /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.ORGANIZATION} element={
        <ProtectedRoute><Organization /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.SERVICE_MANAGEMENT} element={
        <ProtectedRoute><AIServiceManagement /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.GOVERNANCE_REPORTS} element={
        <ProtectedRoute><GovernanceReports /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.GOVERNANCE_FLOW} element={
        <ProtectedRoute><GovernanceFlowStepPage /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.DQ_FLOW} element={
        <ProtectedRoute><DataQualityFlowStepPage /></ProtectedRoute>
      } />

      {/* ══════════════════════════════════════════════
          AI 기술 검토 필라
         ══════════════════════════════════════════════ */}
      <Route path={ROUTE_PATHS.DATA_QUALITY} element={
        <ProtectedRoute><DataQualityReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.MODEL_PERFORMANCE} element={
        <ProtectedRoute><ModelPerformance /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.FAIRNESS} element={
        <ProtectedRoute><FairnessReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.EXPLAINABILITY} element={
        <ProtectedRoute><ExplainabilityReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.SECURITY} element={
        <ProtectedRoute><SecurityReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.SLLM_STUDIO} element={
        <ProtectedRoute><SLLMStudio /></ProtectedRoute>
      } />

      {/* ══════════════════════════════════════════════
          AI관련 규제 검토 필라
         ══════════════════════════════════════════════ */}
      <Route path={ROUTE_PATHS.PRIVACY} element={
        <ProtectedRoute><PrivacyReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.CONSUMER_PROTECTION} element={
        <ProtectedRoute><ConsumerProtection /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.ETHICS} element={
        <ProtectedRoute><EthicsReview /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.COMPLIANCE_MGMT} element={
        <ProtectedRoute><ComplianceManagement /></ProtectedRoute>
      } />
      <Route path={ROUTE_PATHS.AI_INTELLIGENCE} element={
        <ProtectedRoute><AIIntelligence /></ProtectedRoute>
      } />

      {/* ── Legacy URL 리다이렉트 (기존 북마크 호환) ── */}
      <Route path="/dashboard" element={<Navigate to={ROUTE_PATHS.GOVERNANCE_DASHBOARD} replace />} />
      <Route path="/risk-assessment" element={<Navigate to={ROUTE_PATHS.RISK_MANAGEMENT} replace />} />
      <Route path="/risk-assessment/wizard" element={<Navigate to={ROUTE_PATHS.RISK_MANAGEMENT} replace />} />
      <Route path="/compliance" element={<Navigate to={ROUTE_PATHS.COMPLIANCE_MGMT} replace />} />
      <Route path="/ai-services" element={<Navigate to={ROUTE_PATHS.SERVICE_MANAGEMENT} replace />} />
      <Route path="/reports" element={<Navigate to={ROUTE_PATHS.GOVERNANCE_REPORTS} replace />} />
      <Route path="/ai-intelligence" element={<Navigate to={ROUTE_PATHS.AI_INTELLIGENCE} replace />} />
      <Route path="/sllm-studio" element={<Navigate to={ROUTE_PATHS.SLLM_STUDIO} replace />} />

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

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RiskAssessment } from '@/lib/index';
import { useI18n } from '@/lib/i18n';
import { riskAssessmentAPI } from '@/api/client';
import { createMockRiskAssessments } from '@/data/index';

/**
 * AI 거버넌스 플랫폼의 위험 평가 데이터를 관리하기 위한 커스텀 훅입니다.
 * SQLite 백엔드 API 연동 + 오프라인 폴백 지원
 */
export function useRiskAssessment() {
  const { t } = useI18n();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 로드, 실패 시 mock 데이터로 폴백
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await riskAssessmentAPI.getAll();
        const items = response.data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          riskLevel: item.risk_level,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          description: item.description,
          assessor: item.assessor,
        }));
        setAssessments(items);
        setError(null);
      } catch (err) {
        console.warn('API connection failed, falling back to mock data:', err);
        setAssessments(createMockRiskAssessments(t));
        setError(null); // Silent fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addAssessment = useCallback(async (data: Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await riskAssessmentAPI.create({
        title: data.title,
        category: data.category,
        riskLevel: data.riskLevel,
        description: data.description,
        assessor: data.assessor,
      });
      const item = response.data;
      const newRecord: RiskAssessment = {
        id: item.id,
        title: item.title,
        category: item.category,
        riskLevel: item.risk_level,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        description: item.description,
        assessor: item.assessor,
      };
      setAssessments((prev) => [newRecord, ...prev]);
      return newRecord;
    } catch {
      // Offline fallback
      const now = new Date().toISOString().split('T')[0];
      const newRecord: RiskAssessment = {
        ...data,
        id: `RA-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: now,
        updatedAt: now,
      };
      setAssessments((prev) => [newRecord, ...prev]);
      return newRecord;
    }
  }, []);

  const updateAssessment = useCallback(async (id: string, updates: Partial<RiskAssessment>) => {
    try {
      await riskAssessmentAPI.update(id, updates);
    } catch { /* offline mode */ }
    setAssessments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
  }, []);

  const deleteAssessment = useCallback(async (id: string) => {
    try {
      await riskAssessmentAPI.delete(id);
    } catch { /* offline mode */ }
    setAssessments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const riskSummary = useMemo(() => ({
    total: assessments.length,
    unacceptable: assessments.filter((a) => a.riskLevel === 'UNACCEPTABLE').length,
    high: assessments.filter((a) => a.riskLevel === 'HIGH').length,
    medium: assessments.filter((a) => a.riskLevel === 'MEDIUM').length,
    low: assessments.filter((a) => a.riskLevel === 'LOW').length,
    completed: assessments.filter((a) => a.status === 'COMPLETED').length,
    inProgress: assessments.filter((a) => a.status === 'IN_PROGRESS').length,
    pending: assessments.filter((a) => a.status === 'PENDING').length,
  }), [assessments]);

  return {
    assessments,
    isLoading,
    error,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    riskSummary,
  };
}

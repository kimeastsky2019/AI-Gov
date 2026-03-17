/**
 * 데이터 품질 검증 플로우 단계별 요구사항
 */

export interface DqFlowFeatureDetail {
  featureName: string;
  requirement: string;
  description: string;
  uiType?: "default" | "approval" | "selection" | "monitoring" | "upload_only" | "checklist" | "dashboard_link";
  actionButtons?: ("save" | "approve" | "reject" | "confirm" | "request_revision" | "deploy" | "request_approval" | "apply")[];
  placeholder?: string;
  options?: string[];
}

const REQUIREMENTS: Record<string, DqFlowFeatureDetail[]> = {
  // ── Phase 1 ──
  "dq-plan": [
    {
      featureName: "검증 대상 데이터셋 식별",
      requirement: "AI 모델 학습에 사용될 모든 데이터셋을 식별하고 각 데이터셋의 중요도, 크기, 갱신 주기를 정의합니다.",
      description: "검증 범위를 명확히 하여 누락 없는 품질 검증을 보장합니다.",
      placeholder: "예: 거래내역(DS-001), 고객정보(DS-002), 신용도(DS-003)...",
      actionButtons: ["save"],
    },
    {
      featureName: "품질 지표(KPI) 정의",
      requirement: "완전성(Completeness), 정확성(Accuracy), 일관성(Consistency), 적시성(Timeliness) 4대 핵심 지표와 서비스별 추가 지표를 정의합니다.",
      description: "측정 가능한 품질 기준을 사전에 합의합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "검증 일정 및 담당자 배정",
      requirement: "주간 자동 검증 + 월간 수동 검토 일정을 확정하고, 각 단계별 담당자를 배정합니다.",
      description: "책임 소재를 명확히 하고 주기적 검증을 보장합니다.",
      uiType: "selection",
      options: ["데이터팀", "DQM 담당자", "데이터 엔지니어", "데이터 분석가", "ML 엔지니어"],
      actionButtons: ["save", "confirm"],
    },
  ],
  "dq-scope": [
    {
      featureName: "품질 지표별 임계값 설정",
      requirement: "각 품질 지표의 목표값(Target)과 최소 합격 기준(Threshold)을 정의합니다. 임계값 미달 시 자동 알림이 발생합니다.",
      description: "객관적 합격/불합격 기준을 사전 정의합니다.",
      uiType: "monitoring",
      actionButtons: ["save"],
    },
    {
      featureName: "데이터셋별 특화 규칙 정의",
      requirement: "각 데이터셋의 비즈니스 규칙(예: 금액 > 0, 날짜 형식, 참조키 존재 등)을 정의합니다.",
      description: "도메인 특화 품질 규칙을 추가로 정의합니다.",
      placeholder: "예: transaction_amount > 0, date_format = ISO-8601...",
    },
  ],
  "dq-tools": [
    {
      featureName: "검증 도구 선정 및 구성",
      requirement: "Great Expectations, dbt Test, Apache Airflow DAG 등 검증 도구를 선정하고 설정 파일을 구성합니다.",
      description: "자동화된 품질 검증 파이프라인을 구축합니다.",
      uiType: "selection",
      options: ["Great Expectations", "dbt Test", "Apache Airflow", "Pandas Profiling", "TFDV (TensorFlow Data Validation)", "Deequ (AWS)"],
    },
    {
      featureName: "CI/CD 파이프라인 연동",
      requirement: "품질 검증을 데이터 파이프라인에 통합하여 데이터 변경 시 자동으로 검증이 실행되도록 구성합니다.",
      description: "데이터 품질 게이트를 파이프라인에 내장합니다.",
      uiType: "upload_only",
      actionButtons: ["save", "confirm"],
    },
  ],

  // ── Phase 2 ──
  "dq-profiling-schema": [
    {
      featureName: "스키마 정합성 검증",
      requirement: "각 테이블/컬럼의 데이터 타입, NOT NULL 제약, UNIQUE 제약, Foreign Key 참조 무결성을 자동 검증합니다.",
      description: "스키마 변경이나 타입 불일치를 조기에 탐지합니다.",
      placeholder: "스키마 검증 결과 및 발견된 이슈를 기술하세요...",
      actionButtons: ["save"],
    },
    {
      featureName: "스키마 변경 이력 관리",
      requirement: "스키마 변경 사항(컬럼 추가/삭제/타입 변경)을 추적하고 변경 영향도를 분석합니다.",
      description: "스키마 진화(Schema Evolution)를 체계적으로 관리합니다.",
      uiType: "upload_only",
    },
  ],
  "dq-profiling-stats": [
    {
      featureName: "컬럼별 통계 프로파일 생성",
      requirement: "각 컬럼의 min/max, mean, median, std, Q1/Q3, 카디널리티, null 비율 등 통계 프로파일을 자동 생성합니다.",
      description: "데이터의 통계적 특성을 정량적으로 파악합니다.",
      placeholder: "주요 통계 지표 및 이상 패턴을 기술하세요...",
    },
    {
      featureName: "분포 분석 및 시각화",
      requirement: "수치형 컬럼의 분포(정규성, 치우침, 첨도)와 범주형 컬럼의 빈도 분포를 분석합니다.",
      description: "데이터 분포의 특이성을 식별합니다.",
      actionButtons: ["save"],
    },
  ],
  "dq-profiling-lineage": [
    {
      featureName: "데이터 리니지 매핑",
      requirement: "원천 시스템 → ETL/ELT → 데이터 레이크 → 피처 스토어 → 학습 데이터의 전체 경로를 추적합니다.",
      description: "데이터 변환 과정의 투명성을 확보합니다.",
      placeholder: "데이터 리니지 경로를 기술하거나 다이어그램을 첨부하세요...",
      uiType: "upload_only",
      actionButtons: ["save", "confirm"],
    },
  ],

  // ── Phase 3 ──
  "dq-anomaly-rules": [
    {
      featureName: "자동화 품질 규칙 실행",
      requirement: "사전 정의된 품질 규칙(null 체크, 범위 검증, 형식 검증, 관계 검증 등)을 일괄 실행합니다.",
      description: "체계적이고 반복 가능한 품질 검증을 수행합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "탐지 결과 분류 및 우선순위",
      requirement: "탐지된 이상 항목을 심각도(Critical/High/Medium/Low)로 분류하고 처리 우선순위를 결정합니다.",
      description: "제한된 자원으로 최대 효과를 달성합니다.",
      uiType: "selection",
      options: ["Critical - 즉시 처리", "High - 24시간 내 처리", "Medium - 주간 처리", "Low - 월간 검토"],
      actionButtons: ["save"],
    },
  ],
  "dq-anomaly-missing": [
    {
      featureName: "결측 패턴 분류 (MCAR/MAR/MNAR)",
      requirement: "Little's MCAR 테스트를 수행하여 결측 메커니즘을 분류하고, 패턴에 맞는 처리 전략을 수립합니다.",
      description: "결측 원인에 따라 최적의 대치 방법을 선택합니다.",
      placeholder: "결측 패턴 분석 결과와 선택한 처리 전략을 기술하세요...",
    },
    {
      featureName: "결측치 대치/처리 실행",
      requirement: "MCAR→평균/중앙값 대치, MAR→다중대입(MICE), MNAR→모델 기반 대치 또는 플래그 처리를 수행합니다.",
      description: "적절한 대치를 통해 데이터 손실을 최소화합니다.",
      uiType: "selection",
      options: ["평균 대치 (Mean Imputation)", "중앙값 대치 (Median Imputation)", "다중대입 (MICE)", "KNN 대치", "모델 기반 대치", "삭제 (Listwise Deletion)", "플래그 처리"],
      actionButtons: ["save", "confirm"],
    },
  ],
  "dq-anomaly-outlier": [
    {
      featureName: "극값(Outlier) 탐지",
      requirement: "IQR(1.5배), Z-Score(±3σ), Isolation Forest 등 다중 방법으로 극값을 탐지하고 교차 검증합니다.",
      description: "다양한 방법론을 조합하여 탐지 정확도를 높입니다.",
      uiType: "monitoring",
    },
    {
      featureName: "중복 데이터 식별 및 제거",
      requirement: "정확 매칭 + 유사도 기반 퍼지 매칭(Levenshtein distance ≥ 0.95)으로 중복을 식별하고 대표 레코드를 선정합니다.",
      description: "학습 데이터의 중복 편향을 방지합니다.",
      actionButtons: ["save"],
    },
  ],
  "dq-anomaly-dedup": [
    {
      featureName: "처리 전후 품질 비교",
      requirement: "이상 데이터 처리 전후의 품질 지표(완전성, 정확성, 일관성)를 비교 분석하고 개선 효과를 문서화합니다.",
      description: "처리의 효과성을 정량적으로 검증합니다.",
      placeholder: "처리 전후 지표 비교 결과를 기술하세요...",
    },
    {
      featureName: "잔여 이상 현황 보고",
      requirement: "처리 후에도 남아있는 이상 항목의 현황, 사유, 수용 여부를 문서화합니다.",
      description: "잔여 위험에 대한 투명한 기록을 유지합니다.",
      actionButtons: ["save", "confirm"],
    },
  ],

  // ── Phase 4 ──
  "dq-bias-identify": [
    {
      featureName: "보호 속성 식별",
      requirement: "법적 근거(개인정보보호법, 차별금지법)에 따라 성별, 연령, 지역, 소득수준 등 보호 속성을 정의합니다.",
      description: "공정성 검증의 대상을 명확히 합니다.",
      uiType: "selection",
      options: ["성별 (Gender)", "연령 (Age)", "지역 (Region)", "소득수준 (Income)", "인종/민족 (Race/Ethnicity)", "장애 여부 (Disability)"],
    },
    {
      featureName: "표현도(Representation) 분석",
      requirement: "각 보호 속성 그룹의 데이터 내 비율을 분석하고 모집단 대비 과대/과소 표현 여부를 확인합니다.",
      description: "학습 데이터의 대표성을 검증합니다.",
      placeholder: "각 그룹별 표현 비율과 모집단 비교 결과를 기술하세요...",
      actionButtons: ["save"],
    },
  ],
  "dq-bias-measure": [
    {
      featureName: "편향 지표 산출",
      requirement: "DI(Disparate Impact), SPD(Statistical Parity Difference), EOD(Equal Opportunity Difference) 등 정량적 편향 지표를 산출합니다.",
      description: "편향 수준을 객관적으로 측정합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "교차 분석 (Intersectional Analysis)",
      requirement: "복수 보호 속성의 교차(예: 여성+고령)에 대한 편향을 추가 분석합니다.",
      description: "단일 속성으로는 보이지 않는 복합 편향을 탐지합니다.",
      actionButtons: ["save"],
    },
  ],
  "dq-bias-mitigate": [
    {
      featureName: "편향 완화 기법 선택 및 적용",
      requirement: "과소 표현 그룹에 대한 오버샘플링(SMOTE), 과대 표현 그룹 언더샘플링, 가중치 조정, 데이터 증강 등을 적용합니다.",
      description: "데이터 수준에서 편향을 사전에 완화합니다.",
      uiType: "selection",
      options: ["SMOTE (오버샘플링)", "Random Under-sampling", "클래스 가중치 조정", "데이터 증강 (Augmentation)", "Fairness-aware 전처리", "적용 안 함 (사유 기재)"],
    },
    {
      featureName: "완화 효과 검증",
      requirement: "완화 기법 적용 전후의 편향 지표를 비교하고, 모델 성능에 미치는 영향(정확도 트레이드오프)을 분석합니다.",
      description: "완화가 효과적이면서도 성능 저하가 수용 범위 내인지 확인합니다.",
      placeholder: "완화 전후 지표 비교 및 성능 영향 분석 결과를 기술하세요...",
      actionButtons: ["save", "confirm"],
    },
  ],
  "dq-bias-report": [
    {
      featureName: "편향성 검증 종합 보고서",
      requirement: "보호 속성 정의, 표현도 분석, 편향 지표, 완화 조치, 잔여 편향에 대한 종합 보고서를 작성합니다.",
      description: "공정성 검증 과정과 결과를 투명하게 문서화합니다.",
      placeholder: "편향성 검증 종합 결과를 기술하세요...",
      actionButtons: ["save", "request_approval"],
    },
  ],

  // ── Phase 5 ──
  "dq-validation-metrics": [
    {
      featureName: "4대 품질 지표 달성 확인",
      requirement: "완전성(≥99%), 정확성(≥98.5%), 일관성(≥99%), 적시성(≥95%) 각 지표가 목표를 달성했는지 최종 확인합니다.",
      description: "사전 정의된 품질 기준 충족을 최종 검증합니다.",
      uiType: "monitoring",
      actionButtons: ["save"],
    },
    {
      featureName: "데이터셋별 합격/불합격 판정",
      requirement: "각 데이터셋의 품질 점수를 산출하고 합격(≥95점) 여부를 판정합니다.",
      description: "데이터셋 단위로 사용 적합성을 판단합니다.",
      uiType: "selection",
      options: ["합격 (Pass)", "조건부 합격 (Conditional Pass)", "불합격 - 재검증 필요 (Fail)"],
    },
  ],
  "dq-validation-integrity": [
    {
      featureName: "데이터 무결성 검증",
      requirement: "SHA-256 해시/체크섬을 통해 데이터 전송/저장 과정의 무결성을 검증합니다.",
      description: "데이터 위변조를 방지합니다.",
      placeholder: "무결성 검증 결과(해시값 비교)를 기술하세요...",
      actionButtons: ["save"],
    },
    {
      featureName: "비식별화 적정성 검증",
      requirement: "K-익명성(K≥5), L-다양성(L≥3), T-근접성(T≤0.15) 충족 여부를 검증합니다.",
      description: "개인정보보호법 준수를 확인합니다.",
      uiType: "monitoring",
      actionButtons: ["save", "confirm"],
    },
  ],
  "dq-validation-privacy": [
    {
      featureName: "품질 검증 종합 보고서 작성",
      requirement: "전 단계(계획→프로파일링→이상탐지→편향검증→최종검증)의 결과를 종합하여 최종 보고서를 작성합니다.",
      description: "검증 과정 전체를 일관되게 문서화합니다.",
      placeholder: "전체 검증 과정 요약 및 핵심 결과를 기술하세요...",
      actionButtons: ["save"],
    },
    {
      featureName: "잔여 위험 및 조건부 승인 사항",
      requirement: "해결되지 않은 품질 이슈, 수용한 잔여 위험, 조건부 승인 사항을 명시합니다.",
      description: "투명한 위험 공시로 의사결정을 지원합니다.",
      actionButtons: ["save", "request_approval"],
    },
  ],
  "dq-validation-approval": [
    {
      featureName: "데이터 품질 위원회 심의",
      requirement: "위원회가 종합 보고서를 검토하고 학습 데이터로의 사용 적합성을 최종 판정합니다.",
      description: "독립적 심의를 통해 객관성을 확보합니다.",
      uiType: "approval",
      actionButtons: ["approve", "reject", "request_revision"],
    },
  ],

  // ── Phase 6 ──
  "dq-monitor-dashboard": [
    {
      featureName: "모니터링 대시보드 설정",
      requirement: "품질 지표 실시간 시각화, 임계값 기반 자동 알림, 트렌드 분석 대시보드를 구성합니다.",
      description: "운영 중 품질 변동을 즉시 감지합니다.",
      uiType: "dashboard_link",
    },
    {
      featureName: "알림 규칙 설정",
      requirement: "지표별 알림 임계값, 수신자, 에스컬레이션 경로를 설정합니다.",
      description: "이상 발생 시 신속한 대응을 보장합니다.",
      uiType: "monitoring",
      actionButtons: ["save"],
    },
  ],
  "dq-monitor-drift": [
    {
      featureName: "데이터 드리프트 감지 설정",
      requirement: "PSI(Population Stability Index), KL Divergence, JS Distance 등을 이용한 분포 변화 감지를 설정합니다.",
      description: "모델 성능 저하의 근본 원인인 데이터 변화를 조기 감지합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "드리프트 대응 프로세스",
      requirement: "드리프트 감지 시 알림 → 원인 분석 → 재학습 판단 → 모델 갱신의 자동화 파이프라인을 구성합니다.",
      description: "드리프트에 대한 체계적 대응 체계를 구축합니다.",
      placeholder: "드리프트 대응 프로세스를 기술하세요...",
      actionButtons: ["save", "confirm"],
    },
  ],
  "dq-monitor-revalidation": [
    {
      featureName: "정기 재검증 실행",
      requirement: "월간 자동 재검증(전체 규칙 실행) + 분기별 수동 심층 검토(편향성 포함)를 수행합니다.",
      description: "지속적인 품질 보증을 수행합니다.",
      placeholder: "재검증 결과 및 발견 사항을 기술하세요...",
    },
    {
      featureName: "근본 원인 분석 (RCA)",
      requirement: "품질 이슈 발생 시 5-Why, 특성요인도(피시본) 등을 활용하여 근본 원인을 파악하고 재발 방지 조치를 수립합니다.",
      description: "같은 이슈가 반복되지 않도록 구조적으로 개선합니다.",
      actionButtons: ["save", "apply"],
    },
  ],
};

export function getDqFlowRequirements(stepId: string): DqFlowFeatureDetail[] {
  return REQUIREMENTS[stepId] || [];
}

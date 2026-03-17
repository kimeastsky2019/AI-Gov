/**
 * AI 거버넌스 플로우 단계별 요구사항 정의
 */

export interface GovFlowFeatureDetail {
  featureName: string;
  requirement: string;
  description: string;
  uiType?: "default" | "approval" | "selection" | "monitoring" | "upload_only" | "checklist" | "dashboard_link";
  actionButtons?: ("save" | "approve" | "reject" | "confirm" | "request_revision" | "deploy" | "request_approval" | "apply")[];
  placeholder?: string;
  options?: string[];
}

const REQUIREMENTS: Record<string, GovFlowFeatureDetail[]> = {
  "request-form": [
    {
      featureName: "서비스 개요 (Service Overview)",
      requirement: "AI 서비스의 목적, 배경, 주요 기능을 작성합니다. 서비스가 해결하고자 하는 비즈니스 문제와 기대 효과를 명확히 기술합니다.",
      description: "AI 서비스 도입의 타당성을 판단하기 위한 기초 정보입니다.",
      placeholder: "예: 고객 신용평가 정확도 향상을 위한 AI 모델 도입...",
      actionButtons: ["save"],
    },
    {
      featureName: "업무 요건 (Business Requirements)",
      requirement: "해당 서비스가 적용될 업무 영역, 대상 사용자, 데이터 소스, 예상 처리량 등 구체적인 업무 요건을 기술합니다.",
      description: "실제 업무 환경에서의 활용 방안을 정의합니다.",
      placeholder: "예: 일일 신용평가 건수 약 5,000건, 실시간 API 응답 필요...",
    },
    {
      featureName: "데이터/기술 요건 (Data & Tech Specs)",
      requirement: "사용될 데이터의 종류(민감정보 포함 여부), 예상 기술 스택, 인프라 요건을 기술하고 관련 문서를 첨부합니다.",
      description: "기술적 구현 가능성과 데이터 거버넌스 검토를 위한 기초 자료입니다.",
      uiType: "upload_only",
    },
  ],
  "pre-review-request": [
    {
      featureName: "사전검토 요청서 제출",
      requirement: "기획서 및 모델 설명서 작성이 완료된 후, AI 개발 부서(담당자)를 지정하여 사전 기술 검토를 요청합니다. 시스템 알림이 자동 발송됩니다.",
      description: "개발 부서에 기획 내용에 대한 사전 기술 검토를 공식 요청합니다.",
      actionButtons: ["save", "request_approval"],
    },
    {
      featureName: "검토 담당자 지정 (Reviewer Assignment)",
      requirement: "검토를 수행할 AI 개발 부서 또는 담당자를 검색하여 지정합니다.",
      description: "책임 소재를 명확히 하기 위해 검토 담당자를 지정합니다.",
      uiType: "selection",
      options: ["AI CoE팀", "ML 엔지니어링팀", "데이터사이언스팀", "보안검토팀", "컴플라이언스팀"],
    },
  ],
  "risk-assessment": [
    {
      featureName: "위험 식별 및 분류 (Risk Identification)",
      requirement: "체크리스트를 통해 잠재 위험 요소를 식별합니다. 편향성, 프라이버시, 보안, 설명가능성, 안전성 등 주요 카테고리별로 위험을 분류합니다.",
      description: "정량적/정성적 평가를 통해 위험 수준을 객관적으로 도출합니다.",
      placeholder: "식별된 위험 요소와 카테고리를 기술하세요...",
    },
    {
      featureName: "위험도 산정 (Risk Scoring)",
      requirement: "발생 가능성(Probability 1-10)과 영향도(Impact 1-10) 점수를 선택하면 시스템이 최종 위험 등급(UNACCEPTABLE/HIGH/MEDIUM/LOW)을 자동 산출합니다.",
      description: "위험의 심각도를 정량적으로 평가합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "완화 방안 수립 (Mitigation Plan)",
      requirement: "식별된 각 위험에 대한 완화 방안을 수립합니다. 기술적 조치, 절차적 조치, 관리적 조치로 구분하여 기술합니다.",
      description: "위험을 허용 가능한 수준으로 낮추기 위한 구체적 방안입니다.",
      actionButtons: ["save", "confirm"],
    },
  ],
  "dev-plan": [
    {
      featureName: "개발 일정 및 마일스톤 (Timeline & Milestones)",
      requirement: "AI 모델 개발의 주요 마일스톤과 일정을 수립합니다. 데이터 수집, 전처리, 모델 학습, 검증, 배포 준비 등 단계별 일정을 포함합니다.",
      description: "프로젝트 관리와 진행 상황 추적을 위한 기준입니다.",
      placeholder: "예: 1-2주차: 데이터 수집/전처리, 3-6주차: 모델 개발...",
    },
    {
      featureName: "기술 아키텍처 (Technical Architecture)",
      requirement: "AI 파이프라인 아키텍처, 사용할 프레임워크/라이브러리, 인프라 구성을 설계합니다.",
      description: "기술적 구현 방향과 인프라 요건을 정의합니다.",
      uiType: "upload_only",
    },
    {
      featureName: "자원 및 인력 계획 (Resource Planning)",
      requirement: "필요한 컴퓨팅 자원(GPU, 스토리지), 인력 구성(ML 엔지니어, 데이터 엔지니어 등), 예산을 계획합니다.",
      description: "프로젝트 수행에 필요한 자원을 사전에 확보합니다.",
      actionButtons: ["save"],
    },
  ],
  "risk-plan": [
    {
      featureName: "위험관리 전략 (Risk Management Strategy)",
      requirement: "식별된 위험에 대한 관리 전략(회피, 감소, 전가, 수용)을 수립하고, 각 위험별 담당자와 대응 일정을 지정합니다.",
      description: "체계적인 위험관리를 위한 전략적 프레임워크입니다.",
      placeholder: "위험관리 전략을 기술하세요...",
    },
    {
      featureName: "모니터링 계획 (Monitoring Plan)",
      requirement: "위험 지표(KRI)를 정의하고, 모니터링 주기, 임계값, 에스컬레이션 절차를 설정합니다.",
      description: "운영 중 위험 변동을 실시간으로 감시합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "비상 대응 계획 (Contingency Plan)",
      requirement: "위험이 현실화되었을 때의 대응 절차, 롤백 계획, 커뮤니케이션 프로토콜을 수립합니다.",
      description: "위기 상황에서의 신속한 대응을 위한 사전 계획입니다.",
      actionButtons: ["save", "confirm"],
    },
  ],
  "risk-level-judge": [
    {
      featureName: "위험등급 최종 확정 (Final Risk Level)",
      requirement: "위험성 평가 결과와 위험관리 계획을 종합하여 최종 위험등급을 확정합니다. 등급에 따라 다음 승인 절차가 분기됩니다.",
      description: "고위험 서비스는 거버넌스 위원회 심의, 저/중위험은 위험관리 승인으로 진행됩니다.",
      uiType: "selection",
      options: ["저위험 (LOW)", "중위험 (MEDIUM)", "고위험 (HIGH)", "수용불가 (UNACCEPTABLE)"],
      actionButtons: ["confirm"],
    },
  ],
  "risk-plan-approval": [
    {
      featureName: "위험관리 계획 승인 (Risk Plan Approval)",
      requirement: "저/중위험 서비스의 위험관리 계획서를 검토하고 승인합니다. 보완이 필요한 경우 반려하여 수정을 요청합니다.",
      description: "위험관리 책임자가 위험관리 계획의 적정성을 심사합니다.",
      uiType: "approval",
      actionButtons: ["approve", "reject", "request_revision"],
    },
  ],
  "governance-approval": [
    {
      featureName: "거버넌스 위원회 심의 (Governance Review)",
      requirement: "고위험 AI 서비스에 대해 거버넌스 위원회가 종합적으로 심의합니다. 윤리성, 법규 준수, 사회적 영향 등을 검토합니다.",
      description: "고위험 서비스의 도입 적정성을 다각적으로 심의합니다.",
      placeholder: "심의 의견을 작성하세요...",
      actionButtons: ["approve", "reject", "request_revision"],
    },
  ],
  "dev-request": [
    {
      featureName: "개발 의뢰서 작성 (Development Request)",
      requirement: "승인된 계획에 따라 AI 개발팀에 공식 개발 의뢰서를 작성합니다. 요구사항 명세, 수용 기준, 일정을 포함합니다.",
      description: "개발팀과의 공식적인 계약 및 작업 범위를 정의합니다.",
      actionButtons: ["save", "request_approval"],
    },
    {
      featureName: "개발팀 배정 (Team Assignment)",
      requirement: "AI 개발을 수행할 팀과 담당자를 지정합니다.",
      description: "프로젝트 실행을 위한 인력을 배정합니다.",
      uiType: "selection",
      options: ["ML 엔지니어링 1팀", "ML 엔지니어링 2팀", "데이터사이언스팀", "외부 개발 파트너"],
    },
  ],
  "dev-progress": [
    {
      featureName: "개발 진행률 추적 (Progress Tracking)",
      requirement: "마일스톤별 진행률을 업데이트하고, 이슈 사항과 대응 방안을 기록합니다.",
      description: "프로젝트 진행 상황을 투명하게 관리합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "품질 검사 결과 (Quality Check)",
      requirement: "코드 리뷰, 단위 테스트, 모델 성능 평가 결과를 기록합니다. 품질 기준 미달 시 보완 조치를 기술합니다.",
      description: "개발 산출물의 품질을 지속적으로 관리합니다.",
      actionButtons: ["save"],
    },
  ],
  "pre-op-verification": [
    {
      featureName: "성능 검증 (Performance Verification)",
      requirement: "정확도, 재현율, F1 Score 등 모델 성능 지표를 검증합니다. 부하 테스트 결과를 포함합니다.",
      description: "운영 환경에서의 서비스 품질을 사전에 확인합니다.",
      uiType: "monitoring",
    },
    {
      featureName: "보안 검증 (Security Verification)",
      requirement: "취약점 스캔, 침투 테스트, 적대적 공격 방어 테스트 결과를 기록합니다.",
      description: "운영 환경 보안 요건 충족을 확인합니다.",
      uiType: "upload_only",
    },
    {
      featureName: "공정성/편향성 검증 (Fairness Verification)",
      requirement: "보호 속성별 편향성 지표(DPD, EOD 등)를 검증하고, 설명가능성(SHAP/LIME) 테스트 결과를 첨부합니다.",
      description: "AI 서비스의 공정성과 설명가능성을 확인합니다.",
      actionButtons: ["save", "confirm"],
    },
  ],
  "verification-branch": [
    {
      featureName: "검증 수준 결정 (Verification Level)",
      requirement: "위험등급에 따라 내부 적합성 검증 또는 제3자 독립 검증을 결정합니다. 고위험 서비스는 반드시 제3자 검증을 수행합니다.",
      description: "검증의 독립성과 객관성을 보장하기 위한 판단입니다.",
      uiType: "selection",
      options: ["내부 적합성 검증 (중위험)", "제3자 독립 검증 (고위험)"],
      actionButtons: ["confirm"],
    },
  ],
  "verification-adequacy": [
    {
      featureName: "내부 적합성 검증 보고서 (Adequacy Report)",
      requirement: "내부 검증팀이 성능, 보안, 공정성, 규제 준수 등 항목별 적합 여부를 판정하고 종합 보고서를 작성합니다.",
      description: "내부 기준에 따른 적합성을 종합 판정합니다.",
      actionButtons: ["save", "approve", "request_revision"],
    },
  ],
  "third-party-verification": [
    {
      featureName: "제3자 독립 검증 보고서 (Third-Party Report)",
      requirement: "외부 전문기관이 AI 서비스의 안전성, 공정성, 규제 준수를 독립적으로 검증한 결과를 첨부합니다.",
      description: "검증의 객관성과 신뢰성을 확보합니다.",
      uiType: "upload_only",
      actionButtons: ["save", "approve"],
    },
  ],
  "op-approval-request": [
    {
      featureName: "운영 승인 요청서 (Operation Approval Request)",
      requirement: "검증 결과를 종합하여 운영 환경 배포에 대한 최종 승인을 요청합니다. 검증 보고서, 운영 매뉴얼, 롤백 절차서를 첨부합니다.",
      description: "운영 환경 배포를 위한 공식 승인 절차입니다.",
      actionButtons: ["save", "request_approval"],
    },
  ],
  "deployment-approval": [
    {
      featureName: "배포 승인 (Deployment Approval)",
      requirement: "운영 책임자가 배포 체크리스트(모니터링 설정, 롤백 절차, 알림 체계)를 최종 확인하고 배포를 승인합니다.",
      description: "운영 안정성을 최종 확인하고 배포를 승인합니다.",
      uiType: "approval",
      actionButtons: ["approve", "reject"],
    },
  ],
  "deployment": [
    {
      featureName: "배포 실행 및 확인 (Deployment Execution)",
      requirement: "카나리아/블루-그린 배포를 실행하고, 배포 후 헬스체크 및 초기 모니터링 결과를 확인합니다.",
      description: "안전한 배포 실행과 초기 안정성을 확인합니다.",
      actionButtons: ["deploy"],
    },
    {
      featureName: "운영 인수인계 (Handover)",
      requirement: "운영팀에 서비스 운영 매뉴얼, 모니터링 대시보드, 에스컬레이션 절차를 인수인계합니다.",
      description: "안정적인 운영 체계를 구축합니다.",
      actionButtons: ["save", "confirm"],
    },
  ],
  "dashboard": [
    {
      featureName: "운영 현황 모니터링 (Operations Monitoring)",
      requirement: "배포된 AI 서비스의 성능 지표, 드리프트 현황, 보안 이벤트, SLA 준수율을 실시간으로 확인합니다.",
      description: "운영 중인 서비스의 건전성을 지속적으로 관리합니다.",
      uiType: "dashboard_link",
    },
  ],
  "improvement": [
    {
      featureName: "개선 사항 관리 (Improvement Management)",
      requirement: "운영 데이터 분석 결과, 사용자 피드백, 규제 변경 사항 등을 반영한 개선 과제를 도출하고 관리합니다.",
      description: "AI 서비스의 지속적인 품질 향상을 위한 체계적 관리입니다.",
      placeholder: "개선 사항과 조치 계획을 기술하세요...",
      actionButtons: ["save", "apply"],
    },
    {
      featureName: "모델 재학습 계획 (Re-training Plan)",
      requirement: "드리프트 감지 시 또는 정기 재학습 주기에 따른 모델 갱신 계획을 수립합니다.",
      description: "모델의 성능을 지속적으로 유지/개선합니다.",
      uiType: "monitoring",
      actionButtons: ["save"],
    },
  ],
};

export function getGovFlowRequirements(stepId: string): GovFlowFeatureDetail[] {
  return REQUIREMENTS[stepId] || [];
}

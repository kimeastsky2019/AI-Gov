#!/usr/bin/env python3
"""
AIGov 플랫폼 위험평가서 DB 등록 스크립트
=========================================
사용법:
  1. 서버에 SSH 접속:
     ssh -i energy-orchestrator-platform.pem metal@34.64.248.144

  2. 이 스크립트를 서버에 업로드:
     scp -i energy-orchestrator-platform.pem register_risks_to_aigov.py metal@34.64.248.144:~/

  3. 서버에서 실행:
     python3 register_risks_to_aigov.py

  ※ 실행 전 DB 접속 정보를 아래 CONFIG에서 확인/수정하세요.
"""

import json
import os
from datetime import datetime

# ============================================================
# CONFIG - 서버 환경에 맞게 수정하세요
# ============================================================
CONFIG = {
    "db_type": "postgresql",  # postgresql, mysql, mongodb, sqlite 중 선택
    "db_host": "localhost",
    "db_port": 5432,
    "db_name": "aigov",
    "db_user": "aigov_user",
    "db_password": "your_password_here",
    # MongoDB인 경우:
    "mongo_uri": "mongodb://localhost:27017/aigov",
    # API 방식인 경우:
    "api_base_url": "https://www.gngmeta.com/api",
    "api_token": "",  # JWT 토큰
}

# ============================================================
# 고도화된 32개 위험 항목 데이터
# ============================================================
RISK_DATA = [
    {
        "risk_id": "RISK-001", "num": 1,
        "principle": "합법성 원칙", "category": "금융소비자보호법 위반 가능성",
        "title": "고지 의무 위반",
        "description": "당고객 AI 서비스 이용 시 고지의무 대상 서비스에 대해서는 적합한 내용으로 고지 절차를 수행해야 하나 하지 않았을 시 제재를 받게 될 위험",
        "evaluation_method": "【정량지표】고지 문구 완전성 점수 (Content Completeness Score)\n• 산식: 100 × (포함된 필수항목 수 / 전체 필수항목 수)\n• 필수항목: AI 활용 고지, 결과 도출 근거, 이의제기 권리, 담당부서 연락처 등\n• 판정: 100점 =적합, 80~99점=보완필요, 80점 미만=부적합\n【자동화】sLLM 기반 문구 적정성 검사",
        "mitigation": "기획 단계에서 AI 활용 서비스의 고지의무 및 설명의무 대상을 사전 식별하여, 관련 법 및 하위규제 준수",
        "likelihood": 6, "impact": 8, "risk_grade": "HIGH",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-002", "num": 2,
        "principle": "합법성 원칙", "category": "금융소비자보호법 위반 가능성",
        "title": "설명 의무/부당권유 행위 위반",
        "description": "당고객 AI 서비스 이용 시 설명 의무 대상 서비스에 대해서는 설명 절차 수행해야 하나, 사전에 인지하지 못하거나 잘못된 정보를 제공할 위험",
        "evaluation_method": "【정량지표】집단 간 격차 지수 (Disparate Impact, DI)\n• 산식: 소수/취약 집단 승인율 / 다수 집단 승인율\n• 판정: 0.8≤DI≤1.25=적정\n【정량지표】설명 정확도\n• 산식: 100 × (정확한 설명 건수 / 전체 설명 건수)\n• 판정: 95% 이상=적합",
        "mitigation": "기획 단계에서 AI 활용 서비스의 고지의무 및 설명의무 대상을 사전 식별",
        "likelihood": 5, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-003", "num": 3,
        "principle": "합법성 원칙", "category": "AI기본법 위반 가능성",
        "title": "AI 기본법 위반",
        "description": "AI 기본법의 주요 의무를 위반하거나 법령의 요구사항을 누락하여 서비스를 기획 및 운영할 위험",
        "evaluation_method": "【정량지표】법 준수 체크리스트 점수\n• 산식: 100 × (준수 항목 수 / 전체 의무 항목 수)\n• 판정: 80% 이상=준수\n【자동화】sLLM 기반 법령 스캐너",
        "mitigation": "기획 단계에서 AI 기본법의 주요 의무 및 요구사항을 확인하여 준수",
        "likelihood": 4, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-004", "num": 4,
        "principle": "합법성 원칙", "category": "데이터 관련법 위반 가능성",
        "title": "민감 정보 추출/재식별",
        "description": "AI의 추론 능력을 악용하여 개인의 민감 정보를 추출, 재식별, 연결, 추론함으로써 프라이버시 침해가 심화될 위험",
        "evaluation_method": "【정량지표】민감정보 유출 공격 성공률 \n• 산식: 100 × (공격 성공 건수 / 전체 공격 시도)\n• 판정: 5% 미만=안전, 15% 초과=위험\n【자동화】레드팀팅 자동화",
        "mitigation": "개인정보 처리 전 과정 위험 점검 체크리스트를 통해 위험요인의 사전 제거",
        "likelihood": 5, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-005", "num": 5,
        "principle": "합법성 원칙", "category": "데이터 관련법 위반 가능성",
        "title": "개인정보의 부적절한 처리",
        "description": "정보주체로부터 동의받지 않은 목적으로 모델 훈련에 사용 등 개인정보를 처리하거나 법령을 위반할 위험",
        "evaluation_method": "【정량지표】PII 유출 공격 성공률 \n• 산식: 100 × (PII 유출 성공 건수 / 전체 공격 시도)\n• 판정: 3% 미만=안전, 10% 초과=위험\n【자동화】PII 레드팀팅",
        "mitigation": "기획 단계에서 적용받는 데이터 관련법을 사전 검토하고 준수",
        "likelihood": 4, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-006", "num": 6,
        "principle": "합법성 원칙", "category": "개별 소권법 위반 가능성",
        "title": "금융관련 법 위반",
        "description": "AI 상품·서비스를 출시 및 이용하는 과정에서 기타 개별 금융소권 법률을 위반할 위험",
        "evaluation_method": "【정량지표】FDS 매칭률 + 소권법 준수 체크리스트 점수\n• 판정: 90% 이상=적합",
        "mitigation": "기획 단계에서 적용받는 개별 금융관련 법령을 사전 검토",
        "likelihood": 4, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-007", "num": 7,
        "principle": "신뢰성 원칙", "category": "품질",
        "title": "데이터 불충분성",
        "description": "모델 훈련 과정에 사용되는 데이터가 불충분하여 신뢰도 낮은 결과를 산출할 위험",
        "evaluation_method": "【정량지표】신뢰구간(CI)\n• 판정: CI≤0.1=충분, CI>0.2=불충분\n【정량지표】데이터 커버리지율\n• 판정: 80% 이상=충분",
        "mitigation": "출처 및 데이터 소스를 분석하여 위험을 파악하고 데이터 수집/라벨링 프로세스 검토",
        "likelihood": 6, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-008", "num": 8,
        "principle": "신뢰성 원칙", "category": "품질",
        "title": "데이터 정확성 부족",
        "description": "모델 훈련에 사용되는 데이터가 사실을 정확히 반영하지 못하거나 일관되지 않게 기록될 위험",
        "evaluation_method": "【정량지표】이상치 탐지 점수(Isolation Forest)\n• 판정: 0.3 미만=양호\n【정량지표】데이터 일관성률 \n• 판정: 95% 이상=양호",
        "mitigation": "학습모델, 데이터 구조 및 구축 방법 변경/통제 프로세스를 수립하여 데이터 품질 관리",
        "likelihood": 5, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-009", "num": 9,
        "principle": "신뢰성 원칙", "category": "품질",
        "title": "학습 데이터 오염/유실",
        "description": "관리 소홀, 사고 등으로 학습 데이터가 유실, 변경 또는 오염될 위험",
        "evaluation_method": "【정량지표】데이터 오염률 \n• 판정: 1% 미만=양호, 5% 초과=위험\n【정량지표】해시 검증율\n• 판정: 100%=무결",
        "mitigation": "데이터 수집/라벨링 프로세스 검토 및 품질 관리 가이드라인 적용",
        "likelihood": 4, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-010", "num": 10,
        "principle": "신뢰성 원칙", "category": "편향성",
        "title": "데이터 편향성",
        "description": "모델 훈련에 사용되는 데이터가 전체 고객이나 상황을 대표하지 못하여 편향된 결과를 산출할 위험",
        "evaluation_method": "【정량지표】편향 공격 성공률 + Demographic Parity\n• 판정: DI 차이 0.05 미만=공정",
        "mitigation": "모델 학습 전/중/후 편향 완화 기법 적용",
        "likelihood": 7, "impact": 8, "risk_grade": "HIGH",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-011", "num": 11,
        "principle": "신뢰성 원칙", "category": "공정성",
        "title": "공정성 위반",
        "description": "모델의 구조나 알고리즘의 특성에 따라 특정 데이터에 대해 편향된 결과를 산출하는 위험",
        "evaluation_method": "【정량지표】SHAP 기반 금지변수 기여도\n• 판정: 5% 미만=공정, 15% 초과=불공정\n【정량지표】Equal Opportunity Difference\n• 판정: 0.05 미만=공정",
        "mitigation": "AI 모델의 구조/알고리즘 특성에 대한 이해 기반으로 편향 여부를 확인",
        "likelihood": 6, "impact": 9, "risk_grade": "HIGH",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-012", "num": 12,
        "principle": "신뢰성 원칙", "category": "설명가능성",
        "title": "설명 가능성/투명성 부족",
        "description": "모델이 내리는 의사결정의 원인과 과정이 명확하지 않아 설명하기 어려운 위험",
        "evaluation_method": "【정량지표】XAI 충실도\n• 판정: 0.7 이상=높은 충실도\n【정량지표】설명 커버리지율\n• 판정: 90% 이상=충분",
        "mitigation": "설명가능한 AI 기법(SHAP, LIME, ICE/PDP) 적용",
        "likelihood": 5, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-013", "num": 13,
        "principle": "신뢰성 원칙", "category": "성능",
        "title": "모델 과대/과소 적합 위험",
        "description": "모델이 학습 데이터에 과대/과소 적합되어 실제 환경에서 성능이 저하될 위험",
        "evaluation_method": "【정량지표】Train-Test 성능 갭\n• 판정: 5% 미만=적정, 15% 초과=과적합\n【자동화】K-Fold 교차검증",
        "mitigation": "검증 절차(홀드아웃 검증, K폴드 검증 등) 수행",
        "likelihood": 5, "impact": 6, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-014", "num": 14,
        "principle": "신뢰성 원칙", "category": "성능",
        "title": "모델 드리프트 위험",
        "description": "시간 경과에 따라 입력 데이터 분포가 변화하여 모델 성능이 저하될 위험",
        "evaluation_method": "【정량지표】PSI\n• 판정: PSI<0.1=안정, PSI≥0.25=위험\n【자동화】시계열 PSI 자동 산출 및 알림",
        "mitigation": "모델 성능을 지속적으로 모니터링하고 드리프트 감지 시 재학습",
        "likelihood": 6, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-015", "num": 15,
        "principle": "신뢰성 원칙", "category": "성능",
        "title": "모델 붕괴 (Model Collapse)",
        "description": "학습 세대가 반복됨에 따라 모델 품질이 점진적으로 저하되는 위험",
        "evaluation_method": "【정량지표】오류 누적 지수\n• 판정: 98점 이상=안정, 90점 미만=붕괴 위험\n【자동화】세대별 성능 추적",
        "mitigation": "합성 데이터 비율 제한, 원본 데이터 혼합 전략 적용",
        "likelihood": 3, "impact": 7, "risk_grade": "LOW",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-016", "num": 16,
        "principle": "신뢰성 원칙", "category": "성능",
        "title": "모델 성능 지표 부적합",
        "description": "모델 성능 측정에 부적합한 지표를 사용하여 실제 비즈니스 성과와 괴리가 발생할 위험",
        "evaluation_method": "【정량지표】비즈니스 상관도\n• 판정: 0.7 이상=적합, 0.4 미만=부적합\n【정량지표】다중 지표 포괄성\n• 판정: 80% 이상=적합",
        "mitigation": "비즈니스 목적에 맞는 성능 지표 선정 및 다중 지표 활용",
        "likelihood": 4, "impact": 6, "risk_grade": "LOW",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-017", "num": 17,
        "principle": "신뢰성 원칙", "category": "성능",
        "title": "부정확한 정보 출력 (환각)",
        "description": "AI가 사실과 다른 정보를 사실처럼 생성하는 환각 현상으로 잘못된 의사결정을 유도할 위험",
        "evaluation_method": "【정량지표】환각률 \n• 판정: 5% 미만=양호, 15% 초과=위험\n【정량지표】사실 검증 정확도\n• 판정: 90% 이상=양호\n【자동화】RAG 기반 출력 검증",
        "mitigation": "RAG, RLHF, 고품질 데이터 미세조정, 거절 능력 학습 등 환각 완화 기법 적용",
        "likelihood": 7, "impact": 8, "risk_grade": "HIGH",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-018", "num": 18,
        "principle": "선의성준수 원칙", "category": "계약 권리 침해",
        "title": "의사결정 기능 오작동",
        "description": "AI의 의사결정으로 인해 금전적 피해가 발생하거나 고객의 금융거래 권리를 저해하는 위험",
        "evaluation_method": "【정량지표】지침 준수 정확도\n• 판정: 99% 이상=적합, 95% 미만=부적합\n【정량지표】오작동 영향 범위\n• 판정: 1% 미만=허용적",
        "mitigation": "AI 의사결정으로 인한 금전적 피해 가능성 사전 검토 및 대응방안 마련",
        "likelihood": 5, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-019", "num": 19,
        "principle": "선의성준수 원칙", "category": "책임 투명성",
        "title": "책임소재 불명확",
        "description": "AI 수명 주기 전반에 대한 R&R이 불명확하여 분쟁 발생 위험",
        "evaluation_method": "【정량지표】이해관계자 합의도(SAR)\n• 판정: 95% 이상=명확, 80% 미만=불명확\n【정량지표】RACI 매트릭스 완성도\n• 판정: 100%=완비",
        "mitigation": "AI 수명 주기 전반에 대한 R&R을 명확히 정의",
        "likelihood": 4, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-020", "num": 20,
        "principle": "선의성준수 원칙", "category": "소비자 보호방안",
        "title": "소비자 보호방안 미확보",
        "description": "AI 상품·서비스 관련 사고에 대한 구제 방안 등 소비자 보호정책 미마련으로 피해 발생 위험",
        "evaluation_method": "【정량지표】피드백 루프 효율\n• 판정: 80% 이상=양호, 60% 미만=미흡\n【정량지표】구제 방안 보유율\n• 판정: 100%=완비",
        "mitigation": "AI 서비스 관련 사고 대응 및 소비자 구제 방안 마련",
        "likelihood": 5, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-021", "num": 21,
        "principle": "선의성준수 원칙", "category": "소비자 보호방안",
        "title": "소비자의 편의성 저해",
        "description": "소비자가 AI 상품·서비스의 기능 및 사용 방법을 이해하기 어려워 편의성 저해로 불만이 발생할 위험",
        "evaluation_method": "【정량지표】사용자 재시도력 비율\n• 판정: 10% 미만=양호, 25% 초과=편의성 저해\n【정량지표】Task 완료율\n• 판정: 85% 이상=양호",
        "mitigation": "소비자 UI/UX 개선 및 사용 안내 강화",
        "likelihood": 4, "impact": 6, "risk_grade": "LOW",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-022", "num": 22,
        "principle": "보안성 원칙", "category": "보안",
        "title": "데이터 유출",
        "description": "접근권한 설정 오류, 해킹 등으로 인해 AI 시스템의 데이터가 외부로 유출될 위험",
        "evaluation_method": "【정량지표】비인가 접근 차단율\n• 판정: 99.9% 이상=안전 \n【정량지표】최소 권한 원칙 준수율\n• 판정: 95% 이상=양호",
        "mitigation": "접근 통제 강화, 퇴사자 계정 즉시 삭제, 암호화 적용",
        "likelihood": 5, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-023", "num": 23,
        "principle": "보안성 원칙", "category": "보안",
        "title": "무단 모델 추출 (Model Extraction)",
        "description": "외부 공격자가 API를 통해 모델의 구조와 파라미터를 역공학으로 추출하는 위험",
        "evaluation_method": "【정량지표】워터마크 탐지율 + API Rate Limit 위반률",
        "mitigation": "모델 워터마킹, API 호출 제한, 모델 접근 로깅 강화",
        "likelihood": 4, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-024", "num": 24,
        "principle": "보안성 원칙", "category": "보안",
        "title": "사이버 범죄 지원",
        "description": "AI가 사이버 범죄에 활용될 수 있는 코드나 지침을 생성할 위험",
        "evaluation_method": "【정량지표】악성 출력 탐지율\n• 판정: 99% 이상=양호\n【자동화】출력 보안 게이트",
        "mitigation": "보안 특화 sLLM 검증기 적용, 출력 필터링 강화",
        "likelihood": 3, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-025", "num": 25,
        "principle": "보안성 원칙", "category": "보안",
        "title": "적대적 공격 취약성 (Evasion Attack)",
        "description": "적대적 입력을 통해 AI 모델의 의도 오분류/오판단을 유도하는 공격 위험",
        "evaluation_method": "【정량지표】적대적 공격 성공률 \n• 판정: 10% 미만=견고, 30% 초과=취약\n【자동화】레드팀팅 연 1회 수행",
        "mitigation": "적대적 훈련(Adversarial Training), 입력 검증 강화",
        "likelihood": 5, "impact": 8, "risk_grade": "MEDIUM",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-026", "num": 26,
        "principle": "보안성 원칙", "category": "보안",
        "title": "가짜 콘텐츠 사기 피해",
        "description": "AI가 생성한 가짜 콘텐츠(딥페이크 등)로 인한 사기 피해 위험",
        "evaluation_method": "【정량지표】가짜 콘텐츠 탐지율\n• 판정: 90% 이상=양호\n【자동화】AI 생성 콘텐츠 워터마크 자동 삽입",
        "mitigation": "AI 생성 콘텐츠에 워터마크 삽입, 가짜 콘텐츠 탐지 시스템 적용",
        "likelihood": 4, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-027", "num": 27,
        "principle": "보안성 원칙", "category": "안정성",
        "title": "시스템 안정성",
        "description": "사용량 증가에 따른 부하 또는 서버 장애 시 복구 방안 부재로 서비스 중단 위험",
        "evaluation_method": "【정량지표】부하 테스트 점수\n• 판정: 99.9% 이상=안전 \n【정량지표】RTO/RPO 달성률",
        "mitigation": "부하 테스트 수행, 이중화 구성, 재해복구(DR) 계획 수립",
        "likelihood": 6, "impact": 9, "risk_grade": "HIGH",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-028", "num": 28,
        "principle": "보안성 원칙", "category": "위탁/관리",
        "title": "AI 서비스 외부 위탁",
        "description": "과도한 외부 위탁, 특정 업체에 대한 의존도 심화 등으로 운영 취약점이 발생할 위험",
        "evaluation_method": "【정량지표】SLA 준수율\n• 판정: 95% 이상=양호\n【정량지표】벤더 의존도\n• 판정: 30% 미만=적정",
        "mitigation": "SLA 실시간 모니터링, 멀티벤더 전략 수립",
        "likelihood": 5, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-029", "num": 29,
        "principle": "보안성 원칙", "category": "위탁/관리",
        "title": "모델 외부위탁 위험",
        "description": "모델 개발/운영의 외부 위탁 시 기술적 종속, 품질 관리 어려움 등의 위험",
        "evaluation_method": "【정량지표】유지보수 민첩성(MAS)\n• 판정: 90% 이상=양호\n【정량지표】핫라인 응답시간\n• 판정: 30분 이내=양호",
        "mitigation": "외부 위탁 시 핵심 기술 내재화, 핫라인 응답시간 모니터링",
        "likelihood": 5, "impact": 7, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-030", "num": 30,
        "principle": "보안성 원칙", "category": "프라이버시",
        "title": "개인 식별 정보(PII) 노출",
        "description": "모델 훈련 또는 추론 과정에서 개인식별정보가 포함된 데이터가 외부로 유출되는 위험",
        "evaluation_method": "【정량지표】멤버십 추론 탐지율\n• 판정: AUC<0.6=안전, 0.8 초과=위험\n【자동화】출력 PII 자동 마스킹",
        "mitigation": "차분 프라이버시(Differential Privacy) 적용, PII 마스킹",
        "likelihood": 4, "impact": 9, "risk_grade": "MEDIUM",
        "owner": "AI 서비스기획", "status": "identified"
    },
    {
        "risk_id": "RISK-031", "num": 31,
        "principle": "보안성 원칙", "category": "프라이버시",
        "title": "모델 인버전 공격 (Model Inversion Attack)",
        "description": "모델의 출력값으로부터 학습 데이터를 역으로 추출하는 공격 위험",
        "evaluation_method": "【정량지표】인버전 공격 재구성 정확도\n• 판정: 5% 미만=안전, 20% 초과=취약\n【자동화】분기 1회 인버전 테스트",
        "mitigation": "출력값 소수점 라운딩, 차분 프라이버시, 출력 노이즈 추가",
        "likelihood": 3, "impact": 8, "risk_grade": "LOW",
        "owner": "AI 개발", "status": "identified"
    },
    {
        "risk_id": "RISK-032", "num": 32,
        "principle": "보안성 원칙", "category": "프라이버시",
        "title": "과잉 이용자 데이터 수집",
        "description": "사용자를 지나치게 감시하거나 과잉으로 데이터를 수집하여 프라이버시를 침해할 위험",
        "evaluation_method": "【정량지표】동의율 이상치 탐지 + 최소 수집 원칙 준수율\n• 판정: 80% 이상=적정",
        "mitigation": "데이터 최소 수집 원칙 적용, 동의 UI 재검토",
        "likelihood": 3, "impact": 7, "risk_grade": "LOW",
        "owner": "AI 서비스기획", "status": "identified"
    },
]


def register_via_api():
    """JWT 토큰을 이용한 API 등록 방식"""
    import requests

    token = CONFIG.get("api_token")
    if not token:
        print("⚠ API 토큰이 설정되지 않았습니다. CONFIG['api_token']을 설정하세요.")
        print("  브라우저 개발자 도구 > Application > Local Storage > aigov_token 에서 확인 가능")
        return

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    base_url = CONFIG["api_base_url"]

    for risk in RISK_DATA:
        payload = {
            "title": risk["title"],
            "description": risk["description"],
            "principle": risk["principle"],
            "category": risk["category"],
            "evaluationMethod": risk["evaluation_method"],
            "mitigation": risk["mitigation"],
            "likelihood": risk["likelihood"],
            "impact": risk["impact"],
            "riskGrade": risk["risk_grade"],
            "owner": risk["owner"],
            "status": risk["status"],
        }

        try:
            resp = requests.post(f"{base_url}/risks", json=payload, headers=headers, timeout=10)
            if resp.ok:
                print(f"✅ {risk['risk_id']}: {risk['title']} - 등록 성공")
            else:
                print(f"❌ {risk['risk_id']}: {risk['title']} - 등록 실패 ({resp.status_code})")
        except Exception as e:
            print(f"❌ {risk['risk_id']}: {risk['title']} - 오류: {e}")


def register_via_postgresql():
    """PostgreSQL 직접 등록 방식"""
    try:
        import psycopg2
    except ImportError:
        print("pip install psycopg2-binary 를 먼저 실행하세요")
        return

    conn = psycopg2.connect(
        host=CONFIG["db_host"], port=CONFIG["db_port"],
        dbname=CONFIG["db_name"], user=CONFIG["db_user"],
        password=CONFIG["db_password"]
    )
    cur = conn.cursor()

    # 테이블 구조 확인
    cur.execute("""
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name LIKE '%risk%'
    """)
    tables = cur.fetchall()
    print(f"발견된 risk 관련 테이블: {tables}")

    if not tables:
        print("risk 관련 테이블을 찾을 수 없습니다. 테이블명을 확인 후 아래 INSERT문을 수정하세요.")
        conn.close()
        return

    table_name = tables[0][0]
    cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}'")
    columns = cur.fetchall()
    print(f"\n{table_name} 테이블 컬럼:")
    for col in columns:
        print(f"  - {col[0]} ({col[1]})")

    # INSERT 실행 (테이블 구조에 맞게 수정 필요)
    for risk in RISK_DATA:
        try:
            cur.execute(f"""
                INSERT INTO {table_name}
                (risk_id, title, description, principle, category, evaluation_method,
                 mitigation, likelihood, impact, risk_grade, owner, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (risk_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    evaluation_method = EXCLUDED.evaluation_method,
                    mitigation = EXCLUDED.mitigation,
                    likelihood = EXCLUDED.likelihood,
                    impact = EXCLUDED.impact,
                    risk_grade = EXCLUDED.risk_grade
            """, (
                risk["risk_id"], risk["title"], risk["description"],
                risk["principle"], risk["category"], risk["evaluation_method"],
                risk["mitigation"], risk["likelihood"], risk["impact"],
                risk["risk_grade"], risk["owner"], risk["status"],
                datetime.now()
            ))
            print(f"✅ {risk['risk_id']}: {risk['title']}")
        except Exception as e:
            print(f"❌ {risk['risk_id']}: {e}")
            conn.rollback()

    conn.commit()
    cur.close()
    conn.close()
    print(f"\n총 {len(RISK_DATA)}개 위험항목 등록 완료")


def register_via_mongodb():
    """MongoDB 직접 등록 방식"""
    try:
        from pymongo import MongoClient
    except ImportError:
        print("pip install pymongo 를 먼저 실행하세요")
        return

    client = MongoClient(CONFIG["mongo_uri"])
    db = client.get_default_database()

    # 컬렉션 확인
    collections = db.list_collection_names()
    print(f"컬렉션 목록: {collections}")
    risk_collections = [c for c in collections if 'risk' in c.lower()]
    print(f"risk 관련 컬렉션: {risk_collections}")

    if not risk_collections:
        print("risk 관련 컬렉션이 없습니다. 'risks' 컬렉션을 생성합니다.")
        collection = db["risks"]
    else:
        collection = db[risk_collections[0]]

    for risk in RISK_DATA:
        doc = {**risk, "createdAt": datetime.now(), "updatedAt": datetime.now()}
        result = collection.update_one(
            {"risk_id": risk["risk_id"]},
            {"$set": doc},
            upsert=True
        )
        status = "업데이트" if result.modified_count else "신규등록"
        print(f"✅ {risk['risk_id']}: {risk['title']} ({status})")

    print(f"\n총 {len(RISK_DATA)}개 위험항목 등록 완료")
    client.close()


def export_json():
    """JSON 파일로 내보내기 (범용)"""
    output = {
        "version": "1.0",
        "exported_at": datetime.now().isoformat(),
        "total_risks": len(RISK_DATA),
        "grade_distribution": {
            "HIGH": sum(1 for r in RISK_DATA if r["risk_grade"] == "HIGH"),
            "MEDIUM": sum(1 for r in RISK_DATA if r["risk_grade"] == "MEDIUM"),
            "LOW": sum(1 for r in RISK_DATA if r["risk_grade"] == "LOW"),
        },
        "risks": RISK_DATA
    }

    filename = f"aigov_risks_v1.0_{datetime.now().strftime('%Y%m%d')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"✅ JSON 파일 생성: {filename}")
    print(f"   총 {len(RISK_DATA)}개 위험항목")


if __name__ == "__main__":
    print("=" * 60)
    print("AIGov 플랫폼 위험평가서 DB 등록 도구")
    print("=" * 60)
    print(f"\n등록할 위험항목: {len(RISK_DATA)}개")
    print(f"  - HIGH: {sum(1 for r in RISK_DATA if r['risk_grade'] == 'HIGH')}개")
    print(f"  - MEDIUM: {sum(1 for r in RISK_DATA if r['risk_grade'] == 'MEDIUM')}개")
    print(f"  - LOW: {sum(1 for r in RISK_DATA if r['risk_grade'] == 'LOW')}개")
    print()
    print("등록 방식을 선택하세요:")
    print("  1. API 방식 (JWT 토큰 필요)")
    print("  2. PostgreSQL 직접 등록")
    print("  3. MongoDB 직접 등록")
    print("  4. JSON 파일 내보내기")
    print()

    choice = input("선택 (1-4): ").strip()

    if choice == "1":
        register_via_api()
    elif choice == "2":
        register_via_postgresql()
    elif choice == "3":
        register_via_mongodb()
    elif choice == "4":
        export_json()
    else:
        print("잘못된 선택입니다.")
        export_json()

/**
 * 강지연 (Kang Ji-yeon) 포트폴리오 프로젝트 데이터
 * 2001년 ~ 2026년 총 40개 프로젝트 수록
 */

// 퍼블리싱 마크업 산출물 (Live Demo URL) 목록
const portfolioLiveLinks = [
  {
    label: "날씨알리미",
    url: "https://mizushiro.github.io/nuri-app/html/main.html",
    client: "기상청"
  },
  {
    label: "날씨누리",
    url: "https://mizushiro.github.io/nuri-web/",
    client: "기상청"
  },
  {
    label: "탐나는전",
    url: "https://mizushiro.github.io/m-pay/html/markup-tnj-list.html",
    client: "제주시"
  },
  {
    label: "익산다이로움",
    url: "https://mizushiro.github.io/m-pay/html/markup-list.html",
    client: "익산시"
  },
  {
    label: "서울페이 AI",
    url: "https://mizushiro.github.io/AI-search/html/markup-list.html",
    client: "서울시"
  }
];

const portfolioProjects = [
  {
    id: 1,
    title: "날씨알리미 앱 고도화",
    period: "2026.09 ~ 2026.10",
    client: "기상청",
    company: "아파트앤",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "테마적용"],
    hasAccessibility: true,
    featured: true,
    url: "https://mizushiro.github.io/nuri-app/html/main.html",
    urlLabel: "날씨알리미",
    links: [
      { label: "날씨알리미", url: "https://mizushiro.github.io/nuri-app/html/main.html" }
    ],
    description: "대한민국 기상청 대국민 모바일 기상정보 서비스 '날씨알리미' 앱 고도화 퍼블리싱. 사용자 맞춤형 다크/라이트 테마 적용과 엄격한 모바일 웹접근성(WA) 규격을 준수하여 고신뢰성 기상 특보 및 알림 UI 구현.",
    keyPoints: [
      "사용자 환경에 맞춘 다크/라이트 등 멀티 테마 적용 및 CSS 변수 아키텍처 설계",
      "대국민 기상 앱 서비스의 웹접근성(WA) 준수 및 모바일 스크린리더 호환성 확보",
      "모바일 디바이스 해상도별 최적화된 기상 특보 및 실시간 날씨 알림 UI 마크업"
    ]
  },
  {
    id: 2,
    title: "암웨이 운영",
    period: "2026.07 ~ 2026.09",
    client: "암웨이",
    company: "네티브",
    role: "PM (기획 / 웹퍼블리셔)",
    roleType: "PM",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "운영/유지보수"],
    hasAccessibility: true,
    featured: false,
    description: "글로벌 웰니스 기업 암웨이(Amway) 디지털 서비스 운영 및 고도화 프로젝트. 기획 및 웹퍼블리싱 PM으로서 웹접근성 지침 준수와 크로스 브라우징 안정성 확보를 총괄.",
    keyPoints: [
      "기획 및 퍼블리싱 일정 조율과 품질 검수 총괄 (PM)",
      "웹접근성 표준 가이드라인 준수 및 사용자 편의성 제고",
      "복잡한 프로모션 및 제품 상세 페이지 UI 신속 구축"
    ]
  },
  {
    id: 3,
    title: "날씨누리 고도화",
    period: "2026.05 ~ 2026.06",
    client: "기상청",
    company: "아파트앤",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "반응형웹"],
    hasAccessibility: true,
    featured: true,
    url: "https://mizushiro.github.io/nuri-web/",
    urlLabel: "날씨누리",
    links: [
      { label: "날씨누리", url: "https://mizushiro.github.io/nuri-web/" }
    ],
    description: "대한민국 기상청 대국민 기상정보 포털 '날씨누리' 고도화 퍼블리싱. 재난재해 정보의 신속하고 명확한 전달을 위한 고신뢰성 반응형 UI 및 엄격한 국가 공공기관 웹접근성(WA) 규격 준수.",
    keyPoints: [
      "대국민 서비스에 맞춘 완벽한 웹접근성(KWCAG 2.2) 품질 인증 기준 충족",
      "다양한 디바이스와 화면 해상도를 지원하는 유연한 반응형 레이아웃 구축",
      "기상 차트 및 실시간 레이더 지도 정보 영역의 시맨틱 마크업 최적화"
    ]
  },
  {
    id: 4,
    title: "롯데 GRS 정산 시스템 구축",
    period: "2026.02 ~ 2026.05",
    client: "롯데GRS",
    company: "크루메이트",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "Vue.js", "대규모 그리드"],
    hasAccessibility: false,
    featured: true,
    description: "롯데GRS(롯데리아, 엔제리너스 등)의 가맹점 및 본사 간 대규모 정산 관리 시스템 구축. Vue.js 기반 대용량 데이터 테이블 및 복잡한 정산 수식 인터페이스의 반응형 UI 퍼블리싱.",
    keyPoints: [
      "Vue.js 컴포넌트 아키텍처에 맞춘 모듈식 CSS 및 레이아웃 설계",
      "방대한 정산 그리드/테이블의 가독성과 조작 편의성 극대화",
      "관리자 대시보드 및 복합 필터 UI의 직관적인 사용자 경험 구현"
    ]
  },
  {
    id: 5,
    title: "제주 탐나는전 구축",
    period: "2025.11 ~ 2026.01",
    client: "제주시",
    company: "비즈플레이",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "모바일 웹"],
    hasAccessibility: true,
    featured: false,
    url: "https://mizushiro.github.io/m-pay/html/markup-tnj-list.html",
    urlLabel: "탐나는전",
    links: [
      { label: "탐나는전", url: "https://mizushiro.github.io/m-pay/html/markup-tnj-list.html" }
    ],
    description: "제주 지역화폐 '탐나는전' 플랫폼 신규 구축. 도민과 관광객 누구나 쉽게 결제 및 가맹점 조회를 이용할 수 있도록 모바일 중심 UI 및 웹접근성 인증 기준 적용.",
    keyPoints: [
      "공공 지역화폐 플랫폼 웹접근성 인증마크 획득 지원",
      "모바일 퍼스트 반응형 레이아웃 및 터치 인터랙션 최적화",
      "가맹점 찾기 및 충전/결제 내역 조회 UI 시각화"
    ]
  },
  {
    id: 6,
    title: "브라보 코리아 고도화",
    period: "2025.07 ~ 2025.10",
    client: "전북은행",
    company: "프레임아웃",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "finance",
    categoryLabel: "금융 & 결제",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "웹접근성", "금융UI"],
    hasAccessibility: true,
    featured: true,
    description: "전북은행 글로벌 송금 및 외국인 금융 서비스 '브라보 코리아' 고도화. React 기반 금융 애플리케이션의 철저한 보안 규정과 금융 웹접근성 가이드라인을 충족하는 UI 개발 총괄.",
    keyPoints: [
      "React 컴포넌트 단위 스타일링 및 재사용 가능한 금융 폼 컨트롤 제작",
      "스크린리더(Screen Reader) 사용자 및 키보드 전용 조작자를 위한 접근성 지원",
      "다국어 환경을 고려한 레이아웃 가변 폭 및 텍스트 래핑 최적화"
    ]
  },
  {
    id: 7,
    title: "디지털 교과서 (중학 수학)",
    period: "2025.04 ~ 2025.06",
    client: "미래엔",
    company: "LH",
    role: "PM (웹퍼블리셔)",
    roleType: "PM",
    category: "education",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "웹접근성", "인터랙티브"],
    hasAccessibility: true,
    featured: true,
    description: "교육부 AIDT(AI 디지털 교과서) 검정 기준에 부합하는 중학교 수학 디지털 교과서 플랫폼. 시각장애·학습장애 학생을 위한 대체 텍스트와 수식 마크업, 인터랙티브 학습 도구 개발 총괄.",
    keyPoints: [
      "엄격한 교육부 디지털 교과서 웹접근성 인증 기준 100% 충족",
      "수식, 도형, 인터랙티브 문제 풀이 캔버스에 최적화된 마크업 설계",
      "태블릿(아이패드, 갤럭시탭), 크롬북 등 교실 보급 디바이스 전 기종 반응형 테스트 완료"
    ]
  },
  {
    id: 8,
    title: "서울페이 AI",
    period: "2025.04",
    client: "서울시",
    company: "비즈플레이",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성"],
    hasAccessibility: true,
    featured: false,
    url: "https://mizushiro.github.io/AI-search/html/markup-list.html",
    urlLabel: "서울페이 AI",
    links: [
      { label: "서울페이 AI", url: "https://mizushiro.github.io/AI-search/html/markup-list.html" }
    ],
    description: "서울시 지역화폐 및 가맹점 통합 플랫폼 '서울페이+' AI 검색 서비스 퍼블리싱. 시민들이 원하는 가맹점과 혜택 정보를 대화형·지능형 인터페이스로 손쉽게 탐색할 수 있도록 모바일 웹접근성 표준 준수 및 직관적 UI 구현.",
    keyPoints: [
      "공공 결제 플랫폼 웹접근성 가이드라인 준수 및 모바일 스크린리더 대응",
      "AI 검색 프롬프트, 추천 키워드 및 가맹점 검색 결과 카드 UI 마크업",
      "다양한 모바일 뷰포트 환경에 최적화된 유연한 반응형 레이아웃 설계"
    ]
  },
  {
    id: 9,
    title: "익산 다이로움 구축",
    period: "2025.01 ~ 2025.03",
    client: "익산시",
    company: "비즈플레이",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "핀테크"],
    hasAccessibility: true,
    featured: false,
    url: "https://mizushiro.github.io/m-pay/html/markup-list.html",
    urlLabel: "익산다이로움",
    links: [
      { label: "익산다이로움", url: "https://mizushiro.github.io/m-pay/html/markup-list.html" }
    ],
    description: "익산시 복합 공공 배달 및 지역화폐 포털 '익산 다이로움' 구축. 시민들의 편리한 가맹점 이용 및 혜택 조회를 위한 직관적 카드형 UI 및 웹접근성 구현.",
    keyPoints: [
      "공공기관 웹접근성 표준 준수 및 심사 통과",
      "지역화폐 잔액 조회, 캐시백 알림 등 실시간성 금융 위젯 스타일링",
      "퍼블리싱 PL로서 팀원 마크업 가이드라인 정립 및 코드 리뷰 진행"
    ]
  },
  {
    id: 10,
    title: "디지털 교과서 (중학 정보 / 고등 정보)",
    period: "2024.09 ~ 2024.12",
    client: "미래엔",
    company: "LH",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "education",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "웹접근성", "에듀테크"],
    hasAccessibility: true,
    featured: false,
    description: "미래엔 AIDT 중학교·고등학교 정보 교과서 플랫폼 구축. 코딩 실습, 알고리즘 시각화 블록, 텍스트 에디터 연동 등 에듀테크 특화 인터랙티브 UI 마크업 총괄.",
    keyPoints: [
      "React 기반 학습 모듈 연동 및 상태값에 따른 다이내믹 UI 컴포넌트화",
      "코드 블록, 플로우차트 등 복잡한 시각 자료의 스크린리더 접근성 부여",
      "초·중등 학생 사용성에 맞춘 터치 타깃 및 대비비(Contrast Ratio) 최적화"
    ]
  },
  {
    id: 11,
    title: "스토브(STOVE) 개편 / 스튜디오 개편 / 디자인 시스템 구축",
    period: "2021.05 ~ 2024.09",
    client: "스마일게이트 홀딩스",
    company: "리드코드",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "design-system",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML5", "CSS3", "JavaScript", "Vue.js", "Storybook", "Tailwind CSS", "Design System"],
    hasAccessibility: false,
    featured: true,
    description: "스마일게이트 글로벌 게임 플랫폼 'STOVE' 전면 개편 및 입점사 파트너 플랫폼 '스튜디오' 구축, 전사 통합 디자인 시스템(Design System) 설계 및 개발 (3년 5개월간 퍼블리싱 총괄).",
    keyPoints: [
      "Storybook 기반 전사 공통 UI 컴포넌트 라이브러리 및 디자인 토큰 체계 구축",
      "Vue.js + Tailwind CSS 아키텍처 도입으로 개발 생산성 40% 이상 향상",
      "글로벌(다국어 지원) 반응형 웹 플랫폼 설계 및 엔지니어링 표준 수립",
      "게임 커뮤니티, 스토어, 결제, 파트너 콘솔을 아우르는 일관된 브랜딩 UI 완성"
    ]
  },
  {
    id: 12,
    title: "GS fresh 운영 고도화",
    period: "2020.11 ~ 2021.04",
    client: "GS fresh",
    company: "리드코드",
    role: "PA (웹퍼블리셔)",
    roleType: "Publisher",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "Vue.js", "이커머스"],
    hasAccessibility: false,
    featured: false,
    description: "GS리테일 신선식품 장보기 몰 'GS fresh' 이커머스 운영 고도화. 타임딜, 기획전, 장바구니/주문서 영역의 퍼포먼스 튜닝 및 사용자 구매 전환율 증대를 위한 모바일 UI 개선.",
    keyPoints: [
      "Vue.js 템플릿과 연동되는 장바구니 및 체크아웃 인터페이스 퍼블리싱",
      "빠른 이벤트 론칭을 위한 반응형 기획전 템플릿 모듈화",
      "모바일 로딩 속도 향상을 위한 경량화 CSS 및 이미지 지연 로딩 처리"
    ]
  },
  {
    id: 13,
    title: "아파트엔 구축",
    period: "2020.08 ~ 2020.10",
    client: "아파트엔",
    company: "아파트엔",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "platform",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML5", "CSS3", "JavaScript", "반응형웹", "플랫폼UI"],
    hasAccessibility: false,
    featured: false,
    description: "스마트 아파트 생활 지원 플랫폼 '아파트엔' 웹/모바일 서비스 신규 구축. 전자투표, 관리비 조회, 커뮤니티 게시판 등 입주민 라이프케어 기능을 직관적 UI로 구현.",
    keyPoints: [
      "모바일 및 데스크탑을 모두 만족하는 풀 반응형 웹 구축",
      "전자투표 및 관리비 명세서 등 고가독성 데이터 시각화 마크업",
      "퍼블리싱 단독 리드로서 프로젝트 3개월 내 성공적 오픈 견인"
    ]
  },
  {
    id: 14,
    title: "암웨이 고도화",
    period: "2020.01 ~ 2020.07",
    client: "암웨이",
    company: "더그랩",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML5", "CSS3", "JavaScript", "반응형웹", "글로벌UI"],
    hasAccessibility: false,
    featured: false,
    description: "암웨이 코리아 공식 비즈니스 및 쇼핑 포털 대규모 고도화. 회원 등급별 맞춤 대시보드와 스마트 오더 주문 프로세스의 UI 개편 총괄.",
    keyPoints: [
      "퍼블리싱 PL로서 전 사이트 마크업 구조 표준화",
      "대용량 트래픽 대비 CSS 파일 번들링 최적화",
      "복합 필터 검색 및 카탈로그 그리드 반응형 레이아웃 적용"
    ]
  },
  {
    id: 15,
    title: "Ebay 버티컬 고도화",
    period: "2019.07 ~ 2019.12",
    client: "이베이",
    company: "하이브랩",
    role: "PA (웹퍼블리셔)",
    roleType: "Publisher",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "대규모 이커머스"],
    hasAccessibility: false,
    featured: false,
    description: "이베이 코리아(G마켓, 옥션) 버티컬 카테고리(패션, 가전, 뷰티) 서비스 고도화. React 기반 동적 컴포넌트 마크업 및 빠른 반응속도의 필터링 UI 구현.",
    keyPoints: [
      "대규모 트래픽 이커머스에 최적화된 시맨틱 마크업 설계",
      "React 상태 변화에 유연하게 반응하는 CSS 트랜지션 및 인터랙션 구현",
      "하이브랩 퍼블리싱 품질 표준 및 크로스 브라우징 가이드 준수"
    ]
  },
  {
    id: 16,
    title: "STOVE 입점사 VOC 지원",
    period: "2018.06 ~ 2019.06",
    client: "스마일게이트 홀딩스",
    company: "비디스낵",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "platform",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML5", "CSS3", "JavaScript", "관리자 콘솔", "VOC 시스템"],
    hasAccessibility: false,
    featured: false,
    description: "스마일게이트 STOVE 글로벌 입점 인디/메이저 게임사 지원 백오피스 및 고객의 소리(VOC) 통합 관리 콘솔 구축. 1년간 안정적 운영 및 기능 확장 리딩.",
    keyPoints: [
      "게임사 운영진을 위한 고밀도 어드민 테이블 및 티켓 관리 UI 설계",
      "실시간 문의 처리 인터페이스 및 첨부파일/로그 뷰어 스타일링",
      "UI 컴포넌트 재사용 가이드라인을 통한 유지보수 비용 절감"
    ]
  },
  {
    id: 17,
    title: "푸르덴셜 사이버창구 앱 구축",
    period: "2018.02 ~ 2018.05",
    client: "푸르덴셜생명",
    company: "adnStyle",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "finance",
    categoryLabel: "금융 & 결제",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "하이브리드 앱"],
    hasAccessibility: true,
    featured: false,
    description: "푸르덴셜생명 대고객 모바일 사이버창구 하이브리드 앱 신규 구축. 보험 계약 조회, 대출 신청, 사고보험금 청구 등 고도의 보안과 접근성이 요구되는 금융 서비스 UI 총괄.",
    keyPoints: [
      "금융감독원 웹접근성 인증 기준 100% 충족 및 인증마크 획득",
      "스마트폰 환경에 맞춤형 키패드, 공인인증 및 본인인증 팝업 마크업",
      "하이브리드 앱 웹뷰(WebView) 특화 터치 반응 및 성능 최적화"
    ]
  },
  {
    id: 18,
    title: "현대백화점 인터넷면세점 구축",
    period: "2017.06 ~ 2018.01",
    client: "현대백화점인터넷면세점",
    company: "크루메이트",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "면세점 쇼핑몰", "글로벌 반응형"],
    hasAccessibility: false,
    featured: true,
    description: "현대백화점 면세점 신규 론칭을 위한 대규모 온라인 쇼핑몰 구축. 럭셔리 브랜드 감성을 살린 미려한 인터랙션과 출국일/항공편 연동 면세 쇼핑 프로세스 UI 퍼블리싱 총괄.",
    keyPoints: [
      "퍼블리싱 PL로서 국문/중문/영문 다국어 쇼핑몰 퍼블리싱 아키텍처 수립",
      "고급스러운 비주얼을 위한 모던 CSS 그리드 및 패럴랙스 인터랙션 적용",
      "브랜드별 커스텀 샵인샵(Shop-in-Shop) 템플릿 모듈화"
    ]
  },
  {
    id: 19,
    title: "AJ 렌터카 ERP 시스템",
    period: "2017.03 ~ 2017.05",
    client: "AJ 렌터카",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "ERP", "업무용 솔루션"],
    hasAccessibility: false,
    featured: false,
    description: "AJ 렌터카 전사 차량 배차, 계약 관리, 법인 렌탈 정산 ERP 업무 시스템 UI 고도화.",
    keyPoints: [
      "복잡한 업무 흐름을 지원하는 멀티 탭 및 윈도우 분할 레이아웃 구축",
      "실시간 차량 현황 맵 및 예약 스케줄러 UI 스타일링",
      "업무 효율 증대를 위한 단축키 및 테이블 조작성 강화"
    ]
  },
  {
    id: 20,
    title: "홈앤쇼핑 UI 개선 고도화",
    period: "2016.10 ~ 2017.02",
    client: "홈앤쇼핑",
    company: "유젠",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "홈쇼핑", "생방송 스트리밍 UI"],
    hasAccessibility: false,
    featured: false,
    description: "TV홈쇼핑 연동 대형 커머스 '홈앤쇼핑' 웹/모바일 UI 전면 개편. 온에어 생방송 시청과 실시간 주문이 동시에 이뤄지는 듀얼 스크린 UI 퍼블리싱.",
    keyPoints: [
      "실시간 방송 톡(Chat) 및 수량 카운트다운 인터랙션 마크업",
      "원클릭 간편결제 및 모바일 결제 퍼널 최적화로 이탈률 개선",
      "크로스 브라우징 및 구형 모바일 브라우저 호환성 완벽 지원"
    ]
  },
  {
    id: 21,
    title: "삼성카드 1.6 고도화",
    period: "2016.07 ~ 2016.09",
    client: "삼성카드",
    company: "바이럴",
    role: "PA (웹퍼블리셔)",
    roleType: "Publisher",
    category: "finance",
    categoryLabel: "금융 & 결제",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "금융UI"],
    hasAccessibility: true,
    featured: false,
    description: "삼성카드 대표 포털 1.6 버전 서비스 개선. 카드 혜택 비교, 포인트 결제, 명세서 조회 등 대고객 금융 서비스의 웹접근성 인증 유지 및 성능 개선.",
    keyPoints: [
      "국가 공인 웹접근성 품질마크 갱신 심사 통과 지원",
      "고대비 테마 및 폰트 크기 조절 기능 마크업",
      "카드 추천 인터랙티브 필터 컴포넌트 퍼블리싱"
    ]
  },
  {
    id: 22,
    title: "기아자동차 UK 프로젝트",
    period: "2016.02 ~ 2016.06",
    client: "기아자동차",
    company: "블루다임",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "글로벌 사이트"],
    hasAccessibility: true,
    featured: false,
    description: "기아자동차 영국(UK) 공식 브랜드 사이트 구축 프로젝트. 유럽 웹 접근성(W3C WCAG) 규정 및 글로벌 브랜드 디자인 가이드를 충실히 반영한 반응형 UI 총괄.",
    keyPoints: [
      "유럽 웹접근성 법적 규격(WCAG 2.0 AA) 기준 마크업 완비",
      "차량 커스터마이저(Build Your Car) 색상/트림 360도 뷰어 UI 퍼블리싱",
      "글로벌 영문 타이포그래피 및 유동 그리드 시스템 구축"
    ]
  },
  {
    id: 23,
    title: "교보생명 광화문 읽거느 반응형 구축",
    period: "2015.09 ~ 2016.01",
    client: "교보생명",
    company: "네티브",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "finance",
    categoryLabel: "금융 & 결제",
    skills: ["HTML5", "CSS3", "JavaScript", "반응형웹", "문화 콘텐츠"],
    hasAccessibility: false,
    featured: false,
    description: "교보생명 대표 문화 소통 브랜드 '광화문에서 읽다 거닐다 느끼다(읽거느)' 공식 웹진 반응형 전면 개편.",
    keyPoints: [
      "텍스트와 고화질 이미지가 조화로운 감성 매거진 레이아웃 구현",
      "스크롤에 따른 서체 전환 및 애니메이션 효과 적용",
      "SNS 공유 및 반응형 독서 콘텐츠 뷰어 퍼블리싱"
    ]
  },
  {
    id: 24,
    title: "가게노트 구축",
    period: "2014.12 ~ 2015.08",
    client: "굿바이노트",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "platform",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML5", "CSS3", "JavaScript", "반응형웹", "소상공인 솔루션"],
    hasAccessibility: false,
    featured: false,
    description: "소상공인 매장 매출 관리 및 장부 솔루션 '가게노트' 웹/모바일 서비스 신규 구축.",
    keyPoints: [
      "모바일 화면에서도 한눈에 파악되는 일별/월별 매출 장부 UI 제작",
      "직관적인 영수증 촬영 업로드 및 승인 인터페이스 스타일링",
      "반응형 웹 기반 가벼운 DOM 구조 유지"
    ]
  },
  {
    id: 25,
    title: "GS shop 고도화",
    period: "2014.09 ~ 2014.11",
    client: "GS shop",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "대형 이커머스", "모바일 웹"],
    hasAccessibility: false,
    featured: false,
    description: "국내 선두 종합쇼핑몰 GS SHOP 모바일 웹 및 프로모션 페이지 고도화.",
    keyPoints: [
      "일일 수천만 PV 트래픽을 견디는 경량 마크업 구조",
      "주요 이벤트 배너 및 스와이프 터치 갤러리 구현",
      "장바구니 결제 프로세스 간소화 UI 퍼블리싱"
    ]
  },
  {
    id: 26,
    title: "신한카드 운영 고도화",
    period: "2013.10 ~ 2014.08",
    client: "신한카드",
    company: "네티브",
    role: "PA (웹퍼블리셔)",
    roleType: "Publisher",
    category: "finance",
    categoryLabel: "금융 & 결제",
    skills: ["HTML5", "CSS3", "JavaScript", "웹접근성", "금융 포털"],
    hasAccessibility: true,
    featured: false,
    description: "신한카드 대고객 온라인 창구 및 상품 안내 포털 연간 운영 고도화. 금융권 최고 수준의 보안 및 접근성 준수.",
    keyPoints: [
      "금융 웹접근성 인증마크 갱신 및 연간 유지보수",
      "맞춤형 카드 추천 시뮬레이터 및 포인트 몰 UI 퍼블리싱",
      "공인인증서, 키보드 보안 프로그램 연동 마크업 지원"
    ]
  },
  {
    id: 27,
    title: "삼성웰넷 구축",
    period: "2013.04 ~ 2013.09",
    client: "삼성전자",
    company: "블루다임",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "인트라넷", "사내 포털"],
    hasAccessibility: false,
    featured: false,
    description: "삼성전자 임직원 복지 및 사내 복지몰 '삼성웰넷' 포털 리뉴얼 구축.",
    keyPoints: [
      "삼성 브랜드 가이드라인을 준수한 일관된 기업 인트라넷 스타일링",
      "복지 포인트 조회 및 복지 시설 예약 캘린더 UI 마크업",
      "사내 다양한 업무 브라우저(IE 및 모던 브라우저) 크로스 브라우징 완벽 지원"
    ]
  },
  {
    id: 28,
    title: "삼성와이즈미팅 구축",
    period: "2013.02 ~ 2013.03",
    client: "삼성 SDS",
    company: "adnStyle",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "화상회의 UI"],
    hasAccessibility: false,
    featured: false,
    description: "삼성 SDS 글로벌 기업용 스마트 화상회의 솔루션 '삼성와이즈미팅' 웹 클라이언트 구축.",
    keyPoints: [
      "화상 회의실 그리드 분할 및 발표 자료 공유 패널 스타일링",
      "실시간 참가자 명단 및 채팅 위젯 반응형 레이아웃 구현",
      "웹 표준 기반 클린 코드 작성"
    ]
  },
  {
    id: 29,
    title: "한국산업기술평가관리원 Redis 개편",
    period: "2012.11 ~ 2013.01",
    client: "한국산업기술평가관리원",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML5", "CSS3", "JavaScript", "공공포털"],
    hasAccessibility: false,
    featured: false,
    description: "국가 연구개발(R&D) 과제 정보 관리 시스템 Redis 개편 퍼블리싱.",
    keyPoints: [
      "국가 R&D 과제 신청 및 평가 데이터 폼 마크업 최적화",
      "대형 공공 데이터베이스 테이블의 가독성 제고",
      "웹 표준 지침에 맞춘 시맨틱 태그 구조화"
    ]
  },
  {
    id: 30,
    title: "삼성닷컴, CTOSS 구축",
    period: "2012.04 ~ 2012.10",
    client: "삼성전자",
    company: "블루다임",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "글로벌 포털"],
    hasAccessibility: false,
    featured: false,
    description: "삼성전자 글로벌 대표 사이트 '삼성닷컴' 및 온라인 쇼핑 지원 시스템 CTOSS 구축.",
    keyPoints: [
      "글로벌 대규모 트래픽 사이트의 웹 표준 퍼블리싱",
      "신제품 쇼케이스 및 인터랙티브 제품 사양 비교표 스타일링",
      "전 세계 각국 로케일 언어 확장을 고려한 유연한 텍스트 블록 설계"
    ]
  },
  {
    id: 31,
    title: "Samsungadhub 구축",
    period: "2011.09 ~ 2012.03",
    client: "삼성 SDS",
    company: "아이파트너즈",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML5", "CSS3", "JavaScript", "애드테크"],
    hasAccessibility: false,
    featured: false,
    description: "삼성 스마트 TV 및 모바일 글로벌 디지털 광고 플랫폼 'Samsung AdHub' 콘솔 구축.",
    keyPoints: [
      "광고주 및 매체사를 위한 캠페인 성과 지표 대시보드 마크업",
      "광고 소재 실시간 미리보기 및 슬롯 설정 인터페이스 제작",
      "퍼블리싱 PL로서 전체 공정 일정 관리 및 품질 보증"
    ]
  },
  {
    id: 32,
    title: "쿠폰 차트 사이트 구축",
    period: "2011.02 ~ 2011.08",
    client: "쿠폰차트",
    company: "프리랜서",
    role: "PL (디자인 / 퍼블리싱)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML", "CSS", "JavaScript", "웹디자인", "퍼블리싱"],
    hasAccessibility: false,
    featured: false,
    description: "소셜커머스 쿠폰 메타 랭킹 및 가격비교 사이트 '쿠폰차트' UI 디자인 및 퍼블리싱 총괄.",
    keyPoints: [
      "초기 UI/UX 디자인 시안 수립부터 HTML/CSS 퍼블리싱까지 전 과정 리드",
      "실시간 순위 롤링 배너 및 카테고리별 상품 그리드 구성",
      "크로스 브라우징 및 검색엔진 최적화(SEO) 마크업 적용"
    ]
  },
  {
    id: 33,
    title: "건강보험심사평가원 의약품 정보센터 구축",
    period: "2010.09 ~ 2011.01",
    client: "건강보험심사평가원",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML", "CSS", "JavaScript", "웹접근성", "공공의료"],
    hasAccessibility: true,
    featured: false,
    description: "건강보험심사평가원 의약품관리종합정보센터(KPIS) 대국민 의약품 안전 정보 포털 구축.",
    keyPoints: [
      "공공기관 웹접근성 품질 인증(WA 마크) 기준 충족",
      "의약품 바코드, 유통 이력, 복약 정보 조회를 위한 테이블 시맨틱 마크업",
      "어르신 및 저시력자를 위한 글자 크기 확대/축소 스크립트 연동"
    ]
  },
  {
    id: 34,
    title: "양재 aT센터 대표 포털 구축",
    period: "2010.06 ~ 2010.08",
    client: "aT 센터",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML", "CSS", "JavaScript", "전시/컨벤션"],
    hasAccessibility: false,
    featured: false,
    description: "한국농수산식품유통공사 aT센터 전시·컨벤션 홀 대관 및 행사 안내 대표 사이트 구축.",
    keyPoints: [
      "전시장 층별 안내도 및 대관 신청 캘린더 인터페이스 구현",
      "행사 일정 및 부스 배치도 뷰어 마크업",
      "웹 표준 준수로 다양한 브라우저 호환성 제공"
    ]
  },
  {
    id: 35,
    title: "국토해양부 대국민 포털 구축",
    period: "2010.02 ~ 2010.05",
    client: "국토해양부",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML", "CSS", "JavaScript", "웹접근성", "대국민 포털"],
    hasAccessibility: true,
    featured: false,
    description: "국토해양부 국가 정책 알림 및 민원 신청 대국민 포털 퍼블리싱 총괄.",
    keyPoints: [
      "국가 행정기관 웹접근성 가이드라인(KWCAG) 완전 준수",
      "스크린리더 음성 낭독에 최적화된 시맨틱 구조 및 건너뛰기 링크 설계",
      "정보 공개 청구 및 전자 민원 신청 폼 마크업 최적화"
    ]
  },
  {
    id: 36,
    title: "보건복지부 금연길라잡이 / 건강정보광장 구축",
    period: "2009.08 ~ 2010.01",
    client: "보건복지부",
    company: "M114",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "public",
    categoryLabel: "공공 & 교육",
    skills: ["HTML", "CSS", "JavaScript", "웹접근성", "공공 헬스케어"],
    hasAccessibility: true,
    featured: false,
    description: "보건복지부 국가 공공 보건 프로젝트 '금연길라잡이' 및 '국가건강정보포털' 신규 구축.",
    keyPoints: [
      "초기 국가 웹접근성 표준화 도입 시기 선도적 웹접근성(WA) 마크 획득",
      "금연 계산기, 금단증상 자가진단 인터랙티브 툴 스타일링",
      "건강 칼럼 및 질환 백과사전의 가독성 중심 마크업"
    ]
  },
  {
    id: 37,
    title: "11번가 통합 프로젝트",
    period: "2009.05 ~ 2009.07",
    client: "11번가",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "commerce",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML", "CSS", "JavaScript", "오픈마켓"],
    hasAccessibility: false,
    featured: false,
    description: "SK텔레콤 오픈마켓 11번가 서비스 통합 및 프로모션 시스템 구축.",
    keyPoints: [
      "대형 오픈마켓 카테고리 내비게이션 및 메가 메뉴 퍼블리싱",
      "핫딜, 쇼킹딜 등 실시간 타임특가 위젯 스타일링",
      "속도 최적화를 위한 CSS 스프라이트(Sprite) 기법 적용"
    ]
  },
  {
    id: 38,
    title: "비밀닷컴(삼성에버랜드) 운영 및 고도화",
    period: "2008.07 ~ 2009.03",
    client: "삼성에버랜드",
    company: "클라우드나인",
    role: "PA (웹퍼블리셔)",
    roleType: "Publisher",
    category: "platform",
    categoryLabel: "디자인시스템 & 플랫폼",
    skills: ["HTML", "CSS", "JavaScript", "테마파크/레저"],
    hasAccessibility: false,
    featured: false,
    description: "삼성에버랜드 레저/리조트 멤버십 포털 '비밀닷컴' 서비스 운영 및 고도화.",
    keyPoints: [
      "에버랜드, 캐리비안베이 온라인 예매 및 패키지 상품 UI 퍼블리싱",
      "시즌별 축제(할로윈, 튤립 등) 비주얼 프로모션 페이지 신속 배포",
      "크로스 브라우징 안정성 유지"
    ]
  },
  {
    id: 39,
    title: "현대상선 대표 웹사이트 구축",
    period: "2008.01 ~ 2008.06",
    client: "현대상선",
    company: "프리랜서",
    role: "PL (웹퍼블리셔)",
    roleType: "PL",
    category: "enterprise",
    categoryLabel: "커머스 & 엔터프라이즈",
    skills: ["HTML", "CSS", "JavaScript", "글로벌 해운 포털"],
    hasAccessibility: false,
    featured: false,
    description: "글로벌 종합해운 물류기업 '현대상선(HMM)' 다국어 공식 웹사이트 구축.",
    keyPoints: [
      "컨테이너 선박 스케줄 실시간 조회 및 화물 추적(Tracking) UI 제작",
      "영문/국문 다국어 사이트의 안정적 웹 표준 구조화",
      "퍼블리싱 PL로서 일정 준수 및 발주사 검수 완료"
    ]
  },
  {
    id: 40,
    title: "교육발전소 웹사이트 및 교육 솔루션 제작",
    period: "2001.02 ~ 2007.12",
    client: "교육발전소",
    company: "교육발전소",
    role: "대리 (웹디자인 / 웹코딩 / 퍼블리싱)",
    roleType: "Publisher",
    category: "education",
    categoryLabel: "공공 & 교육",
    skills: ["HTML", "CSS", "JavaScript", "Web Design", "Web Coder"],
    hasAccessibility: false,
    featured: false,
    description: "온라인 이러닝 솔루션 및 초중고 교육 포털 사이트 다수 기획, 디자인 및 퍼블리싱 (초기 커리어 기초 다짐).",
    keyPoints: [
      "웹 디자인 및 웹 코딩 전 과정 수행을 통한 탄탄한 기초 역량 축적",
      "이러닝 강좌 플레이어 및 온라인 시험 응시 시스템 UI 구축",
      "웹 표준(Web Standards) 태동기 초기 표준화 선제적 연구 및 적용"
    ]
  }
];

// 카테고리 통계 및 메타데이터
const portfolioStats = {
  totalYears: "24+",
  totalProjects: 40,
  accessibilityRate: "100%",
  plPmRatio: "85%",
  categories: [
    { key: "all", name: "전체보기", count: 40 },
    { key: "featured", name: "대표 프로젝트", count: 7 },
    { key: "design-system", name: "디자인시스템·플랫폼", count: 1 },
    { key: "public", name: "공공기관·지자체", count: 12 },
    { key: "finance", name: "금융·보험·핀테크", count: 7 },
    { key: "commerce", name: "이커머스·유통", count: 8 },
    { key: "enterprise", name: "엔터프라이즈·글로벌", count: 9 }
  ]
};

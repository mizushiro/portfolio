/**
 * Firebase Cloud Firestore 연동 설정 파일 (firebase-config.js)
 *
 * [1분 무료 설정 방법]
 * 1. https://console.firebase.google.com/ 접속 -> [프로젝트 추가] 클릭 (예: kjy-portfolio)
 * 2. 프로젝트 메인 화면에서 웹 아이콘(</>) 클릭 -> 앱 닉네임 입력 후 [앱 등록]
 * 3. 화면에 표시되는 firebaseConfig 값을 아래 FIREBASE_CONFIG에 붙여넣기
 * 4. 좌측 메뉴 [빌드] -> [Authentication] -> [시작하기] -> [익명(Anonymous)] 사용 설정 ON
 *    (관리자 공식 답변 배지 사용 시 [Google] 로그인도 함께 ON)
 * 5. 좌측 메뉴 [빌드] -> [Firestore Database] -> [데이터베이스 만들기]
 *    -> 보안 규칙(Rules) 탭에 프로젝트 폴더의 `firestore.rules` 내용을 붙여넣고 [게시] 클릭!
 */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBGDhU0ttfgl_k5hlXe13bsMhoJGVHpSvA",
  authDomain: "portfolio-4834a.firebaseapp.com",
  projectId: "portfolio-4834a",
  storageBucket: "portfolio-4834a.firebasestorage.app",
  messagingSenderId: "607665077824",
  appId: "1:607665077824:web:aecdc5cdc164a27998a9a5"
};

// 포트폴리오 관리자(강지연 퍼블리셔) 이메일 및 마스터 비밀번호
// - 게시판 상단 [🔐 관리자(강지연) 로그인] 클릭 또는 비밀글 비밀번호란에 관리자 비밀번호 입력 시 모든 비밀글 열람·답변·삭제가 가능합니다.
window.PORTFOLIO_ADMIN_EMAIL = "mizushiro@naver.com";
window.PORTFOLIO_ADMIN_PASS = "0000";


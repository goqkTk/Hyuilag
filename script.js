document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const loginStep = document.getElementById('login-step');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  const goLoginBtn = document.getElementById('go-login');
  const goSignupBtn = document.getElementById('go-signup');

  // Login inputs & buttons
  const loginName = document.getElementById('login-name');
  const loginPhone = document.getElementById('login-phone');
  const btnLogin = document.getElementById('btn-login');

  // Complete screen elements
  const completeName = document.getElementById('complete-name');
  const completeTitleText = document.getElementById('complete-title-text');

  // 전화번호 자동 하이픈 (-) 처리
  function formatPhone(value) {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }

  // 로그인 유효성 검사
  function validateLogin() {
    const isNameValid = loginName.value.trim().length > 0;
    const phoneDigits = loginPhone.value.replace(/[^0-9]/g, '');
    const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 11;

    btnLogin.disabled = !(isNameValid && isPhoneValid);
  }

  // 화면 전환 이벤트
  goLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    step1.classList.add('hidden');
    loginStep.classList.remove('hidden');
  });

  goSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginStep.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  // 로그인 입력 이벤트
  loginName.addEventListener('input', validateLogin);

  loginPhone.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
    validateLogin();
  });

  // 로그인 실행
  btnLogin.addEventListener('click', () => {
    const nameVal = loginName.value.trim();
    completeName.textContent = nameVal;
    completeTitleText.textContent = "로그인이 완료됐어요!";

    loginStep.classList.add('hidden');
    step4.classList.remove('hidden');
  });

  // 기존 Step 1 유효성 검사 및 하이픈 자동입력
  const inputPhone = document.getElementById('input-phone');
  if (inputPhone) {
    inputPhone.addEventListener('input', (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }
});
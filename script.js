document.addEventListener('DOMContentLoaded', () => {
  // 1. 요소 선택 (로그인 및 회원가입 스텝)
  const loginStep = document.getElementById('login-step');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  const goLoginBtn = document.getElementById('go-login');
  const goSignupBtn = document.getElementById('go-signup');

  // 로그인 입력 필드 및 버튼
  const loginName = document.getElementById('login-name');
  const loginPhone = document.getElementById('login-phone');
  const btnLogin = document.getElementById('btn-login');

  // Step 1 입력 필드 및 버튼
  const inputName = document.getElementById('input-name');
  const inputPhone = document.getElementById('input-phone');
  const inputBirth = document.getElementById('input-birth');
  const inputLounge = document.getElementById('input-lounge');
  const next1 = document.getElementById('next-1');

  // Step 2, 3, 4 버튼들
  const back2 = document.getElementById('back-2');
  const next2 = document.getElementById('next-2');
  const skip2 = document.getElementById('skip-2');
  const back3 = document.getElementById('back-3');
  const next3 = document.getElementById('next-3');
  const finish = document.getElementById('finish');

  // 약관 동의 관련 요소
  const agreeAll = document.getElementById('agree-all');
  const agreeRequiredList = document.querySelectorAll('.agree-required');
  const agreeMarketing = document.getElementById('agree-marketing');

  // 완료 화면 텍스트 요소
  const completeName = document.getElementById('complete-name');
  const completeTitleText = document.getElementById('complete-title-text');

  // Helper: 전화번호 자동 하이픈 (-)
  function formatPhone(value) {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }

  // Helper: 생년월일 자동 하이픈 (YYYY-MM-DD)
  function formatBirth(value) {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  }

  // -------------------------------------------------------------
  // 로그인 화면 전환 및 이벤트 처리
  // -------------------------------------------------------------
  if (goLoginBtn) {
    goLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      step1.classList.add('hidden');
      loginStep.classList.remove('hidden');
    });
  }

  if (goSignupBtn) {
    goSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginStep.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  // 로그인 유효성 검사
  function validateLogin() {
    const nameValid = loginName.value.trim().length > 0;
    const phoneDigits = loginPhone.value.replace(/[^0-9]/g, '');
    const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 11;

    btnLogin.disabled = !(nameValid && phoneValid);
  }

  loginName.addEventListener('input', validateLogin);
  loginPhone.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
    validateLogin();
  });

  // 로그인 버튼 클릭 시 완료 화면(Step 4)으로 이동
  btnLogin.addEventListener('click', () => {
    const nameVal = loginName.value.trim();
    completeName.textContent = nameVal;
    completeTitleText.textContent = "로그인이 완료됐어요!";

    loginStep.classList.add('hidden');
    step4.classList.remove('hidden');
  });

  // -------------------------------------------------------------
  // 회원가입 Step 1 유효성 검사
  // -------------------------------------------------------------
  function validateStep1() {
    const nameValid = inputName.value.trim().length > 0;
    const phoneDigits = inputPhone.value.replace(/[^0-9]/g, '');
    const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 11;
    const birthDigits = inputBirth.value.replace(/[^0-9]/g, '');
    const birthValid = birthDigits.length === 8;
    const loungeValid = inputLounge.value !== '';

    next1.disabled = !(nameValid && phoneValid && birthValid && loungeValid);
  }

  inputName.addEventListener('input', validateStep1);
  inputPhone.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
    validateStep1();
  });
  inputBirth.addEventListener('input', (e) => {
    e.target.value = formatBirth(e.target.value);
    validateStep1();
  });
  inputLounge.addEventListener('change', validateStep1);

  // 성별 버튼 선택
  const genderBtns = document.querySelectorAll('.gender-btn');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // -------------------------------------------------------------
  // 회원가입 Step 이동 처리
  // -------------------------------------------------------------
  next1.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  back2.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  next2.addEventListener('click', () => {
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
  });

  skip2.addEventListener('click', () => {
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
  });

  back3.addEventListener('click', () => {
    step3.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  // -------------------------------------------------------------
  // Step 3 약관 동의 유효성 검사
  // -------------------------------------------------------------
  agreeAll.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    agreeRequiredList.forEach(cb => cb.checked = isChecked);
    if (agreeMarketing) agreeMarketing.checked = isChecked;
    validateStep3();
  });

  agreeRequiredList.forEach(cb => {
    cb.addEventListener('change', () => {
      validateStep3();
      updateAgreeAllState();
    });
  });

  if (agreeMarketing) {
    agreeMarketing.addEventListener('change', updateAgreeAllState);
  }

  function updateAgreeAllState() {
    const allRequiredChecked = Array.from(agreeRequiredList).every(cb => cb.checked);
    const marketingChecked = agreeMarketing ? agreeMarketing.checked : true;
    agreeAll.checked = allRequiredChecked && marketingChecked;
  }

  function validateStep3() {
    const allRequiredChecked = Array.from(agreeRequiredList).every(cb => cb.checked);
    next3.disabled = !allRequiredChecked;
  }

  next3.addEventListener('click', () => {
    completeName.textContent = inputName.value.trim();
    completeTitleText.textContent = "가입이 완료됐어요!";
    step3.classList.add('hidden');
    step4.classList.remove('hidden');
  });

  finish.addEventListener('click', () => {
    alert('메인 화면으로 이동합니다.');
  });
});
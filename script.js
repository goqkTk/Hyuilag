const state = {
  step: 1,
  gender: 'male',
  trouble: new Set(),
  movement: 'almost-none',
};

const steps = document.querySelectorAll('.step');

function goToStep(n) {
  state.step = n;
  steps.forEach(s => s.classList.toggle('hidden', Number(s.dataset.step) !== n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- Step 1: inputs + live validation ---------------- */

const nameInput = document.getElementById('input-name');
const phoneInput = document.getElementById('input-phone');
const birthInput = document.getElementById('input-birth');
const loungeInput = document.getElementById('input-lounge');
const next1 = document.getElementById('next-1');

function formatPhone(digits) {
  digits = digits.slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

phoneInput.addEventListener('input', () => {
  const digits = phoneInput.value.replace(/\D/g, '');
  phoneInput.value = formatPhone(digits);
  validateStep1();
});

function formatBirth(digits) {
  digits = digits.slice(0, 8);
  if (digits.length < 5) return digits;
  if (digits.length < 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

birthInput.addEventListener('input', () => {
  const digits = birthInput.value.replace(/\D/g, '');
  birthInput.value = formatBirth(digits);
  validateStep1();
});

nameInput.addEventListener('input', validateStep1);
loungeInput.addEventListener('change', validateStep1);

function isValidPhone(value) {
  return /^01[016789]-\d{3,4}-\d{4}$/.test(value);
}

function isValidBirth(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) return false;
  return y >= 1900 && y <= new Date().getFullYear();
}

function showError(id, show) {
  document.getElementById(id).hidden = !show;
}

function validateStep1() {
  const nameOk = nameInput.value.trim().length > 0;
  const phoneOk = isValidPhone(phoneInput.value.trim());
  const birthOk = isValidBirth(birthInput.value.trim());
  const loungeOk = !!loungeInput.value;

  showError('error-name', nameInput.value.length > 0 && !nameOk);
  showError('error-phone', phoneInput.value.length > 0 && !phoneOk);
  showError('error-birth', birthInput.value.length > 0 && !birthOk);

  next1.disabled = !(nameOk && phoneOk && birthOk && loungeOk);
  return next1.disabled === false;
}

next1.addEventListener('click', () => {
  if (validateStep1()) goToStep(2);
});

/* ---------------- Gender ---------------- */

document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
    state.gender = btn.dataset.gender;
  });
});

/* ---------------- Step 2: trouble areas & dashed input support ---------------- */

const heightInput = document.getElementById('input-height');
const weightInput = document.getElementById('input-weight');

[heightInput, weightInput].forEach(input => {
  input.addEventListener('input', (e) => {
    const parent = e.target.closest('.text-input.dashed');
    if (parent) {
      if (e.target.value.trim() !== '') {
        parent.classList.add('filled');
      } else {
        parent.classList.remove('filled');
      }
    }
  });
});

document.querySelectorAll('#trouble-select .pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const value = pill.dataset.value;
    if (value === 'none') {
      document.querySelectorAll('#trouble-select .pill').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      state.trouble.clear();
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      state.trouble.add('none');
      return;
    }
    const noneBtn = document.querySelector('#trouble-select .pill[data-value="none"]');
    noneBtn.classList.remove('active');
    noneBtn.setAttribute('aria-pressed', 'false');
    state.trouble.delete('none');

    pill.classList.toggle('active');
    const isActive = pill.classList.contains('active');
    pill.setAttribute('aria-pressed', String(isActive));
    if (isActive) {
      state.trouble.add(value);
    } else {
      state.trouble.delete(value);
    }
  });
});

/* ---------------- Step 2: movement experience ---------------- */

document.querySelectorAll('#movement-select .option-row').forEach(row => {
  row.addEventListener('click', () => {
    document.querySelectorAll('#movement-select .option-row').forEach(r => {
      r.classList.remove('active');
      r.setAttribute('aria-checked', 'false');
      r.querySelector('.radio-mark, .radio-dot').outerHTML = '<span class="radio-dot" aria-hidden="true"></span>';
    });
    row.classList.add('active');
    row.setAttribute('aria-checked', 'true');
    row.querySelector('.radio-dot').outerHTML = '<span class="radio-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>';
    state.movement = row.dataset.value;
  });
});

document.getElementById('back-2').addEventListener('click', () => goToStep(1));
document.getElementById('next-2').addEventListener('click', () => goToStep(3));
document.getElementById('skip-2').addEventListener('click', () => goToStep(3));

/* ---------------- Step 3: agreements ---------------- */

const allAgree = document.getElementById('agree-all');
const requiredBoxes = document.querySelectorAll('.agree-required');
const marketingBox = document.getElementById('agree-marketing');
const next3 = document.getElementById('next-3');

function updateNext3() {
  const allRequiredChecked = Array.from(requiredBoxes).every(b => b.checked);
  next3.disabled = !allRequiredChecked;
}

allAgree.addEventListener('change', () => {
  requiredBoxes.forEach(b => (b.checked = allAgree.checked));
  marketingBox.checked = allAgree.checked;
  updateNext3();
});

[...requiredBoxes, marketingBox].forEach(box => {
  box.addEventListener('change', () => {
    const allChecked = Array.from(requiredBoxes).every(b => b.checked) && marketingBox.checked;
    allAgree.checked = allChecked;
    updateNext3();
  });
});

document.getElementById('back-3').addEventListener('click', () => goToStep(2));
next3.addEventListener('click', () => {
  if (next3.disabled) return;
  const name = nameInput.value.trim() || 'OOO';
  document.getElementById('complete-name').textContent = name;
  goToStep(4);
});

document.getElementById('finish').addEventListener('click', () => {
  alert('첫 체크 페이지로 이동합니다. (데모)');
});
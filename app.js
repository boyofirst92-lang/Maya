const steps = [...document.querySelectorAll('.step')];
const progress = document.querySelector('.progress-fill');
const stepCount = document.querySelector('[data-step-count]');
const stepOrder = ['welcome', 'loan', 'details', 'login', 'otp', 'success'];
let currentStep = 'welcome';

const page = document.querySelector('[data-page]')?.dataset.page;

function requiredFields(form, errorSelector, message) {
  const fields = [...form.querySelectorAll('input[required], select[required]')];
  const missing = fields.filter((field) => !field.value.trim());
  fields.forEach((field) => field.classList.toggle('field-error', !field.value.trim()));
  const error = document.querySelector(errorSelector);
  if (error) error.textContent = missing.length ? message : '';
  if (missing.length) missing[0].focus();
  return missing.length === 0;
}

document.querySelectorAll('.details-form input, .details-form select, .login-form input').forEach((field) => {
  field.addEventListener('input', () => field.classList.remove('field-error'));
  field.addEventListener('change', () => field.classList.remove('field-error'));
});

if (page === 'login') {
  const form = document.querySelector('.login-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (requiredFields(form, '[data-login-error]', 'Enter your phone number and password before continuing.')) {
      window.location.href = 'otp.html';
    }
  });

  document.querySelector('.eye-button').addEventListener('click', (event) => {
    const input = document.querySelector('#password');
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    event.currentTarget.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
  });
}

if (page === 'otp') {
  const digits = [...document.querySelectorAll('.otp-fields input')];
  digits.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && digits[index + 1]) digits[index + 1].focus();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && digits[index - 1]) digits[index - 1].focus();
    });
  });
  document.querySelector('.otp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = digits.every((input) => /^\d$/.test(input.value));
    document.querySelector('[data-otp-error]').textContent = valid ? '' : 'Enter all 6 digits of your one-time PIN.';
    if (valid) window.location.href = 'device.html';
  });
  document.querySelector('[data-resend]').addEventListener('click', (event) => {
    event.currentTarget.textContent = 'OTP resent';
    window.setTimeout(() => { event.currentTarget.textContent = 'Resend OTP'; }, 3000);
  });
}

if (page === 'device') {
  const form = document.querySelector('.details-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (requiredFields(form, '[data-form-error]', 'Please complete all required fields before continuing.')) {
      window.location.href = 'success.html';
    }
  });
}

if (page === 'success') {
  document.querySelector('#reference-number').textContent = `MAYA-${Math.floor(100000 + Math.random() * 900000)}`;
}

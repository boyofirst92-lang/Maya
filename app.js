const steps = [...document.querySelectorAll('.step')];
const progress = document.querySelector('.progress-fill');
const stepCount = document.querySelector('[data-step-count]');
const stepOrder = ['welcome', 'loan', 'details', 'login', 'otp', 'success'];
let currentStep = 'welcome';

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 2,
});

const amountInput = document.querySelector('#loan-amount');
const termInput = document.querySelector('#loan-term');

function showStep(name) {
  const target = document.querySelector(`[data-step="${name}"]`);
  if (!target) return;

  currentStep = name;
  steps.forEach((step) => { step.hidden = step !== target; });

  const index = stepOrder.indexOf(name);
  progress.style.width = `${Math.max(8, (index / (stepOrder.length - 2)) * 100)}%`;
  stepCount.textContent = name === 'success' ? 'Application complete' : `Step ${index + 1} of 5`;
  target.querySelector('input, select, button:not(.nav-back)')?.focus();
}

function updateLoanEstimate() {
  const amount = Number(amountInput.value);
  const months = Number(termInput.value);
  const total = amount * (1 + (0.05 * months / 12));

  document.querySelector('#amount-value').textContent = peso.format(amount);
  document.querySelector('#term-value').textContent = months;
  document.querySelector('#monthly-payment').textContent = peso.format(total / months);
}

function markRequiredFields(fields, messageElement, message) {
  const missing = fields.filter((field) => !field.value.trim());
  fields.forEach((field) => field.classList.toggle('field-error', !field.value.trim()));

  if (messageElement) messageElement.textContent = missing.length ? message : '';
  if (missing.length) missing[0].focus();
  return missing.length === 0;
}

function validateDetails() {
  const fields = [
    '#first-name',
    '#last-name',
    '#birth-date',
    '#loan-purpose',
    '#monthly-income',
  ].map((selector) => document.querySelector(selector));

  return markRequiredFields(
    fields,
    document.querySelector('[data-form-error]'),
    'Please complete all required fields before continuing.',
  );
}

function validateLogin() {
  const fields = [
    document.querySelector('#login-phone'),
    document.querySelector('#password'),
  ];

  return markRequiredFields(
    fields,
    document.querySelector('[data-login-error]'),
    'Enter your phone number and password before continuing.',
  );
}

amountInput.addEventListener('input', updateLoanEstimate);
termInput.addEventListener('input', updateLoanEstimate);

// Only advance from pages after their required fields have been completed.
document.querySelectorAll('[data-next]').forEach((button) => {
  button.addEventListener('click', () => {
    const current = button.closest('.step')?.dataset.step;
    if (current === 'details' && !validateDetails()) return;
    showStep(button.dataset.next);
  });
});

document.querySelector('.details-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (validateDetails()) showStep('login');
});

document.querySelector('[data-login-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  if (validateLogin()) showStep('otp');
});

document.querySelectorAll('.details-form input, .details-form select, [data-login-form] input').forEach((field) => {
  field.addEventListener('input', () => field.classList.remove('field-error'));
  field.addEventListener('change', () => field.classList.remove('field-error'));
});

document.querySelectorAll('.otp-fields input').forEach((input, index, fields) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    if (input.value && fields[index + 1]) fields[index + 1].focus();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && !input.value && fields[index - 1]) fields[index - 1].focus();
  });
});

document.querySelector('.otp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const digits = [...document.querySelectorAll('.otp-fields input')];
  const valid = digits.every((input) => /^\d$/.test(input.value));
  document.querySelector('[data-otp-error]').textContent = valid ? '' : 'Enter all 6 digits of your one-time PIN.';

  if (valid) {
    document.querySelector('#reference-number').textContent = `MAYA-${Math.floor(100000 + Math.random() * 900000)}`;
    showStep('success');
  }
});

document.querySelector('[data-resend]').addEventListener('click', (event) => {
  event.currentTarget.textContent = 'OTP resent';
  setTimeout(() => { event.currentTarget.textContent = 'Resend OTP'; }, 3000);
});

document.querySelector('.eye-button').addEventListener('click', (event) => {
  const input = document.querySelector('#password');
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  event.currentTarget.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
});

document.querySelector('.nav-back').addEventListener('click', () => {
  const index = stepOrder.indexOf(currentStep);
  if (index > 0) showStep(stepOrder[index - 1]);
});

updateLoanEstimate();
showStep('welcome');

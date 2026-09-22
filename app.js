const steps = [...document.querySelectorAll('.step')];
const progress = document.querySelector('.progress-fill');
const stepCount = document.querySelector('[data-step-count]');
const stepOrder = ['login', 'welcome', 'loan', 'details', 'otp', 'success'];
let currentStep = 'login';
const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });
const amountInput = document.querySelector('#loan-amount');
const termInput = document.querySelector('#loan-term');

function showStep(name) {
  const target = document.querySelector(`[data-step="${name}"]`);
  if (!target) return;
  currentStep = name;
  steps.forEach((step) => { step.hidden = step !== target; });
  const index = stepOrder.indexOf(name);
  progress.style.width = `${Math.max(8, (index / (stepOrder.length - 2)) * 100)}%`;
  stepCount.textContent = name === 'success' ? 'Application complete' : name === 'login' ? 'Welcome' : `Step ${index} of 4`;
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

function validateDetails() {
  const fields = ['#first-name', '#last-name', '#birth-date', '#loan-purpose', '#monthly-income'].map((selector) => document.querySelector(selector));
  const valid = fields.every((field) => field.value.trim());
  fields.forEach((field) => field.classList.toggle('field-error', !field.value.trim()));
  document.querySelector('[data-form-error]').textContent = valid ? '' : 'Please complete all required fields before continuing.';
  return valid;
}

amountInput.addEventListener('input', updateLoanEstimate);
termInput.addEventListener('input', updateLoanEstimate);
document.querySelector('[data-login-form]').addEventListener('submit', (event) => { event.preventDefault(); showStep('welcome'); });
document.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => showStep(button.dataset.next)));
document.querySelector('.details-form').addEventListener('submit', (event) => { event.preventDefault(); if (validateDetails()) showStep('otp'); });

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
  if (valid) { document.querySelector('#reference-number').textContent = `MAYA-${Math.floor(100000 + Math.random() * 900000)}`; showStep('success'); }
});

document.querySelector('[data-resend]').addEventListener('click', (event) => { event.currentTarget.textContent = 'OTP resent'; setTimeout(() => { event.currentTarget.textContent = 'Resend OTP'; }, 3000); });
document.querySelector('.eye-button').addEventListener('click', (event) => { const input = document.querySelector('#password'); const visible = input.type === 'text'; input.type = visible ? 'password' : 'text'; event.currentTarget.setAttribute('aria-label', visible ? 'Show password' : 'Hide password'); });
document.querySelector('.nav-back').addEventListener('click', () => { const index = stepOrder.indexOf(currentStep); if (index > 0) showStep(stepOrder[index - 1]); });
updateLoanEstimate();

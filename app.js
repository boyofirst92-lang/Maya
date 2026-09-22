const steps = [...document.querySelectorAll('.step')];
const progress = document.querySelector('.progress-fill');
const stepCount = document.querySelector('[data-step-count]');
const stepOrder = ['welcome', 'loan', 'details', 'phone', 'otp', 'verified', 'success'];

function showStep(name) {
  steps.forEach((step) => { step.hidden = step.dataset.step !== name; });
  const index = stepOrder.indexOf(name);
  const progressIndex = Math.min(index, 5);
  progress.style.width = `${Math.max(8, (progressIndex / 5) * 100)}%`;
  stepCount.textContent = name === 'success' ? 'Application complete' : `Step ${Math.min(index + 1, 5)} of 5`;
  const active = document.querySelector(`[data-step="${name}"]`);
  active?.querySelector('input, select, button:not(.back-button)')?.focus();
}

function goTo(button, next) {
  const current = button.closest('.step')?.dataset.step;
  if (current === 'details' && !validateDetails()) return;
  if (current === 'phone' && !validatePhone()) return;
  showStep(next);
}

document.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => goTo(button, button.dataset.next)));
document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(button.dataset.back)));

const amountInput = document.querySelector('#loan-amount');
const amountValue = document.querySelector('#amount-value');
const termInput = document.querySelector('#loan-term');
const monthlyPayment = document.querySelector('#monthly-payment');
const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });
function updateLoanEstimate() {
  const amount = Number(amountInput.value);
  const months = Number(termInput.value);
  const total = amount * (1 + (0.05 * months / 12));
  amountValue.textContent = peso.format(amount);
  monthlyPayment.textContent = peso.format(total / months);
  amountInput.style.setProperty('--range-progress', `${((amount - 10000) / 490000) * 100}%`);
}
amountInput.addEventListener('input', updateLoanEstimate);
termInput.addEventListener('change', updateLoanEstimate);
updateLoanEstimate();

function validateDetails() {
  const required = ['#first-name', '#last-name', '#birth-date', '#loan-purpose', '#monthly-income'];
  const missing = required.some((selector) => !document.querySelector(selector).value.trim());
  const error = document.querySelector('[data-form-error]');
  error.textContent = missing ? 'Please complete all fields before continuing.' : '';
  required.forEach((selector) => document.querySelector(selector).classList.toggle('field-error', !document.querySelector(selector).value.trim()));
  return !missing;
}
function validatePhone() {
  const input = document.querySelector('#mobile-number');
  const valid = input.value.replace(/\D/g, '').length === 10;
  document.querySelector('[data-phone-error]').textContent = valid ? '' : 'Enter a valid 10-digit Philippine mobile number.';
  input.classList.toggle('field-error', !valid);
  return valid;
}

document.querySelectorAll('.otp-fields input').forEach((input, index, fields) => input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 1);
  if (input.value && fields[index + 1]) fields[index + 1].focus();
}));
document.querySelector('[data-finish]').addEventListener('click', () => {
  const digits = [...document.querySelectorAll('.otp-fields input')];
  const valid = digits.every((input) => input.value);
  document.querySelector('[data-otp-error]').textContent = valid ? '' : 'Enter all 6 digits of your one-time PIN.';
  if (valid) showStep('verified');
});
document.querySelector('[data-resend]').addEventListener('click', (event) => {
  document.querySelector('[data-resend-status]').textContent = ' PIN resent.';
  event.currentTarget.disabled = true;
  setTimeout(() => { event.currentTarget.disabled = false; document.querySelector('[data-resend-status]').textContent = ''; }, 3000);
});
document.querySelector('#reference-number').textContent = Math.floor(100000 + Math.random() * 900000);

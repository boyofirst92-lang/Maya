const authShell = document.querySelector('#auth-shell');
const appShell = document.querySelector('#app-shell');
const authSteps = document.querySelectorAll('.auth-step');
const progressFill = document.querySelector('.progress-fill');
const phoneInput = document.querySelector('#login-phone');
const phoneEnding = document.querySelector('[data-phone-ending]');

function showAuthStep(stepName) {
  authSteps.forEach((step) => { step.hidden = step.dataset.step !== stepName; });
  const stepIndex = ['welcome', 'phone', 'password', 'otp', 'success'].indexOf(stepName);
  progressFill.style.width = `${Math.max(12, stepIndex * 25)}%`;
}

document.querySelectorAll('[data-next]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.next === 'password' && phoneInput.value.replace(/\D/g, '').length < 9) {
      phoneInput.classList.add('field-error');
      phoneInput.focus();
      return;
    }
    phoneInput.classList.remove('field-error');
    showAuthStep(button.dataset.next);
    if (button.dataset.next === 'otp') phoneEnding.textContent = phoneInput.value.slice(-4) || '••••';
  });
});

document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showAuthStep(button.dataset.back)));
document.querySelector('[data-toggle-password]').addEventListener('click', (event) => {
  const input = document.querySelector('#login-password');
  input.type = input.type === 'password' ? 'text' : 'password';
  event.currentTarget.textContent = input.type === 'password' ? 'Show' : 'Hide';
});
document.querySelectorAll('.otp-fields input').forEach((input, index, fields) => input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '');
  if (input.value && fields[index + 1]) fields[index + 1].focus();
}));
document.querySelector('[data-finish]').addEventListener('click', () => {
  showAuthStep('success');
  setTimeout(() => { authShell.hidden = true; appShell.hidden = false; }, 1100);
});
document.querySelector('[data-resend]').addEventListener('click', (event) => {
  document.querySelector('[data-resend-status]').textContent = ' Code resent.';
  event.currentTarget.disabled = true;
  setTimeout(() => { event.currentTarget.disabled = false; }, 3000);
});
document.querySelectorAll('[data-demo-message]').forEach((button) => button.addEventListener('click', () => {
  const note = document.querySelector('.demo-note');
  note.textContent = 'This is a demo flow. Sign up and recovery are not connected.';
  setTimeout(() => { note.textContent = 'Demo experience · No information is sent or saved'; }, 2600);
}));

const backdrop = document.querySelector('[data-modal-backdrop]');
const modalTitle = document.querySelector('#modal-title');
const modalIcon = document.querySelector('.modal-icon');
const recipientField = document.querySelector('#recipient');
const amountField = document.querySelector('#amount');

const modalContent = {
  send: { title: 'Send money', icon: '↗', description: 'Move money instantly to another Maya user or a bank account.', recipient: 'Mobile number or bank account' },
  add: { title: 'Add money', icon: '＋', description: 'Top up your wallet from a linked bank or card.', recipient: 'Choose a source' },
  scan: { title: 'Scan to pay', icon: '⌗', description: 'Scan a merchant QR code to pay securely with your Maya Wallet.', recipient: 'QR scanner ready' },
  bills: { title: 'Pay bills', icon: '▤', description: 'Pay your bills in a few taps and keep your accounts up to date.', recipient: 'Search biller' }
};

function openModal(type) {
  const content = modalContent[type];
  modalTitle.textContent = content.title;
  modalIcon.textContent = content.icon;
  document.querySelector('.modal-description').textContent = content.description;
  recipientField.placeholder = content.recipient;
  recipientField.value = '';
  amountField.value = '';
  backdrop.hidden = false;
  recipientField.focus();
}

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.modal));
});

document.querySelector('.modal-close').addEventListener('click', () => { backdrop.hidden = true; });
backdrop.addEventListener('click', (event) => { if (event.target === backdrop) backdrop.hidden = true; });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') backdrop.hidden = true; });

document.querySelector('.visibility-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const balance = document.querySelector('.balance-amount');
  const hidden = button.dataset.hidden === 'true';
  balance.textContent = hidden ? balance.dataset.balance : '₱ ••••••';
  button.dataset.hidden = String(!hidden);
  button.setAttribute('aria-label', hidden ? 'Hide balance' : 'Show balance');
});

document.querySelector('[data-confirm]').addEventListener('click', () => {
  const button = document.querySelector('[data-confirm]');
  button.textContent = 'Ready to go ✓';
  button.style.background = '#008b58';
  setTimeout(() => { backdrop.hidden = true; button.innerHTML = 'Continue <span>→</span>'; button.style.background = ''; }, 900);
});
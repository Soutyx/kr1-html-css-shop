// Скрипт отвечает только за ранее добавленные форму и модальное окно.
// FAQ и кнопка «Наверх» работают средствами HTML/CSS.
const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const selectedProductInput = document.getElementById('selected-product');
let lastOrderButton = null;

function clearErrors() {
  orderForm?.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
}

if (orderDialog && orderForm) {
  document.querySelectorAll('[data-open-order]').forEach(button => {
    button.addEventListener('click', () => {
      lastOrderButton = button;
      clearErrors();
      successMessage.hidden = true;
      selectedProductInput.value = button.dataset.product || '';
      document.getElementById('dialog-product').textContent = button.dataset.product || 'Заявка или вопрос о каталоге';
      orderDialog.showModal();
      document.getElementById('order-name').focus();
    });
  });
  document.getElementById('close-order-dialog').addEventListener('click', () => orderDialog.close());
  orderDialog.addEventListener('close', () => lastOrderButton?.focus({ preventScroll: true }));
}

if (orderForm) {
  orderForm.addEventListener('input', event => event.target.removeAttribute('aria-invalid'));
  orderForm.addEventListener('reset', () => {
    clearErrors();
    successMessage.hidden = true;
  });
  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    if (!orderForm.checkValidity()) {
      Array.from(orderForm.elements).forEach(field => {
        if (field.willValidate && !field.checkValidity()) field.setAttribute('aria-invalid', 'true');
      });
      orderForm.reportValidity();
      return;
    }
    orderForm.reset();
    if (orderDialog?.open) orderDialog.close();
    successMessage.hidden = false;
    successMessage.scrollIntoView({ block: 'nearest' });
  });
}

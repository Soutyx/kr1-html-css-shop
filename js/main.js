// Логика формы и модального окна из КР №1.
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

// ПР 15. Типы данных, операторы и функции обработки товара.
function formatPrice(price) {
  return `${price} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  return price - calculateDiscount(price, discountPercent);
}

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }
  return 'Нет в наличии';
}

function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  return `${product.title}: ${formatPrice(finalPrice)} Статус: ${getProductStatus(product)}.`;
}

const hasDiscount = product.discountPercent > 0;
const canOrder = product.isAvailable && product.price > 0;

console.table(product);
console.log('Цена:', formatPrice(product.price));
console.log('Размер скидки:', calculateDiscount(product.price, product.discountPercent));
console.log('Итоговая цена:', calculateFinalPrice(product.price, product.discountPercent));
console.log('Статус:', getProductStatus(product));
console.log('Описание:', createProductSummary(product));
console.log('Есть скидка:', hasDiscount, 'Можно заказать:', canOrder);

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка корзины из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');

    // Отображение товаров в корзине
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
            updateSummary();
            return;
        }

        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Цвет: ${item.color}</p>
                    <p>Размер: ${item.size}</p>
                    <div class="item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="item-quantity">
                    <button class="minus" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="plus" data-index="${index}">+</button>
                </div>
                <div class="item-total">${(item.price * item.quantity).toLocaleString()} ₽</div>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Обработчики для изменения количества
        setupQuantityButtons();
        updateSummary();
    }

    function setupQuantityButtons() {
        document.querySelectorAll('.item-quantity .plus').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                cart[index].quantity += 1;
                saveCart();
            });
        });

        document.querySelectorAll('.item-quantity .minus').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    saveCart();
                }
            });
        });

        document.querySelectorAll('.item-quantity input').forEach((input, index) => {
            input.addEventListener('change', () => {
                const value = parseInt(input.value);
                if (value >= 1) {
                    cart[index].quantity = value;
                    saveCart();
                } else {
                    input.value = cart[index].quantity;
                }
            });
        });

        // Обработчики для удаления товара
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
            });
        });
    }

    // Обновление итоговой информации
    function updateSummary() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal > 30000 ? 2000 : 0;
        const delivery = subtotal > 50000 ? 0 : 300;
        const total = subtotal - discount + delivery;

        if (cartSummaryContainer) {
            cartSummaryContainer.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `${subtotal.toLocaleString()} ₽`;
            cartSummaryContainer.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `-${discount.toLocaleString()} ₽`;
            cartSummaryContainer.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `${delivery.toLocaleString()} ₽`;
            cartSummaryContainer.querySelector('.summary-row.total span:last-child').textContent = `${total.toLocaleString()} ₽`;
            cartSummaryContainer.querySelector('.summary-row:nth-child(1) span:first-child').textContent = `Товары (${totalItems})`;
        }
    }

    // Сохранение корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    // Обновление счетчика корзины в шапке
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    // Обработчик для промокода
    const promoCodeBtn = document.querySelector('.promo-code button');
    if (promoCodeBtn) {
        promoCodeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const promoInput = document.querySelector('.promo-code input');
            if (promoInput.value === 'DISCOUNT10') {
                alert('Промокод применен! Скидка 10%');
            } else {
                alert('Промокод недействителен');
            }
        });
    }

    // Обработчик для оформления заказа
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Ваша корзина пуста');
                return;
            }
            alert('Заказ оформлен! Спасибо за покупку.');
            cart = [];
            saveCart();
        });
    }

    // Инициализация корзины
    renderCart();
});
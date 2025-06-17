// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Добавление товара в корзину
function addToCart(productId, name, price, image, color, size, quantity = 1) {
    const existingItem = cart.find(item => 
        item.id === productId && item.color === color && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name,
            price,
            image,
            color,
            size,
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Товар добавлен в корзину');
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Загрузка популярных товаров
function loadPopularProducts() {
    const products = [
        {
            id: 1,
            name: 'Мужской костюм "Престиж"',
            price: 24990,
            oldPrice: 29990,
            image: 'images/муж (1).jpg'
        },
        {
            id: 2,
            name: 'Женский костюм "Элегант"',
            price: 21990,
            oldPrice: 25990,
            image: 'images/жен.jpg'
        },
        {
            id: 3,
            name: 'Мужская рубашка "Офис"',
            price: 5990,
            image: 'images/руб.jpg'
        },
        {
            id: 4,
            name: 'Галстук "Деловой стиль"',
            price: 2990,
            image: 'images/галс.jpg'
        }
    ];

    const grid = document.querySelector('.popular-products .products-grid');
    if (grid) {
        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${product.price.toLocaleString()} ₽</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">В корзину</button>
                        <button class="wishlist">♡</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Обработчики для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseInt(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');
                
                addToCart(productId, name, price, image, 'default', 'M');
            });
        });
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadPopularProducts();
    // Переключение табов
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            const container = tab.closest('.auth-tabs') || tab.closest('.tabs-header');
            
            // Активируем выбранную вкладку
            container.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            // Показываем соответствующее содержимое
            const contentId = tabId === 'login' ? 'login' : 
                            tabId === 'register' ? 'register' : 
                            tabId === 'description' ? 'description' :
                            tabId === 'specs' ? 'specs' : 'reviews';
            
            const contents = container.nextElementSibling || container.parentElement.querySelector('.tabs-content');
            contents.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            contents.querySelector(`#${contentId}`).classList.add('active');
        });
    });

    // Выбор цвета на странице товара
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });

    // Выбор размера на странице товара
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });

    // Управление количеством товара
    document.querySelectorAll('.quantity .plus').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity .minus').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    // Добавление товара в корзину со страницы товара
    const addToCartBtn = document.querySelector('.product-info .add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = window.location.pathname.split('/').pop().replace('.html', '');
            const name = document.querySelector('.product-info h1').textContent;
            const price = parseInt(document.querySelector('.current').textContent.replace(/\D/g, ''));
            const image = document.querySelector('.main-image img').src;
            const color = document.querySelector('.color-option.active').getAttribute('data-color');
            const size = document.querySelector('.size-option.active').textContent;
            const quantity = parseInt(document.querySelector('.product-info .quantity input').value);
            
            addToCart(productId, name, price, image, color, size, quantity);
        });
    }
});

// Стили для уведомлений
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--accent-color);
    color: white;
    padding: 15px 25px;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1000;
}

.notification.show {
    opacity: 1;
}
`;
document.head.appendChild(style);
// Отложенная загрузка не критичных ресурсов
window.addEventListener('load', function() {
  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
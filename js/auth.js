document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации пользователя
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'account.html';
    }

    // Форма входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Простая проверка (в реальном приложении нужно обращаться к серверу)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                showNotification('Вход выполнен успешно');
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            } else {
                showNotification('Неверный email или пароль');
            }
        });
    }

    // Форма регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (password !== confirm) {
                showNotification('Пароли не совпадают');
                return;
            }
            
            // Проверка существования пользователя
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showNotification('Пользователь с таким email уже существует');
                return;
            }
            
            // Создание нового пользователя
            const newUser = {
                id: Date.now(),
                name,
                email,
                phone,
                password,
                orders: []
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('user', JSON.stringify(newUser));
            
            showNotification('Регистрация прошла успешно');
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1000);
        });
    }

    // Выход из системы
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
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
});
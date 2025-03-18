const mobileMenuIcon = document.getElementById('mobileMenuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('header');

let isAnimating = false;
let lastScroll = 0;

// Функция для открытия/закрытия мобильного меню
function toggleMobileMenu() {
    if (isAnimating) return; // Предотвращаем множественные клики во время анимации
    isAnimating = true;

    const isOpen = mobileMenu.classList.contains('open');
    if (!isOpen) {
        mobileMenu.classList.add('open');
        mobileMenuIcon.innerHTML = '✕';
    } else {
        mobileMenu.classList.remove('open');
        mobileMenuIcon.innerHTML = '☰';
    }

    // Завершаем анимацию через 300 мс (время анимации)
    setTimeout(() => {
        isAnimating = false;
    }, 300);
}

// Закрытие меню при клике вне его области
function closeMenuOnClickOutside(e) {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== mobileMenuIcon) {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenu.classList.remove('open');
        mobileMenuIcon.innerHTML = '☰';

        // Завершаем анимацию через 300 мс
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
}

// Закрытие меню при свайпе вправо
let touchStartX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchEndX - touchStartX;

    if (mobileMenu.classList.contains('open') && diffX > 50) {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenu.classList.remove('open');
        mobileMenuIcon.innerHTML = '☰';

        // Завершаем анимацию через 300 мс
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
}

// Обработка прокрутки для header
function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
        // В самом верху страницы header прозрачный
        header.classList.remove('scrolled');
        header.classList.add('visible');
        return;
    }

    if (currentScroll > lastScroll) {
        // Прокрутка вниз — скрываем header
        header.classList.remove('visible');
        header.classList.add('scrolled');
    } else {
        // Прокрутка вверх — показываем header
        header.classList.remove('scrolled');
        header.classList.add('visible');
    }

    lastScroll = currentScroll;
}

// Инициализация всех обработчиков событий
function initEventListeners() {
    // Открытие/закрытие мобильного меню
    mobileMenuIcon.addEventListener('click', toggleMobileMenu);

    // Закрытие меню при клике вне его области
    document.addEventListener('click', closeMenuOnClickOutside);

    // Закрытие меню при свайпе вправо
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Обработка прокрутки для header
    window.addEventListener('scroll', handleScroll);
}

// Запуск инициализации
initEventListeners();
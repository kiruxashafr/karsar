const mobileMenuIcon = document.getElementById('mobileMenuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('header');
const overlay = document.getElementById('overlay');

let isAnimating = false;
let lastScroll = 0;

// Функция для открытия/закрытия мобильного меню
function toggleMobileMenu() {
    if (isAnimating) return;
    isAnimating = true;

    const isOpen = mobileMenu.classList.contains('open');
    if (!isOpen) {
        mobileMenu.classList.add('open');
        mobileMenuIcon.innerHTML = '✕';
        overlay.classList.add('active'); // Показываем затемнение
    } else {
        mobileMenu.classList.remove('open');
        mobileMenuIcon.innerHTML = '☰';
        overlay.classList.remove('active'); // Убираем затемнение
    }

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
        overlay.classList.remove('active'); // Убираем затемнение

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
        overlay.classList.remove('active'); // Убираем затемнение

        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
}

// Обработка прокрутки для header
function handleScroll() {
    const currentScroll = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    const heroSectionHeight = heroSection.offsetHeight;

    if (currentScroll >= heroSectionHeight) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (currentScroll <= 0) {
        header.classList.remove('hidden');
        header.classList.add('visible');
    } else if (currentScroll > lastScroll) {
        header.classList.remove('visible');
        header.classList.add('hidden');
    } else if (currentScroll < lastScroll) {
        header.classList.remove('hidden');
        header.classList.add('visible');
    }

    lastScroll = currentScroll;
}

// Инициализация всех обработчиков событий
function initEventListeners() {
    mobileMenuIcon.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll);
}

initEventListeners();
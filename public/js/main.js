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
        overlay.classList.add('active');
    } else {
        mobileMenu.classList.remove('open');
        mobileMenuIcon.innerHTML = '☰';
        overlay.classList.remove('active');
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
        overlay.classList.remove('active');

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
        overlay.classList.remove('active');

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

// Инициализация Яндекс.Карт
function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API не загрузился');
        setTimeout(initYandexMap, 1000);
        return;
    }

    ymaps.ready(() => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Контейнер карты #map не найден');
            return;
        }

        const containerStyle = window.getComputedStyle(mapContainer);
        if (containerStyle.width === '0px' || containerStyle.height === '0px') {
            console.warn('Контейнер карты имеет нулевые размеры, размеры заданы принудительно');
            mapContainer.style.width = '100%';
            mapContainer.style.height = '350px';
        }

        const map = new ymaps.Map('map', {
            center: [52.968543, 36.069247],
            zoom: 10,
            controls: ['zoomControl']
        });

        const placemark = new ymaps.Placemark([52.968543, 36.069247], {
            hintContent: 'д. Жилина',
            balloonContent: 'Орловская обл., д. Жилина'
        });

        map.geoObjects.add(placemark);
        map.container.fitToViewport();

        window.addEventListener('resize', () => {
            map.container.fitToViewport();
        });
    });
}

// Загрузка скрипта Яндекс.Карт
function loadYandexMapScript(callback) {
    if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        callback();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=41fffe00-4ed7-4819-a155-6e39246723b8&lang=ru_RU';
    script.async = true;
    script.onload = callback;
    script.onerror = () => console.error('Ошибка загрузки Яндекс.Карт');
    document.body.appendChild(script);
}

// Stats animation
let hasAnimated = false;
const statsSection = document.querySelector('.stats-section');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateNumbers();
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            number.textContent = Math.round(current);
        }, 10);
    });
}

// Анимация для overview и quality секций
const sections = document.querySelectorAll('.overview-section, .quality-section');
const options = {
    root: null,
    threshold: 0.2
};
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, options);
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Инициализация карты с IntersectionObserver
let mapInitialized = false;
const footer = document.querySelector('.footer');
const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !mapInitialized) {
            mapInitialized = true;
            loadYandexMapScript(initYandexMap);
            mapObserver.unobserve(footer);
        }
    });
}, { threshold: 0.1 });

if (footer) {
    mapObserver.observe(footer);
}

// Инициализация всех обработчиков событий
function initEventListeners() {
    mobileMenuIcon.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll);

    if (header) {
        header.classList.add('visible');
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
});
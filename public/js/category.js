const mobileMenuIcon = document.getElementById('mobileMenuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

let isAnimating = false;

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

// Инициализация всех обработчиков событий для мобильного меню
function initEventListeners() {
    mobileMenuIcon.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Инициализация Яндекс.Карт
function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API не загрузился');
        return;
    }

    ymaps.ready(() => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Контейнер карты #map не найден');
            return;
        }

        // Убедимся, что контейнер имеет размеры
        const containerStyle = window.getComputedStyle(mapContainer);
        if (containerStyle.width === '0px' || containerStyle.height === '0px') {
            console.warn('Контейнер карты имеет нулевые размеры, пытаемся исправить');
            mapContainer.style.width = '100%';
            mapContainer.style.height = '300px'; // Минимальная высота по умолчанию
        }

        const map = new ymaps.Map('map', {
            center: [52.968543, 36.069247], // Координаты Жилина, Орловская область
            zoom: 10,
            controls: ['zoomControl']
        });

        const placemark = new ymaps.Placemark([52.968543, 36.069247], {
            hintContent: 'д. Жилина',
            balloonContent: 'Орловская обл., д. Жилина'
        });

        map.geoObjects.add(placemark);

        // Адаптация карты к контейнеру
        map.container.fitToViewport();

        // Обновление карты при изменении размера окна
        window.addEventListener('resize', () => {
            map.container.fitToViewport();
        });
    });
}

// Загрузка скрипта Яндекс.Карт
function loadYandexMapScript() {
    if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        // Скрипт уже загружен, инициализируем карту
        initYandexMap();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=41fffe00-4ed7-4819-a155-6e39246723b8&lang=ru_RU';
    script.async = true;
    script.onload = initYandexMap; // Инициализация после загрузки скрипта
    script.onerror = () => console.error('Ошибка загрузки Яндекс.Карт');
    document.body.appendChild(script);
}

// Запуск всех функций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadYandexMapScript();
});
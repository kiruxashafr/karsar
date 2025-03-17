// Vue компонент для header
Vue.component('app-header', {
    template: `
        <header :class="{ scrolled: isScrolled }">
            <div class="logo">
                <img src="assets/logo.png" alt="Логотип">
                <span>KAR-SAR</span>
            </div>
            <nav>
                <a href="#">Каталог</a>
                <a href="#">О нас</a>
                <a href="#">Покупателю</a>
                <a href="#">Контакты</a>
            </nav>
            <div class="phone">
                <a href="tel:+79255355278">+7 (925) 535-52-78</a>
            </div>
            <button class="menu-btn" @click="toggleMenu">&#9776;</button>
        </header>
    `,
    data() {
        return {
            isScrolled: false,
            lastScroll: 0
        };
    },
    methods: {
        toggleMenu() {
            this.$emit('toggle-menu');
        },
        handleScroll() {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                this.isScrolled = true;
            } else {
                this.isScrolled = false;
            }
            this.lastScroll = currentScroll;
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }
});

// Vue компонент для мобильного меню
Vue.component('mobile-menu', {
    props: ['isOpen'],
    template: `
        <div class="mobile-menu" :class="{ active: isOpen }">
            <div class="mobile-phone">
                <img src="assets/phone-icon.png" alt="Телефон">
                <a href="tel:+79255355278">+7 (925) 535-52-78</a>
            </div>
            <nav>
                <a href="#">Каталог <span>&gt;</span></a>
                <a href="#">О нас</a>
                <a href="#">Покупателю</a>
                <a href="#">Контакты</a>
            </nav>
        </div>
    `
});

// Основное Vue приложение
new Vue({
    el: '#app',
    data: {
        menuOpen: false
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        }
    }
});
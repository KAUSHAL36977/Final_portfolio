// ===== UI-SYSTEM.JS =====
// DOM utilities. Component logic. Clean helpers.

class UISystem {
    static createElement(tag, classes = '', html = '') {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (html) el.innerHTML = html;
        return el;
    }
    
    static addClasses(el, classes) {
        el.classList.add(...classes.split(' '));
    }
    
    static removeClasses(el, classes) {
        el.classList.remove(...classes.split(' '));
    }
    
    static hasClass(el, className) {
        return el.classList.contains(className);
    }
    
    static setAttributes(el, attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    
    static querySelector(selector) {
        return document.querySelector(selector);
    }
    
    static querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }
    
    static scrollToElement(selector, offset = 0) {
        const el = UISystem.querySelector(selector);
        if (el) {
            gsap.to(window, {
                scrollTo: {
                    y: el,
                    offsetY: offset,
                },
                duration: 1,
                ease: 'power2.inOut',
            });
        }
    }
    
    static setupNavigation() {
        document.querySelectorAll('[data-target]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                UISystem.scrollToElement(`#${targetId}`, 60);
            });
        });
    }
}


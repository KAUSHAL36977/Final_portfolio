// ===== UI-SYSTEM.JS =====
// DOM utilities. Component logic. Clean helpers.

class UISystem {
    static createElement(tag, classes = '', html = '') {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (html) el.innerHTML = html;
        return el;
    }
    
    static querySelector(selector) {
        return document.querySelector(selector);
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


document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', menu.classList.contains('hidden') ? 'menu' : 'x');
                lucide.createIcons();
            }
        });
    }
});
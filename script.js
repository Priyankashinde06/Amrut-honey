document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const headerMenu = document.querySelector('.header-menu');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        headerMenu.classList.toggle('active');
    });
    
    // Sticky header on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky_head');
        } else {
            header.classList.remove('sticky_head');
        }
    });
});

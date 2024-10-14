import { initializeDokkaiSection } from './dokkai/dokkaiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    navigateToSection('dokkai');
})

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach (link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const section = event.target.getAttribute('data-section');
            navigateToSection(section);
        });
    });
}

function navigateToSection(section) {
    console.log(`Navegando a la sección ${section}`);
    document.querySelectorAll('.main-section').forEach(sec => {
        sec.computedStyleMap.display = 'none';
    });

    switch (section) {
        case 'dokkai':
            document.getElementById('dokkaiSection').style.display = 'grid';
            initializeDokkaiSection();
            break;
        default:
            console.error(`Sección desconocida: ${section}`);
    }
}

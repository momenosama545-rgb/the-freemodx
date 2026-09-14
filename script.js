const grid = document.getElementById('appsGrid');
let currentLang = localStorage.getItem('freemodx_lang') || 'en';

// قاموس الترجمات (اللغتين)
const translations = {
    en: {
        pageTitle: "FreeModX - Pro Modded APKs, Games & Configs",
        home: "Home",
        games: "Games",
        programs: "Programs",
        configs: "Configs",
        heroGamesTitle: "Games catalog",
        heroGamesDesc: "In our catalog you can download the latest versions of popular games for Android",
        btnAllGames: "ALL GAMES",
        heroModsTitle: "MOD Games & Configs",
        heroModsDesc: "Free catalog of the latest MOD versions and ESP config files for high-end gaming",
        btnAllConfigs: "ALL CONFIGS",
        sectionTitleText: "Latest Updates, Mods & Configs",
        filterAll: "All",
        filterGames: "Games",
        filterApps: "Apps",
        filterConfigs: "Configs",
        downloadBtn: "Download",
        footerText: "FreeModX © 2026 - Developed by Mohamed Ahmed Shawky"
    },
    ar: {
        pageTitle: "FreeModX - ألعاب وتطبيقات و ملفات معدلة باحترافية",
        home: "الرئيسية",
        games: "الألعاب",
        programs: "البرامج",
        configs: "الكونفج",
        heroGamesTitle: "دليل الألعاب",
        heroGamesDesc: "في دليلنا يمكنك تحميل أحدث إصدارات الألعاب الشهيرة لأجهزة الأندرويد",
        btnAllGames: "كل الألعاب",
        heroModsTitle: "ألعاب وكونفج معدلة",
        heroModsDesc: "كتالوج مجاني لأحدث النسخ المعدلة وملفات كشف الأماكن للألعاب القوية",
        btnAllConfigs: "كل الكونفج",
        sectionTitleText: "أحدث التحديثات، المودات والملفات",
        filterAll: "الكل",
        filterGames: "ألعاب",
        filterApps: "تطبيقات",
        filterConfigs: "كونفج",
        downloadBtn: "تحميل",
        footerText: "FreeModX © 2026 - تم التطوير بواسطة محمد أحمد شوقي"
    }
};

// تبديل اللغة وتحديث الواجهة
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('freemodx_lang', currentLang);
    applyLanguage();
    renderApps(window.currentFilter || 'all');
}

function applyLanguage() {
    const htmlRoot = document.getElementById('htmlRoot');
    const langBtnText = document.getElementById('langText');
    
    if (currentLang === 'ar') {
        htmlRoot.setAttribute('dir', 'rtl');
        htmlRoot.setAttribute('lang', 'ar');
        langBtnText.textContent = 'EN';
    } else {
        htmlRoot.setAttribute('dir', 'ltr');
        htmlRoot.setAttribute('lang', 'en');
        langBtnText.textContent = 'AR';
    }

    // تطبيق الترجمات على كل عنصر يحمل خاصية data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

function renderApps(filter = 'all') {
    window.currentFilter = filter;
    if (!grid) return;
    grid.innerHTML = '';
    
    if (typeof appsData === 'undefined') return;

    const filteredApps = filter === 'all' 
        ? appsData 
        : appsData.filter(app => app.category === filter);

    const t = translations[currentLang];

    filteredApps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div>
                <div class="app-header">
                    <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'">
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <span class="app-version">v${app.version}</span>
                    </div>
                </div>
                <div class="app-features">${app.features}</div>
                <p class="app-desc">${app.description}</p>
            </div>
            <div class="app-footer">
                <span class="app-size"><i class="fa-solid fa-hard-drive"></i> ${app.size}</span>
                <a href="${app.downloadLink}" class="download-btn" target="_blank"><i class="fa-solid fa-download"></i> ${t.downloadBtn}</a>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.toLowerCase().includes(filter) || (filter === 'all' && (btn.getAttribute('data-i18n') === 'filterAll'))) {
            btn.classList.add('active');
        }
    });
}

function filterCategory(category) {
    renderApps(category);
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    renderApps('all');
});

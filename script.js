// --- script.js ---

// 1. عناصر واجهة المستخدم الأساسية
const appsGrid = document.getElementById('appsGrid');
const darkModeToggle = document.getElementById('darkModeToggle');
const langText = document.getElementById('langText');
const htmlRoot = document.getElementById('htmlRoot');
const filterBtns = document.querySelectorAll('.filter-btn');
const videoModal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');

// 2. نظام الترجمة واللغات
let currentLang = localStorage.getItem('appLang') || 'ar';

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
        appVersion: "Version",
        appSize: "Size",
        btnDownload: "Download",
        btnWatch: "Watch",
        footerText: "FreeModX © 2026 - Developed by Mohamed Ahmed Shawky"
    },
    ar: {
        pageTitle: "FreeModX - أفضل تطبيقات، ألعاب وكونفجات معدلة",
        home: "الرئيسية",
        games: "الألعاب",
        programs: "البرامج",
        configs: "الكونفجات",
        heroGamesTitle: "كتالوج الألعاب",
        heroGamesDesc: "في كتالوجنا يمكنك تحميل أحدث إصدارات الألعاب الشهيرة للأندرويد",
        btnAllGames: "كل الألعاب",
        heroModsTitle: "ألعاب وكونفجات MOD",
        heroModsDesc: "كتالوج مجاني لأحدث إصدارات الـ MOD وملفات الـ ESP للعب الاحترافي",
        btnAllConfigs: "كل الكونفجات",
        sectionTitleText: "أحدث التحديثات، التعديلات والكونفجات",
        filterAll: "الكل",
        filterGames: "الألعاب",
        filterApps: "البرامج",
        filterConfigs: "الكونفجات",
        appVersion: "الإصدار",
        appSize: "الحجم",
        btnDownload: "تحميل",
        btnWatch: "مشاهدة",
        footerText: "FreeModX © 2026 - تطوير محمد أحمد شوقي"
    }
};

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    langText.innerText = lang.toUpperCase();
    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlRoot.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
}

function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    updateLanguage(newLang);
}

// 3. الوضع الليلي (Dark Mode)
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('darkMode', null);
}

const darkModeState = localStorage.getItem('darkMode');
if (darkModeState === 'enabled') {
    enableDarkMode();
}

darkModeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// 4. وظيفة عرض الكروت وإنشاء زر الفيديو بجوار التحميل
function generateAppCard(app) {
    const versionText = translations[currentLang].appVersion;
    const sizeText = translations[currentLang].appSize;
    const downloadText = translations[currentLang].btnDownload;
    const watchText = translations[currentLang].btnWatch;

    // زر الفيديو يظهر فقط لو رابط الفديو مش فارغ
    let videoButtonHtml = '';
    if (app.videoEmbed && app.videoEmbed.trim() !== '') {
        videoButtonHtml = `
            <button class="video-btn" onclick="openVideoModal('${app.videoEmbed}')">
                <i class="fa-brands fa-youtube"></i> <span>${watchText}</span>
            </button>
        `;
    }

    const cardHtml = `
        <div class="app-card" data-category="${app.category}">
            <div class="app-header">
                <img src="${app.icon}" alt="${app.name}" class="app-icon">
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <span class="app-version">${versionText}: ${app.version}</span>
                </div>
            </div>
            <div class="app-features">${app.features}</div>
            <p class="app-desc">${app.description}</p>
            <div class="app-footer">
                <span class="app-size">${sizeText}: ${app.size}</span>
                <div class="card-actions">
                    <a href="${app.downloadLink}" target="_blank" class="download-btn">${downloadText}</a>
                    ${videoButtonHtml}
                </div>
            </div>
        </div>
    `;
    return cardHtml;
}

function displayApps(category = 'all') {
    appsGrid.innerHTML = '';
    let filteredApps = appsData;

    if (category !== 'all') {
        filteredApps = appsData.filter(app => app.category === category);
    }

    const fragment = document.createDocumentFragment();
    filteredApps.forEach(app => {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = generateAppCard(app);
        fragment.appendChild(cardElement.firstElementChild);
    });
    appsGrid.appendChild(fragment);
}

// 5. وظائف الفلترة
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
    });
});

function filterCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(category)) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.navbar .nav-item').forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(category)) {
             link.classList.add('active');
        }
    });

    displayApps(category);
}

// 6. نافذة الفيديو المنبثقة (Video Modal)
function openVideoModal(embedUrl) {
    let finalUrl = embedUrl;
    if (embedUrl.includes('watch?v=')) {
         finalUrl = embedUrl.replace('watch?v=', 'embed/');
    }
    
    modalIframe.src = finalUrl;
    videoModal.style.display = 'flex';
}

function closeVideoModal() {
    videoModal.style.display = 'none';
    modalIframe.src = '';
}

videoModal.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        closeVideoModal();
    }
});

// 7. التشغيل الأولي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
    displayApps('all');
});

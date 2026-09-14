const grid = document.getElementById('appsGrid');
let currentLang = localStorage.getItem('freemodx_lang') || 'en';

// قاموس الترجمات (عربي / إنجليزي)
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
        watchVideo: "Video",
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
        watchVideo: "فيديو",
        footerText: "FreeModX © 2026 - تم التطوير بواسطة محمد أحمد شوقي"
    }
};

// تبديل اللغة
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
        if(langBtnText) langBtnText.textContent = 'EN';
    } else {
        htmlRoot.setAttribute('dir', 'ltr');
        htmlRoot.setAttribute('lang', 'en');
        if(langBtnText) langBtnText.textContent = 'AR';
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

// معالجة روابط يوتيوب والشورتس لتحويلها لروابط تفعيل داخل النافذة
function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    if (url.includes('/shorts/')) {
        const videoId = url.split('/shorts/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
}

// وظائف تشغيل وإغلاق نافذة الفيديو المنبسطة (Modal)
function openVideoModal(url) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    if (modal && iframe) {
        iframe.src = getEmbedUrl(url);
        modal.style.display = 'flex';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
}

// عرض عناصر الألعاب والتطبيقات في شبكة الكروت
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
        
        let videoBtnHtml = '';
        if (app.videoLink && app.videoLink.trim() !== '') {
            videoBtnHtml = `
                <button onclick="openVideoModal('${app.videoLink}')" class="video-btn">
                    <i class="fa-solid fa-play"></i> ${t.watchVideo}
                </button>
            `;
        }

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
            <div>
                <div class="app-footer">
                    <span class="app-size"><i class="fa-solid fa-hard-drive"></i> ${app.size}</span>
                    <div class="card-actions">
                        ${videoBtnHtml}
                        <a href="${app.downloadLink}" class="download-btn" target="_blank"><i class="fa-solid fa-download"></i> ${t.downloadBtn}</a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

function filterCategory(category) {
    renderApps(category);
}

// تنفيذ الأوامر عند اكتمال التحميل
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    renderApps('all');

    // إغلاق نافذة الفيديو عند النقر في المساحة الخارجية
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVideoModal();
        });
    }

    // تفعيل زر الوضع الليلي (Dark Mode)
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            darkModeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }
});

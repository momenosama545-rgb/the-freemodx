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
        watchVideo: "Watch Video",
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
        watchVideo: "شاهد الشرح",
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

// دالة لتحويل رابط يوتيوب العادي أو الشورتس إلى رابط تضمين (Embed)
function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    
    // التعامل مع فيديوهات الشورتس
    if (url.includes('/shorts/')) {
        const videoId = url.split('/shorts/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // التعامل مع روابط يوتيوب العادية
    if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
}

// إنشاء نافذة الفيديو (Modal) في الصفحة تلقائياً لو مش موجودة
function setupVideoModal() {
    if (document.getElementById('videoModal')) return;
    
    const modalHTML = `
        <div id="videoModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
            <div style="position:relative; width:90%; max-width:700px; background:#1e1e1e; padding:20px; border-radius:12px; box-shadow:0 5px 20px rgba(0,0,0,0.5);">
                <button onclick="closeVideoModal()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">&times;</button>
                <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px;">
                    <iframe id="modalIframe" src="" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openVideoModal(url) {
    setupVideoModal();
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    iframe.src = getEmbedUrl(url);
    modal.style.display = 'flex';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
}

// عرض العناصر حسب الفئة
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
        
        // زرار الفيديو لو الرابط موجود
        let videoBtnHtml = '';
        if (app.videoLink && app.videoLink.trim() !== '') {
            videoBtnHtml = `
                <button onclick="openVideoModal('${app.videoLink}')" style="background-color: #e74c3c; color: #fff; border: none; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.2s;">
                    <i class="fa-solid fa-play"></i> ${t.watchVideo}
                </button>
            `;
        }

        card.innerHTML = `
            <div>
                <div class="app-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
                    <img src="${app.icon}" alt="${app.name}" class="app-icon" style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'">
                    <div class="app-info">
                        <h3 style="font-size: 17px; margin-bottom: 4px;">${app.name}</h3>
                        <span class="app-version" style="font-size: 12px; background: var(--border-color); padding: 2px 8px; border-radius: 6px;">v${app.version}</span>
                    </div>
                </div>
                <div class="app-features" style="font-size: 13px; color: var(--primary-orange); font-weight: 600; margin-bottom: 8px;">${app.features}</div>
                <p class="app-desc" style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">${app.description}</p>
            </div>
            <div>
                <div class="app-footer" style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <span class="app-size" style="font-size: 12px; color: var(--text-muted);"><i class="fa-solid fa-hard-drive"></i> ${app.size}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        ${videoBtnHtml}
                        <a href="${app.downloadLink}" class="download-btn" target="_blank" style="background-color: var(--primary-green); color: #fff; text-decoration: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700;"><i class="fa-solid fa-download"></i> ${t.downloadBtn}</a>
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

// تشغيل الأزرار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    renderApps('all');
    setupVideoModal();

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

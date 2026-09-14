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
        watchVideoBtn: "Watch Guide",
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
        watchVideoBtn: "طريقة التشغيل",
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

        // إنشاء زر الفيديو إذا وجد رابط فيديو في الداتا
        let videoButtonHtml = '';
        if (app.videoLink) {
            videoButtonHtml = `
                <button class="video-btn" onclick="openVideoModal('${app.videoLink}')" style="background-color: #e74c3c; color: #fff; border: none; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;">
                    <i class="fa-solid fa-play"></i> ${t.watchVideoBtn}
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
            <div class="app-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span class="app-size"><i class="fa-solid fa-hard-drive"></i> ${app.size}</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    ${videoButtonHtml}
                    <a href="${app.downloadLink}" class="download-btn" target="_blank"><i class="fa-solid fa-download"></i> ${t.downloadBtn}</a>
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

// دالة تحويل رابط يوتيوب العادي أو الشورتس إلى صيغة Embed المشغلة داخل الموقع
function getEmbedUrl(url) {
    if (!url) return '';
    // معالجة روابط يوتيوب العادية والشورتس
    if (url.includes('shorts/')) {
        const parts = url.split('shorts/');
        const videoId = parts[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
}

// إنشاء نافذة منسدلة (Modal) لعرض الفيديو عند الضغط على زر الشرح
function initVideoModal() {
    if (document.getElementById('customVideoModal')) return;

    const modalHTML = `
        <div id="customVideoModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center; padding: 20px;">
            <div style="position:relative; width:100%; max-width:500px; background:#1e1e1e; border-radius:14px; overflow:hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:#111; color:#fff;">
                    <span style="font-weight:700; font-size:15px;"><i class="fa-solid fa-film"></i> طريقة التشغيل والشرح</span>
                    <button onclick="closeVideoModal()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">&times;</button>
                </div>
                <div style="position:relative; width:100%; padding-top:177.77%;"> <!-- مقاس عمودي مناسب لفيديوهات Shorts -->
                    <iframe id="modalVideoIframe" src="" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openVideoModal(url) {
    const modal = document.getElementById('customVideoModal');
    const iframe = document.getElementById('modalVideoIframe');
    if (modal && iframe) {
        iframe.src = getEmbedUrl(url);
        modal.style.display = 'flex';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('customVideoModal');
    const iframe = document.getElementById('modalVideoIframe');
    if (modal && iframe) {
        iframe.src = '';
        modal.style.display = 'none';
    }
}

// إغلاق النافذة عند الضغط خارج إطار الفيديو
window.addEventListener('click', (event) => {
    const modal = document.getElementById('customVideoModal');
    if (event.target === modal) {
        closeVideoModal();
    }
});

// تشغيل الأزرار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    initVideoModal();
    renderApps('all');

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

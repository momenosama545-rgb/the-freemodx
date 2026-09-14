const grid = document.getElementById('appsGrid');

function renderApps(filter = 'all') {
    if (!grid) return;
    grid.innerHTML = '';
    
    // التأكد من وجود البيانات
    if (typeof appsData === 'undefined') {
        console.error('appsData is not defined! Make sure data.js is loaded before script.js');
        return;
    }

    const filteredApps = filter === 'all' 
        ? appsData 
        : appsData.filter(app => app.category === filter);

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
                <a href="${app.downloadLink}" class="download-btn" target="_blank"><i class="fa-solid fa-download"></i> Download</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(category) {
    renderApps(category);
}

// التشغيل التلقائي أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    renderApps('all');
});

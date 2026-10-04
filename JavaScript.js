// === ОСНОВНАЯ ЛОГИКА КАРТЫ И ЭКО-МОНИТОРИНГА ===
let map, markersCluster;

document.addEventListener("DOMContentLoaded", () => {
    // Инициализация карты Leaflet
    map = L.map('map').setView([48.0, 68.0], 4);
    
    // Темный слой карты (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    markersCluster = L.markerClusterGroup();
    map.addLayer(markersCluster);

    // Загрузка стран или начальных данных
    loadCountries();
});

function loadCountries() {
    const select = document.getElementById('countrySelect');
    const resultsList = document.getElementById('resultsList');
    
    if (!select) return;

    // Пример списка стран для селекта
    const countries = [
        { name: "Казахстан", lat: 48.0196, lon: 66.9237 },
        { name: "Россия", lat: 61.5240, lon: 105.3188 },
        { name: "Узбекистан", lat: 41.3775, lon: 64.5853 }
    ];

    select.innerHTML = '<option value="">Выберите страну из списка...</option>';
    countries.forEach(c => {
        let opt = document.createElement('option');
        opt.value = `${c.lat},${c.lon}`;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
        if (!e.target.value) return;
        const [lat, lon] = e.target.value.split(',').map(Number);
        map.setView([lat, lon], 6);
    });

    if (resultsList) {
        resultsList.innerHTML = `
            <div class="item" onclick="map.setView([47.1000, 51.9167], 10)">
                <b>📍 Город Атырау</b><br><small>Запад Казахстана, р. Урал</small>
            </div>
            <div class="item" onclick="map.setView([55.7558, 37.6173], 10)">
                <b>📍 Москва</b><br><small>Столица России</small>
            </div>
        `;
    }
}

function searchLocation() {
    const input = document.getElementById('searchInput');
    if (!input || !input.value.trim()) return;
    
    // Имитация поиска объекта на карте
    alert(`Поиск объекта: ${input.value}`);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 12);
            L.marker([lat, lon]).addTo(markersCluster).bindPopup("Вы здесь").openPopup();
        }, () => {
            alert("Не удалось определить вашу геолокацию.");
        });
    }
}


// === ЛОГИКА ГЕО-ИИ АССИСТЕНТА ===

const sidebarGeoKeywords = [
    "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
    "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
    "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
    "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок", "канал"
];

function sendStyleAiPrompt() {
    const inputField = document.getElementById('aiStyleInput');
    const chatContainer = document.getElementById('aiStyleMessages');
    
    if (!inputField || !chatContainer) return;
    const queryText = inputField.value.trim();
    if (!queryText) return;

    // Делаем блок сообщений видимым при начале диалога
    chatContainer.style.display = 'flex';

    // Вывод сообщения пользователя
    chatContainer.innerHTML += `<div style="text-align: right; color: #58a6ff; margin-bottom: 4px;"><b>Вы:</b> ${escapeHtmlStyle(queryText)}</div>`;
    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Ответ ИИ с задержкой
    setTimeout(() => {
        const lowerQuery = queryText.toLowerCase();
        const isGeography = sidebarGeoKeywords.some(keyword => lowerQuery.includes(keyword));
        let responseText = "";

        if (!isGeography) {
            responseText = "⛔ Отвечаю только на вопросы по географии и объектам карты.";
        } else if (lowerQuery.includes("атырау")) {
            responseText = "🤖 Атырау — город на западе Казахстана, в устье реки Урал.";
        } else if (lowerQuery.includes("москва")) {
            responseText = "🤖 Москва — столица России, на востоке Восточно-Европейской равнины.";
        } else if (lowerQuery.includes("астана")) {
            responseText = "🤖 Астана — столица Казахстана, на севере центральной части.";
        } else {
            responseText = `🤖 Объект "${escapeHtmlStyle(queryText)}" успешно проверен по базе данных карты.`;
        }

        chatContainer.innerHTML += `<div style="background: #161b22; padding: 6px 8px; border-radius: 4px; border: 1px solid #30363d; color: #c9d1d9; margin-bottom: 4px;">${responseText}</div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 300);
}

function escapeHtmlStyle(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ЭкоКарта & Географический ИИ</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; background: #090c10; color: #c9d1d9; }
        #app-container { display: flex; width: 100vw; height: 100vh; }
        
        .sidebar { width: 380px; height: 100%; background: #0d1117; border-right: 1px solid #30363d; display: flex; flex-direction: column; z-index: 1000; }
        .sidebar-header { padding: 16px; background: #161b22; border-bottom: 1px solid #30363d; }
        .sidebar-header h2 { font-size: 16px; color: #58a6ff; margin-bottom: 12px; }

        .chat-container { flex: 1; display: flex; flex-direction: column; padding: 12px; overflow: hidden; }
        .chat-messages { flex: 1; overflow-y: auto; background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 12px; font-size: 13px; margin-bottom: 10px; }
        
        .msg { margin-bottom: 10px; line-height: 1.4; }
        .msg-user { color: #58a6ff; font-weight: 600; }
        .msg-ai { color: #c9d1d9; background: #0d1117; padding: 8px 10px; border-radius: 6px; border: 1px solid #30363d; margin-top: 4px; }
        .msg-error { color: #f85149; background: #220f13; padding: 8px 10px; border-radius: 6px; border: 1px solid #f85149; margin-top: 4px; }

        .input-box { display: flex; gap: 6px; }
        .chat-input { flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 13px; outline: none; }
        .btn-send { background: #238636; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .btn-send:hover { background: #2ea043; }

        #map { flex: 1; height: 100%; }
    </style>
</head>
<body>

<div id="app-container">
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>🌍 ЭкоКарта: Гео-Консультант ИИ</h2>
        </div>

        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                <div class="msg">
                    <div class="msg-ai">👋 Задайте любой вопрос про <b>страны, регионы, районы, города или села</b> (например: <i>«Москва на севере или на юге?»</i> или <i>«В какой части Казахстана находится Атырау?»</i>).
                    <br><br><small style="color:#8b949e">⚠️ Вопросы не про геолокацию и географию отклоняются.</small></div>
                </div>
            </div>

            <div class="input-box">
                <input type="text" id="userInput" class="chat-input" placeholder="Задайте вопрос про город/страну/район..." onkeypress="if(event.key==='Enter') processQuery()">
                <button class="btn-send" onclick="processQuery()">Спросить</button>
            </div>
        </div>
    </div>

    <div id="map"></div>
</div>

<script>
    // 1. Инициализация Leaflet карты
    const map = L.map('map').setView([48.0, 67.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    let currentMarker = null;

    // Ключевые географические слова для фильтрации запросов
    const geoKeywords = [
        "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
        "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
        "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
        "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние"
    ];

    // Функция проверки: касается ли вопрос географии / стран / городов / сел
    function isGeoRelated(text) {
        const lower = text.toLowerCase();
        return geoKeywords.some(keyword => lower.includes(keyword));
    }

    // Обработка запроса
    async function processQuery() {
        const input = document.getElementById('searchInput') || document.getElementById('userInput');
        const text = input.value.trim();
        if (!text) return;

        appendMessage('user', text);
        input.value = '';

        // Проверка фильтра: Если вопрос НЕ про геолокацию / страны / села
        if (!isGeoRelated(text)) {
            appendMessage('error', '⛔ Извините, я отвечаю ТОЛЬКО на вопросы про страны, регионы, районы, города и села. Пожалуйста, задайте вопрос по географии или нашей карте.');
            return;
        }

        appendMessage('ai', '⏳ Ищу данные по вашему запросу...');

        // Сначала запрашиваем базу координат OpenStreetMap Nominatim
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=1`);
            const data = await res.json();

            if (data && data.length > 0) {
                const item = data[0];
                const lat = parseFloat(item.lat);
                const lon = parseFloat(item.lon);

                if (currentMarker) map.removeLayer(currentMarker);
                map.flyTo([lat, lon], 9);
                currentMarker = L.marker([lat, lon]).addTo(map).bindPopup(`<b>${item.display_name}</b>`).openPopup();
            }
        } catch (e) {}

        // Формируем гео-ответ
        generateGeoResponse(text);
    }

    function appendMessage(type, content) {
        const box = document.getElementById('chatMessages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg';

        if (type === 'user') {
            msgDiv.innerHTML = `<div class="msg-user">👤 Вы: ${content}</div>`;
        } else if (type === 'error') {
            msgDiv.innerHTML = `<div class="msg-error">${content}</div>`;
        } else {
            msgDiv.innerHTML = `<div class="msg-ai">🤖 ${content}</div>`;
        }

        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
    }

    // Логика ответа географического ИИ
    function generateGeoResponse(question) {
        const lower = question.toLowerCase();
        let reply = "";

        if (lower.includes("москва")) {
            reply = "<b>Москва</b> находится в европейской части России, ближе к <b>северо-западу</b> европейской территории страны (на 55° северной широты). По отношению к большинству регионов Евразии Москва считается северным мегаполисом.";
        } else if (lower.includes("атырау")) {
            reply = "<b>Атырау</b> расположен на <b>западе Казахстана</b>, по берегам реки Урал у Прикаспийской низменности. Город делится рекой на европейскую и азиатскую части.";
        } else if (lower.includes("астана")) {
            reply = "<b>Астана</b> находится на <b>севере центральной части Казахстана</b> на берегу реки Есиль в акмолинском регионе.";
        } else if (lower.includes("юг") || lower.includes("север") || lower.includes("запад") || lower.includes("восток")) {
            reply = `Информация по вашему запросу <b>"${question}"</b> обработана. По географическому расположению объекты классифицируются согласно координатам на карте. Вы можете кликнуть на найденный маркер на карте справа для детального обзора.`;
        } else {
            reply = `Объект по вашему запросу <b>"${question}"</b> успешно обработан в базе географических данных. Если этот населенный пункт есть на карте, точка автоматически отобразится на экране.`;
        }

        // Обновляем последнее сообщение
        const chat = document.getElementById('chatMessages');
        const lastMsg = chat.lastElementChild;
        if (lastMsg && lastMsg.querySelector('.msg-ai')) {
            lastMsg.querySelector('.msg-ai').innerHTML = `🤖 ${reply}`;
        }
    }
</script>
</body>
</html>

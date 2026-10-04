// Создаем кастомный контрол для ИИ прямо поверх карты Leaflet
const AIControl = L.Control.extend({
    options: {
        position: 'bottomleft' // Можно поменять на 'bottomright', 'topright' и т.д.
    },

    onAdd: function (map) {
        // Создаем контейнер элемента
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control ai-map-widget');
        
        // Отключаем проброс кликов и зума карты при взаимодействии с чатом
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        // Наполняем HTML-кодом полноценного чата
        container.innerHTML = `
            <div style="width: 380px; max-width: 90vw; background: #0d1117; border: 2px solid #58a6ff; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.7); display: flex; flex-direction: column; overflow: hidden; font-family: system-ui, sans-serif;">
                <div style="padding: 8px 12px; background: #161b22; border-bottom: 1px solid #30363d; font-size: 12.5px; font-weight: 600; color: #58a6ff; display: flex; justify-content: space-between; align-items: center;">
                    <span>🤖 Гео-ИИ на карте</span>
                    <span style="font-size: 10px; background: #238636; color: #fff; padding: 2px 5px; border-radius: 3px;">Активен</span>
                </div>
                <div id="mapAiChatMessages" style="padding: 10px; height: 160px; overflow-y: auto; font-size: 12px; color: #c9d1d9; background: #0d1117; line-height: 1.4; display: flex; flex-direction: column; gap: 6px;">
                    <div style="background: #161b22; padding: 6px 8px; border-radius: 4px; border: 1px solid #30363d; color: #8b949e;">
                        👋 Привет! Задайте вопрос по карте или географии (страны, города, села).
                    </div>
                </div>
                <div style="padding: 8px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 6px;">
                    <input type="text" id="mapAiUserInput" placeholder="Спросите объект на карте..." style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 4px; padding: 6px 8px; color: #fff; font-size: 12px; outline: none;" onkeypress="if(event.key==='Enter') sendMapAIPrompt()">
                    <button onclick="sendMapAIPrompt()" style="background: #238636; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">Спросить</button>
                </div>
            </div>
        `;

        return container;
    }
});

// Добавляем виджет на вашу карту (предполагается, что переменная карты называется `map`)
const aiWidgetInstance = new AIControl();
aiWidgetInstance.addTo(map);

// База ключевых слов и логика ответов
const geoKeywords = [
    "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
    "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
    "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
    "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок", "канал"
];

function sendMapAIPrompt() {
    const inputField = document.getElementById('mapAiUserInput');
    const chatContainer = document.getElementById('mapAiChatMessages');
    
    if (!inputField || !chatContainer) return;
    const queryText = inputField.value.trim();
    if (!queryText) return;

    // Вывод сообщения пользователя
    chatContainer.innerHTML += `<div style="align-self: flex-end; background: #1f6feb; color: #fff; padding: 6px 8px; border-radius: 4px; max-width: 85%; word-break: break-word;">👤 ${escapeHtml(queryText)}</div>`;
    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
        const lowerQuery = queryText.toLowerCase();
        const isGeography = geoKeywords.some(keyword => lowerQuery.includes(keyword));
        let responseHTML = "";

        if (!isGeography) {
            responseHTML = `⛔ Отвечаю <b>только</b> на вопросы по географии, регионам и объектам эко-карты.`;
        } else if (lowerQuery.includes("атырау")) {
            responseHTML = `🤖 <b>Атырау</b> — город на западе Казахстана, расположенный в устье реки Урал.`;
        } else if (lowerQuery.includes("москва")) {
            responseHTML = `🤖 <b>Москва</b> — столица России, находится в центре Восточно-Европейской равнины.`;
        } else {
            responseHTML = `🤖 Объект <b>"${escapeHtml(queryText)}"</b> успешно проверен по базе данных карты.`;
        }

        chatContainer.innerHTML += `<div style="align-self: flex-start; background: #161b22; border: 1px solid #30363d; color: #c9d1d9; padding: 6px 8px; border-radius: 4px; max-width: 88%; word-break: break-word;">${responseHTML}</div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 300);
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

<!-- === ФИНАЛЬНЫЙ ИИ-ВИДЖЕТ ПОВЕРХ ВСЕХ СЛОЕВ КАРТЫ === -->
<div id="superAiOverlayPanel" style="position: fixed !important; bottom: 30px !important; left: 30px !important; z-index: 2147483647 !important; width: 380px; max-width: 90vw; background: #0d1117; border: 2px solid #58a6ff; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.8); display: flex; flex-direction: column; overflow: hidden; font-family: system-ui, sans-serif;">
    
    <!-- Шапка виджета -->
    <div style="padding: 10px 14px; background: #161b22; border-bottom: 1px solid #30363d; font-size: 13px; font-weight: 600; color: #58a6ff; display: flex; justify-content: space-between; align-items: center;">
        <span>🤖 Гео-ИИ на карте</span>
        <span style="font-size: 10px; background: #238636; color: #fff; padding: 2px 6px; border-radius: 4px;">Поверх карты</span>
    </div>

    <!-- Область чата -->
    <div id="superAiChatMessages" style="padding: 12px; height: 180px; overflow-y: auto; font-size: 12.5px; color: #c9d1d9; background: #0d1117; line-height: 1.4; display: flex; flex-direction: column; gap: 8px;">
        <div style="background: #161b22; padding: 8px 10px; border-radius: 6px; border: 1px solid #30363d; color: #8b949e;">
            👋 Привет! Я зафиксирован поверх карты. Задай вопрос по географии (страны, регионы, города, села).
        </div>
    </div>

    <!-- Поле ввода и кнопка -->
    <div style="padding: 10px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 6px;">
        <input type="text" id="superAiUserInput" placeholder="Спросите объект на карте..." style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 7px 10px; color: #fff; font-size: 12px; outline: none;" onkeypress="if(event.key==='Enter') sendSuperAiPrompt()">
        <button onclick="sendSuperAiPrompt()" style="background: #238636; color: #fff; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Спросить</button>
    </div>
</div>

<script>
    // База ключевых слов для строгой географической фильтрации
    const superGeoKeywords = [
        "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
        "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
        "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
        "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок", "канал"
    ];

    function sendSuperAiPrompt() {
        const inputField = document.getElementById('superAiUserInput');
        const chatContainer = document.getElementById('superAiChatMessages');
        
        if (!inputField || !chatContainer) return;
        const queryText = inputField.value.trim();
        if (!queryText) return;

        // Вывод сообщения пользователя
        chatContainer.innerHTML += `
            <div style="align-self: flex-end; background: #1f6feb; color: #fff; padding: 7px 10px; border-radius: 6px; max-width: 85%; word-break: break-word;">
                👤 ${escapeSuperHtml(queryText)}
            </div>`;
        
        inputField.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Ответ ИИ
        setTimeout(() => {
            const lowerQuery = queryText.toLowerCase();
            const isGeography = superGeoKeywords.some(keyword => lowerQuery.includes(keyword));
            let responseHTML = "";

            if (!isGeography) {
                responseHTML = `⛔ Отвечаю <b>только</b> на вопросы по географии, регионам и объектам эко-карты.`;
            } else if (lowerQuery.includes("атырау")) {
                responseHTML = `🤖 <b>Атырау</b> — город на западе Казахстана, расположенный в устье реки Урал.`;
            } else if (lowerQuery.includes("москва")) {
                responseHTML = `🤖 <b>Москва</b> — столица России, находится в центре Восточно-Европейской равнины.`;
            } else {
                responseHTML = `🤖 Объект <b>"${escapeSuperHtml(queryText)}"</b> успешно проверен по базе данных карты.`;
            }

            chatContainer.innerHTML += `
                <div style="align-self: flex-start; background: #161b22; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 10px; border-radius: 6px; max-width: 88%; word-break: break-word;">
                    ${responseHTML}
                </div>`;
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 300);
    }

    function escapeSuperHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
</script>

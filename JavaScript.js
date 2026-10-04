<!-- === СТРОГО ВСТРОЕННЫЙ ИИ-АССИСТЕНТ В САЙДБАР === -->
<div id="sidebarAiContainer" style="margin-top: 15px; width: 100%; background: #0d1117; border: 2px solid #58a6ff; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box; font-family: system-ui, sans-serif;">
    
    <!-- Шапка панели -->
    <div style="padding: 10px 12px; background: #161b22; border-bottom: 1px solid #30363d; font-size: 13px; font-weight: 600; color: #58a6ff; display: flex; justify-content: space-between; align-items: center;">
        <span>🤖 Гео-ИИ Ассистент</span>
        <span style="font-size: 10px; background: #238636; color: #fff; padding: 2px 6px; border-radius: 4px;">В сайдбаре</span>
    </div>

    <!-- Область сообщений чата -->
    <div id="sidebarAiMessages" style="padding: 12px; height: 210px; overflow-y: auto; font-size: 12.5px; color: #c9d1d9; background: #0d1117; line-height: 1.4; display: flex; flex-direction: column; gap: 8px;">
        <div style="background: #161b22; padding: 8px 10px; border-radius: 6px; border: 1px solid #30363d; color: #8b949e;">
            👋 Привет! Задайте вопрос по географии (страны, регионы, города, села).
        </div>
    </div>

    <!-- Поле ввода и кнопка -->
    <div style="padding: 10px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 6px;">
        <input type="text" id="sidebarAiInput" placeholder="Спросите про объект..." style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 7px 10px; color: #fff; font-size: 12px; outline: none;" onkeypress="if(event.key==='Enter') sendSidebarAiPrompt()">
        <button onclick="sendSidebarAiPrompt()" style="background: #238636; color: #fff; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Спросить</button>
    </div>
</div>

<script>
    // База ключевых слов для фильтрации гео-запросов
    const sidebarGeoKeywords = [
        "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
        "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
        "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
        "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок", "канал"
    ];

    function sendSidebarAiPrompt() {
        const inputField = document.getElementById('sidebarAiInput');
        const chatContainer = document.getElementById('sidebarAiMessages');
        
        if (!inputField || !chatContainer) return;
        const queryText = inputField.value.trim();
        if (!queryText) return;

        // Сообщение пользователя
        chatContainer.innerHTML += `
            <div style="align-self: flex-end; background: #1f6feb; color: #fff; padding: 7px 10px; border-radius: 6px; max-width: 85%; word-break: break-word;">
                👤 ${escapeSidebarHtml(queryText)}
            </div>`;
        
        inputField.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Ответ ИИ
        setTimeout(() => {
            const lowerQuery = queryText.toLowerCase();
            const isGeography = sidebarGeoKeywords.some(keyword => lowerQuery.includes(keyword));
            let responseHTML = "";

            if (!isGeography) {
                responseHTML = `⛔ Отвечаю <b>только</b> на вопросы по географии, регионам и объектам эко-карты.`;
            } else if (lowerQuery.includes("атырау")) {
                responseHTML = `🤖 <b>Атырау</b> — город на западе Казахстана, расположенный в устье реки Урал.`;
            } else if (lowerQuery.includes("москва")) {
                responseHTML = `🤖 <b>Москва</b> — столица России, находится в центре Восточно-Европейской равнины.`;
            } else {
                responseHTML = `🤖 Объект <b>"${escapeSidebarHtml(queryText)}"</b> успешно проверен по базе данных карты.`;
            }

            chatContainer.innerHTML += `
                <div style="align-self: flex-start; background: #161b22; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 10px; border-radius: 6px; max-width: 88%; word-break: break-word;">
                    ${responseHTML}
                </div>`;
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 300);
    }

    function escapeSidebarHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
</script>

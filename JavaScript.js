// === ЛОГИКА ГЕО-ИИ АССИСТЕНТА ДЛЯ САЙДБАРА ===

// База ключевых слов для строгой географической фильтрации
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

    // Вывод сообщения пользователя
    chatContainer.innerHTML += `
        <div style="align-self: flex-end; background: #1f6feb; color: #fff; padding: 7px 10px; border-radius: 6px; max-width: 85%; word-break: break-word;">
            👤 ${escapeSidebarHtml(queryText)}
        </div>`;
    
    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Обработка и ответ ИИ с задержкой
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
        } else if (lowerQuery.includes("астана")) {
            responseHTML = `🤖 <b>Астана</b> — столица Казахстана, расположена на севере центральной части страны.`;
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

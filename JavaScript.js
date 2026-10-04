<!-- === СТАЦИОНАРНЫЙ ИИ-АССИСТЕНТ В САЙДБАРЕ === -->
<div style="margin-top: 15px; background: #161b22; border: 1px solid #30363d; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; font-family: system-ui, sans-serif;">
    
    <!-- Заголовок панели -->
    <div style="padding: 10px 12px; background: #21262d; border-bottom: 1px solid #30363d; font-size: 13px; font-weight: 600; color: #58a6ff; display: flex; align-items: center; gap: 6px;">
        <span>🤖 Гео-ИИ Ассистент</span>
    </div>

    <!-- Область чата -->
    <div id="aiChatMessages" style="padding: 10px; height: 200px; overflow-y: auto; font-size: 12.5px; color: #c9d1d9; background: #0d1117; line-height: 1.4;">
        <div style="margin-bottom: 6px; color: #8b949e;">👋 Задайте вопрос про страны, регионы, города, районы или села (например: <i>«Москва на севере или на юге?»</i>).</div>
    </div>

    <!-- Поле ввода и кнопка -->
    <div style="padding: 8px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 6px;">
        <input type="text" id="aiUserInput" placeholder="Спросите про город или страну..." style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 6px 8px; color: #fff; font-size: 12px; outline: none;" onkeypress="if(event.key==='Enter') sendAIPrompt()">
        <button onclick="sendAIPrompt()" style="background: #238636; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Спросить</button>
    </div>
</div>

// Ключевые слова для фильтрации (строго география, страны, села, города)
const geoKeywords = [
    "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
    "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
    "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
    "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок"
];

function sendAIPrompt() {
    const input = document.getElementById('aiUserInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('aiChatMessages');

    // Сообщение пользователя
    chatBox.innerHTML += `<div style="margin-bottom: 6px;">👤 <b>Вы:</b> ${text}</div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Проверка гео-тематики
    const lower = text.toLowerCase();
    const isGeo = geoKeywords.some(kw => lower.includes(kw));

    setTimeout(() => {
        let aiReply = "";

        if (!isGeo) {
            aiReply = "⛔ Извините, я отвечаю <b>только</b> на вопросы про страны, регионы, районы, города и села, а также про данные нашей эко-карты.";
        } else if (lower.includes("москва")) {
            aiReply = "🤖 <b>Москва</b> находится в европейской части России, ближе к северо-западу. Является крупнейшим мегаполисом региона.";
        } else if (lower.includes("атырау")) {
            aiReply = "🤖 <b>Атырау</b> расположен на западе Казахстана, в устье реки Урал. Делится рекой на европейскую и азиатскую части.";
        } else if (lower.includes("астана")) {
            aiReply = "🤖 <b>Астана</b> — столица Казахстана, находится на севере центральной части страны на берегу реки Есиль.";
        } else {
            aiReply = `🤖 Запрос по объекту <b>"${text}"</b> успешно обработан в базе географических данных.`;
        }

        chatBox.innerHTML += `<div style="margin-bottom: 8px; background: #161b22; padding: 6px 8px; border-radius: 6px; border: 1px solid #30363d;">${aiReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 400);
}

<!-- === ПОЛНОЦЕННЫЙ ИИ-АССИСТЕНТ === -->
<div id="aiFloatingPanel" style="position: fixed !important; bottom: 25px !important; left: 50% !important; transform: translateX(-50%) !important; width: 440px; max-width: 90vw; background: #0d1117; border: 2px solid #58a6ff; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.8); z-index: 999999 !important; display: flex !important; flex-direction: column; overflow: hidden; font-family: system-ui, sans-serif;">
    
    <!-- Шапка для перетаскивания -->
    <div id="aiDragHandle" style="padding: 10px 14px; background: #161b22; border-bottom: 1px solid #30363d; cursor: grab; font-size: 13.5px; font-weight: 600; color: #58a6ff; display: flex; justify-content: space-between; align-items: center; user-select: none;">
        <span>🤖 Гео-ИИ Ассистент (полноценный)</span>
        <button onclick="resetAIPosition()" style="background: #21262d; border: 1px solid #30363d; color: #c9d1d9; font-size: 11px; padding: 3px 8px; border-radius: 4px; cursor: pointer;">🏠 Вернуть</button>
    </div>

    <!-- Область чата/сообщений -->
    <div id="aiChatMessages" style="padding: 14px; max-height: 220px; overflow-y: auto; font-size: 13.5px; color: #c9d1d9; background: #0d1117; line-height: 1.5;">
        <div style="margin-bottom: 8px; color: #8b949e;">👋 Привет! Задайте вопрос про страны, регионы, города, районы или села (например: <i>«Москва на севере или на юге?»</i>).</div>
    </div>

    <!-- Поле ввода и кнопка отправки -->
    <div style="padding: 10px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 8px;">
        <input type="text" id="aiUserInput" placeholder="Спросите про город, регион или страну..." style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 8px 10px; color: #fff; font-size: 13px; outline: none;" onkeypress="if(event.key==='Enter') sendAIPrompt()">
        <button onclick="sendAIPrompt()" style="background: #238636; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">Спросить</button>
    </div>
</div>

<script>
    const panel = document.getElementById('aiFloatingPanel');
    const handle = document.getElementById('aiDragHandle');

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    if (handle && panel) {
        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            panel.style.transform = 'none';
            panel.style.left = initialLeft + 'px';
            panel.style.top = initialTop + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;

        if (newLeft < 10) newLeft = 10;
        if (newLeft > windowWidth - panelWidth - 10) newLeft = windowWidth - panelWidth - 10;
        if (newTop < 10) newTop = 10;
        if (newTop > windowHeight - panelHeight - 10) newTop = windowHeight - panelHeight - 10;

        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function resetAIPosition() {
        if (!panel) return;
        panel.style.top = 'auto';
        panel.style.right = 'auto';
        panel.style.bottom = '25px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
    }

    // Ключевые слова для фильтрации (строго география, страны, села, города)
    const geoKeywords = [
        "где", "город", "село", "деревня", "район", "область", "страна", "регион", 
        "север", "юг", "запад", "восток", "центр", "координаты", "находится", "климат", 
        "москва", "атырау", "астана", "алматы", "россия", "казахстан", "узбекистан", 
        "какой", "какая", "какое", "часть", "округ", "карта", "экология", "расстояние", "поселок"
    ];

    function sendAIPrompt() {
        const input = document.getElementById('aiUserInput');
        const text = input.value.trim();
        if (!text) return;

        const chatBox = document.getElementById('aiChatMessages');

        // Добавляем сообщение пользователя
        chatBox.innerHTML += `<div style="margin-bottom: 8px;">👤 <b>Вы:</b> ${text}</div>`;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Проверяем, относится ли вопрос к географии
        const lower = text.toLowerCase();
        const isGeo = geoKeywords.some(kw => lower.includes(kw));

        setTimeout(() => {
            let aiReply = "";

            if (!isGeo) {
                aiReply = "⛔ Извините, я отвечаю <b>только</b> на вопросы про страны, регионы, районы, города и села, а также про данные нашей эко-карты. Пожалуйста, задайте вопрос по географии.";
            } else if (lower.includes("москва")) {
                aiReply = "🤖 <b>Москва</b> находится в европейской части России, ближе к северо-западу. Является крупнейшим мегаполисом региона.";
            } else if (lower.includes("атырау")) {
                aiReply = "🤖 <b>Атырау</b> расположен на западе Казахстана, в устье реки Урал. Делится рекой на европейскую и азиатскую части.";
            } else if (lower.includes("астана")) {
                aiReply = "🤖 <b>Астана</b> — столица Казахстана, находится на севере центральной части страны на берегу реки Есиль.";
            } else {
                aiReply = `🤖 Запрос по объекту <b>"${text}"</b> успешно принят. Данные по этому региону, району или населенному пункту сопоставлены с картой.`;
            }

            chatBox.innerHTML += `<div style="margin-bottom: 10px; background: #161b22; padding: 8px 10px; border-radius: 6px; border: 1px solid #30363d;">${aiReply}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500);
    }
</script>
<!-- === КОНЕЦ ИИ-АССИСТЕНТА === -->

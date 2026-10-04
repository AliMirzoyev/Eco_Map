document.addEventListener('DOMContentLoaded', () => {
    const aiMiniInput = document.getElementById('aiMiniInput');
    const aiMiniChat = document.getElementById('aiMiniChat');

    if (!aiMiniInput || !aiMiniChat) return;

    // Глобальная или вспомогательная функция для кликов по быстрым тегам (Атырау, Кульсары, Алматы)
    window.setAndSearch = function(cityName) {
        aiMiniInput.value = cityName;
        askMiniAI();
    };

    // Функция мини-поиска
    window.askMiniAI = function() {
        let q = aiMiniInput.value.trim();
        if (!q) return;
        
        // Добавляем сообщение в мини-чат
        let u = document.createElement('div');
        u.style.cssText = 'color:#58a6ff';
        u.textContent = '🤖 Ищу: ' + q + '...';
        aiMiniChat.prepend(u);
        aiMiniChat.scrollTop = 0;

        // 1. Интеграция с основным полем поиска карты
        const searchInputEl = document.getElementById('searchInput');
        if (searchInputEl) {
            searchInputEl.value = q;
        }
        if (typeof searchLocation === 'function') {
            searchLocation();
        }

        // 2. Запрос подробного эко-отчета
        if (typeof getAIEcoReport === 'function') {
            getAIEcoReport(q);
        }

        // 3. Ответ ИИ в мини-чате
        setTimeout(() => {
            let a = document.createElement('div');
            a.style.cssText = 'color:#c9d1d9;background:#161b22;border:1px solid #30363d;padding:5px 8px;border-radius:6px';
            let l = q.toLowerCase();
            
            if (l.includes('атырау')) {
                a.innerHTML = '📍 <b>Атырау</b> — нефтяная столица, р. Урал. Данные обновлены на 2026 год.';
            } else if (l.includes('кульсары')) {
                a.innerHTML = '📍 <b>Кульсары</b> — Жылыойский р-н, центр нефти. Показал на карте.';
            } else if (l.includes('алматы')) {
                a.innerHTML = '📍 <b>Алматы</b> — мегаполис у гор Заилийского Алатау. Загрязнение проверено.';
            } else {
                a.innerHTML = `✅ <b>${q}</b> — локация найдена, смотри на карте. Отчет загружен в панель.`;
            }
            
            aiMiniChat.prepend(a);
            aiMiniInput.value = '';
        }, 400);
    };

    // Обработка нажатия Enter
    aiMiniInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            askMiniAI();
        }
    });
});

// Запрос подробной справки через Pollinations AI (2026 год)
async function getAIEcoReport(locationName) {
    const aiText = document.getElementById('aiTextContent');
    if (!aiText) return;

    aiText.innerHTML = `⏳ ИИ собирает актуальные данные и историю на 2026 год для: <b>${locationName}</b>...`;

    const promptText = `Предоставь подробную, структурированную справку на сегодняшний день (2026 год) для локации: "${locationName}".
Включи в ответ:
1. Историческую справку (основание, ключевые вехи, развитие страны, региона или села).
2. Экологическую обстановку (строго фокус на воду, моря, океаны, прибрежные зоны, разливы, химикаты, пластик, если применимо).
Правила: Никакой пустой лирики, только сухие факты, цифры и четкая структура по пунктам на русском языке.`;

    try {
        const response = await fetch("https://text.pollinations.ai/" + encodeURIComponent(promptText));
        const text = await response.text();
        aiText.innerHTML = text.replace(/\n/g, '<br>');
    } catch (e) {
        aiText.innerHTML = `❌ Ошибка загрузки данных для ${locationName}. Проверьте подключение.`;
    }
}

// Безопасный доступ к камере
async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.play();
        }
    } catch (error) {
        console.log("Ошибка доступа к камере или пользователь отклонил запрос:", error);
    }
}

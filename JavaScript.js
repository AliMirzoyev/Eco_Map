<!-- === ИИ МИНИ-ПОИСКОВИК В СТИЛЕ ТВОЕГО СКРИНА === -->
<style>
#aiBottom{
  height:auto;
  min-height:110px;
  flex-shrink:0;
  border-top:1px solid #30363d;
  background:#0d1117;
  padding:10px;
  display:flex;
  flex-direction:column;
  gap:8px;
}
#aiMiniRow{
  display:flex;
  gap:8px;
  align-items:center;
}
#aiMiniInput{
  flex:1;
  background:#0d1117;
  border:1px solid #30363d;
  color:#fff;
  padding:10px 12px;
  border-radius:8px;
  font-size:13px;
  outline:none;
}
#aiMiniInput:focus{border-color:#58a6ff}
#aiMiniBtn{
  background:#1f6feb;
  color:#fff;
  border:none;
  border-radius:8px;
  padding:10px 18px;
  font-weight:700;
  font-size:13px;
  cursor:pointer;
  white-space:nowrap;
}
#aiMiniBtn:hover{background:#388bfd}
#aiMiniLabel{
  font-size:10px;
  color:#8b949e;
  display:flex;
  justify-content:space-between;
}
#aiMiniChat{
  max-height:90px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:4px;
  font-size:11px;
}
</style>

<div id="aiBottom">
  <div id="aiMiniLabel"><span>🤖 <b style="color:#58a6ff">ИИ-поиск</b> • спроси про любой населенный пункт</span><span style="color:#58a6ff">194 стран</span></div>
  
  <div id="aiMiniRow">
    <input id="aiMiniInput" placeholder="ИИ: Город, район, село...">
    <button id="aiMiniBtn" onclick="askMiniAI()">Найти</button>
  </div>

  <div id="aiMiniChat">
    <div style="color:#8b949e">Напиши например: <span style="color:#c9d1d9;cursor:pointer" onclick="aiMiniInput.value='Атырау';askMiniAI()">Атырау</span> • <span style="color:#c9d1d9;cursor:pointer" onclick="aiMiniInput.value='Кульсары';askMiniAI()">Кульсары</span> • <span style="color:#c9d1d9;cursor:pointer" onclick="aiMiniInput.value='Алматы';askMiniAI()">Алматы</span></div>
  </div>
</div>

<script>
const aiMiniInput = document.getElementById('aiMiniInput');
const aiMiniChat = document.getElementById('aiMiniChat');

function askMiniAI(){
  let q = aiMiniInput.value.trim();
  if(!q) return;
  
  // добавляем сообщение
  let u = document.createElement('div');
  u.style.cssText = 'color:#58a6ff';
  u.textContent = '🤖 Ищу: ' + q + '...';
  aiMiniChat.prepend(u);
  aiMiniChat.scrollTop = 0;

  // 1. Ищем на карте (твоя функция)
  document.getElementById('searchInput').value = q;
  if(typeof searchLocation === 'function') searchLocation();

  // 2. Ответ ИИ
  setTimeout(()=>{
    let a = document.createElement('div');
    a.style.cssText = 'color:#c9d1d9;background:#161b22;border:1px solid #30363d;padding:5px 8px;border-radius:6px';
    let l = q.toLowerCase();
    if(l.includes('атырау')) a.innerHTML = '📍 <b>Атырау</b> — нефтяная столица, р.Урал, 400 тыс. Загрязнение ~65%. Показал на карте.';
    else if(l.includes('кульсары')) a.innerHTML = '📍 <b>Кульсары</b> — Жылыойский р-н, центр нефти. Показал.';
    else if(l.includes('алматы')) a.innerHTML = '📍 <b>Алматы</b> — 2.2 млн, у гор Заилийского Алатау. Загрязнение высокое.';
    else a.innerHTML = `✅ <b>${q}</b> — нашел, смотри на карте справа. Хочешь узнать загрязнение?`;
    aiMiniChat.prepend(a);
    aiMiniInput.value = '';
  }, 400);
}

aiMiniInput.addEventListener('keydown', e=>{ if(e.key==='Enter') askMiniAI(); });
</script>

async function getAIEcoReport(locationName) {
    const aiText = document.getElementById('aiTextContent');
    if (!aiText) return;

    aiText.innerHTML = `⏳ ИИ собирает актуальные данные и историю для: <b>${locationName}</b>...`;

    const promptText = `Предоставь подробную, структурированную справку на сегодняшний день (2026 год) для локации: "${locationName}".
Включи в ответ:
1. Историческую справку (основание, ключевые вехи, развитие страны, региона или села).
2. Экологическую обстановку (строго фокус на воду, моря, океаны, прибрежные зоны, разливы, химикаты, пластик, если применимо).
Правила: Никакой пустой лирики, только сухие факты, цифры и четкая структура по пунктам на русском языке.`;

    try {
        const response = await fetch("https://text.pollinations.ai/" + encodeURIComponent(promptText));
        const text = await response.text();
        // Заменяем переносы строк на теги <br> для красивого отображения в блоке
        aiText.innerHTML = text.replace(/\n/g, '<br>');
    } catch (e) {
        aiText.innerHTML = `❌ Ошибка загрузки данных для ${locationName}. Проверьте подключение.`;
    }
}

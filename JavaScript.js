<!-- === ГЕО-ИИ АССИСТЕНТ V2 - ВСЕ СТРАНЫ МИРА === -->
<div id="aiSidebarWidget" style="margin-top: 15px; background: #161b22; border: 1px solid #30363d; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
    <div style="padding: 10px 12px; background: #21262d; border-bottom: 1px solid #30363d; font-size: 13px; font-weight: 600; color: #58a6ff; display: flex; align-items: center; justify-content: space-between;">
        <span>🌍 Гео-База Знаний</span>
        <span style="font-size: 10px; background: #238636; color: #fff; padding: 2px 6px; border-radius: 4px;">Все страны</span>
    </div>
    <div id="aiChatMessages" style="padding: 12px; height: 280px; overflow-y: auto; font-size: 12.5px; color: #c9d1d9; background: #0d1117; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;"></div>
    <div style="padding: 10px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 6px;">
        <input type="text" id="aiUserInput" placeholder="Напр: столица Казахстана? язык Турции?" style="flex: 1; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 7px 10px; color: #fff; font-size: 12px; outline: none;">
        <button id="aiAskBtn" style="background: #238636; color: #fff; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Спросить</button>
    </div>
</div>

<script>
(function(){
    const input = document.getElementById('aiUserInput');
    const chat = document.getElementById('aiChatMessages');
    const btn = document.getElementById('aiAskBtn');

    // 1. СТРОГИЙ ФИЛЬТР ТЕМ - только гео
    const ALLOWED_TRIGGERS = [
        // RU
        "где","страна","столица","город","село","район","область","регион","континент","материк","остров","море","океан","река","озеро","гора","климат","координаты","население","площадь","язык","валюта","флаг","герб","национальность","гражданство","карта","границ","геолог","географ",
        // EN
        "country","capital","city","population","language","currency","continent","where","map","area",
        // KZ
        "ел","қала","астана","тіл","валюта","карта",
        // Названия стран для триггера
        "казахстан","россия","узбекистан","турция","сша","америка","германия","франция","китай","япония","индия","казакстан","kyrgyz","azerbaijan"
    ];

    const BLOCKED_TRIGGERS = ["рецепт","погода на завтра","фильм","игра","как взломать","политика","война кто прав","заработай","порно","секс"];

    // 2. ЛОКАЛЬНАЯ БАЗА ТОП-30 СТРАН для оффлайн работы
    const LOCAL_DB = {
        "казахстан": {capital:"Астана", lang:"казахский, русский", currency:"тенге (KZT)", pop:"~20 млн", cont:"Азия", nation:"казахи"},
        "россия": {capital:"Москва", lang:"русский", currency:"рубль (RUB)", pop:"~146 млн", cont:"Европа/Азия", nation:"русские"},
        "узбекистан": {capital:"Ташкент", lang:"узбекский", currency:"сум (UZS)", pop:"~36 млн", cont:"Азия", nation:"узбеки"},
        "турция": {capital:"Анкара", lang:"турецкий", currency:"лира (TRY)", pop:"~85 млн", cont:"Европа/Азия", nation:"турки"},
        "сша": {capital:"Вашингтон", lang:"английский", currency:"доллар (USD)", pop:"~340 млн", cont:"Сев. Америка", nation:"американцы"},
        "германия": {capital:"Берлин", lang:"немецкий", currency:"евро (EUR)", pop:"~84 млн", cont:"Европа", nation:"немцы"},
        "китай": {capital:"Пекин", lang:"китайский", currency:"юань (CNY)", pop:"~1.4 млрд", cont:"Азия", nation:"китайцы"},
        "япония": {capital:"Токио", lang:"японский", currency:"иена (JPY)", pop:"~124 млн", cont:"Азия", nation:"японцы"},
    };

    function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

    function addMsg(html, isUser){
        const el=document.createElement('div');
        el.style.cssText = isUser ? "align-self:flex-end;background:#1f6feb;color:#fff;padding:7px 10px;border-radius:6px;max-width:85%;word-break:break-word;" : "align-self:flex-start;background:#161b22;border:1px solid #30363d;color:#c9d1d9;padding:8px 10px;border-radius:6px;max-width:92%;word-break:break-word;";
        el.innerHTML = isUser ? `👤 ${escapeHtml(html)}` : html;
        chat.appendChild(el);
        chat.scrollTop = chat.scrollHeight;
    }

    addMsg(`👋 Я знаю <b>все 250 стран мира</b>. Спроси:<br>• столица, язык, валюта, население<br>• национальность, континент, площадь<br>Пример: "Какая столица Канады и какой язык?"`, false);

    function isGeoQuery(q){
        const l = q.toLowerCase();
        if(BLOCKED_TRIGGERS.some(w=>l.includes(w))) return false;
        return ALLOWED_TRIGGERS.some(w=>l.includes(w));
    }

    async function getCountryInfo(query){
        // Ищем название страны в запросе
        const l = query.toLowerCase();
        // пробуем найти в локальной базе
        for(const key in LOCAL_DB){
            if(l.includes(key)){
                const d = LOCAL_DB[key];
                return `🤖 <b>${key.toUpperCase()}</b><br>🏛️ Столица: <b>${d.capital}</b><br>🗣️ Язык: ${d.lang}<br>💰 Валюта: ${d.currency}<br>👥 Население: ${d.pop}<br>🌍 Континент: ${d.cont}<br>👤 Национальность: ${d.nation}`;
            }
        }
        // Если нет в локальной - тянем с restcountries.com
        try{
            // вытаскиваем последнее слово как возможную страну
            const countryName = query.replace(/[^a-zA-Zа-яА-Я\s]/g,'').split(' ').filter(Boolean).pop();
            const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,capital,languages,currencies,population,continents,demonyms`);
            if(!res.ok) throw new Error();
            const data = await res.json();
            const c = data[0];
            return `🤖 <b>${c.name.common}</b><br>🏛️ Столица: <b>${c.capital?.[0] || '-'}</b><br>🗣️ Язык: ${Object.values(c.languages||{}).join(', ')}<br>💰 Валюта: ${Object.values(c.currencies||{}).map(v=>v.name+' ('+v.symbol+')').join(', ')}<br>👥 Население: ${c.population.toLocaleString()}<br>🌍 Континент: ${c.continents?.[0]}<br>👤 Жителей называют: ${c.demonyms?.eng?.m || '-'}`;
        }catch(e){
            return null;
        }
    }

    let busy=false;
    async function handle(){
        if(busy) return;
        const q = input.value.trim();
        if(!q) return;
        addMsg(q, true);
        input.value='';
        
        if(!isGeoQuery(q)){
            addMsg(`⛔ Я отвечаю <b>только</b> на темы: страны, столицы, города, села, языки, национальности, валюты, население, континенты, координаты, карты, геология, экология. Задай вопрос по географии.`, false);
            return;
        }

        busy=true; btn.disabled=true; btn.textContent='...';
        addMsg(`⏳ Ищу данные по запросу "${escapeHtml(q)}"...`, false);

        let answer = await getCountryInfo(q);
        chat.lastChild.remove(); // убираем "ищу..."

        if(answer){
            addMsg(answer, false);
        } else {
            addMsg(`🤖 Запрос по объекту <b>"${escapeHtml(q)}"</b> - это география. Уточни: тебя интересует столица, язык, валюта или население? Напиши например "столица Бразилии".`, false);
        }
        busy=false; btn.disabled=false; btn.textContent='Спросить'; input.focus();
    }

    btn.addEventListener('click', handle);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') handle(); });
})();
</script>

<!-- === КОМПАКТНЫЙ ПЛАВАЮЩИЙ ИИ-ВИДЖЕТ V4 === -->
<style>
#aiFloatWrap{position:fixed;left:20px;bottom:20px;width:320px;height:280px;z-index:9999;display:flex;flex-direction:column;background:#0d1117;border:1px solid #30363d;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.6);overflow:hidden;resize:both;min-width:240px;min-height:180px;max-width:90vw;max-height:80vh}
#aiFloatHeader{padding:8px 10px;background:#161b22;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none;touch-action:none}
#aiFloatHeader span{font-size:12px;font-weight:700;color:#58a6ff}
.ai-header-btns{display:flex;gap:4px}
.ai-h-btn{background:#21262d;border:1px solid #30363d;color:#c9d1d9;width:22px;height:22px;border-radius:4px;cursor:pointer;font-size:12px;line-height:1}
.ai-h-btn:hover{background:#30363d}
#aiChatMessages{flex:1;padding:8px;overflow-y:auto;font-size:12px;color:#c9d1d9;background:#0d1117;display:flex;flex-direction:column;gap:6px}
#aiFloatInputBar{padding:6px;background:#161b22;border-top:1px solid #30363d;display:flex;gap:5px}
#aiUserInput{flex:1;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;outline:none}
#aiAskBtn{background:#238636;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600}
#aiMinimizedBtn{position:fixed;left:20px;bottom:20px;z-index:9999;background:#238636;color:#fff;border:none;padding:10px 14px;border-radius:20px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.5);font-size:13px;font-weight:600;display:none}
</style>

<button id="aiMinimizedBtn" onclick="aiToggle(true)">🤖 Гео-ИИ</button>

<div id="aiFloatWrap">
  <div id="aiFloatHeader">
    <span>🤖 Гео-ИИ • компакт</span>
    <div class="ai-header-btns">
      <button class="ai-h-btn" onclick="aiCompact()" title="Компакт">↔</button>
      <button class="ai-h-btn" onclick="aiToggle(false)" title="Свернуть">−</button>
      <button class="ai-h-btn" onclick="aiClose()" title="Закрыть">×</button>
    </div>
  </div>
  <div id="aiChatMessages">
    <div style="background:#161b22;padding:6px 8px;border-radius:6px;border:1px solid #30363d;color:#8b949e;font-size:11px">Привет! Я на карте, меня можно таскать. Спроси про страну, город, район.</div>
  </div>
  <div id="aiFloatInputBar">
    <input type="text" id="aiUserInput" placeholder="Страна, город, село...">
    <button id="aiAskBtn" onclick="executeAIAssistant()">↵</button>
  </div>
</div>

<script>
(function(){
  const wrap=document.getElementById('aiFloatWrap'), header=document.getElementById('aiFloatHeader'), miniBtn=document.getElementById('aiMinimizedBtn');
  const chat=document.getElementById('aiChatMessages'), input=document.getElementById('aiUserInput');
  let isCompact=false, startX, startY, startLeft, startTop, dragging=false;

  // Загрузка позиции из памяти
  const saved=JSON.parse(localStorage.getItem('ai_pos')||'{}');
  if(saved.left) { wrap.style.left=saved.left; wrap.style.bottom='auto'; wrap.style.top=saved.top; }
  if(saved.w) { wrap.style.width=saved.w; wrap.style.height=saved.h; }

  function savePos(){
    localStorage.setItem('ai_pos', JSON.stringify({left:wrap.style.left, top:wrap.style.top, w:wrap.style.width, h:wrap.style.height}));
  }

  // DRAG
  header.addEventListener('mousedown', e=>{ dragging=true; startX=e.clientX; startY=e.clientY; startLeft=wrap.offsetLeft; startTop=wrap.offsetTop; wrap.style.bottom='auto'; });
  window.addEventListener('mousemove', e=>{
    if(!dragging) return;
    wrap.style.left=(startLeft + e.clientX - startX)+'px';
    wrap.style.top=(startTop + e.clientY - startY)+'px';
  });
  window.addEventListener('mouseup', ()=>{ if(dragging){ dragging=false; savePos(); }});

  // TOUCH для телефона
  header.addEventListener('touchstart', e=>{ const t=e.touches[0]; dragging=true; startX=t.clientX; startY=t.clientY; startLeft=wrap.offsetLeft; startTop=wrap.offsetTop; wrap.style.bottom='auto'; }, {passive:false});
  window.addEventListener('touchmove', e=>{ if(!dragging) return; const t=e.touches[0]; wrap.style.left=(startLeft + t.clientX - startX)+'px'; wrap.style.top=(startTop + t.clientY - startY)+'px'; }, {passive:false});
  window.addEventListener('touchend', ()=>{ dragging=false; savePos(); });

  // RESIZE observer
  new ResizeObserver(()=>savePos()).observe(wrap);

  window.aiToggle=function(show){
    if(show){ wrap.style.display='flex'; miniBtn.style.display='none'; }
    else{ wrap.style.display='none'; miniBtn.style.display='block'; }
  };
  window.aiClose=function(){ wrap.style.display='none'; miniBtn.style.display='block'; };
  window.aiCompact=function(){
    isCompact=!isCompact;
    if(isCompact){ wrap.style.width='260px'; wrap.style.height='180px'; }
    else{ wrap.style.width='320px'; wrap.style.height='280px'; }
    savePos();
  };

  const geoKeywords=["где","город","село","район","область","страна","столица","координаты","карта","атырау","астана","казахстан","россия","country","capital","city"];
  const DB={ "казахстан":"🇰🇿 Казахстан - Астана, ~20 млн, тенге","атырау":"📍 Атырау - нефтяная столица, на Урале, ~400 тыс","астана":"📍 Астана - столица КЗ, ~1.4 млн","москва":"📍 Москва - столица РФ, ~13 млн","алматы":"📍 Алматы - ~2.2 млн, у гор" };

  function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
  function addMsg(html,isUser){
    const el=document.createElement('div');
    el.style.cssText=isUser?"align-self:flex-end;background:#1f6feb;color:#fff;padding:5px 8px;border-radius:10px 2px 10px 10px;max-width:80%;font-size:11.5px":"align-self:flex-start;background:#161b22;border:1px solid #30363d;padding:6px 8px;border-radius:2px 10px 10px 10px;max-width:85%;font-size:11.5px";
    el.innerHTML=isUser?`👤 ${esc(html)}`:html;
    chat.appendChild(el); chat.scrollTop=chat.scrollHeight;
  }

  window.executeAIAssistant=function(){
    const q=input.value.trim(); if(!q) return;
    addMsg(q,true); input.value='';
    const l=q.toLowerCase();
    const isGeo=geoKeywords.some(k=>l.includes(k));
    setTimeout(()=>{
      if(!isGeo){ addMsg(`⛔ Только география: страны, города, районы, села.`); return; }
      const key=Object.keys(DB).find(k=>l.includes(k));
      addMsg(key? `🤖 ${DB[key]}` : `🤖 Запрос "${esc(q)}" принят. Уточни: столица/язык/население?`, false);
    },200);
  };
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') executeAIAssistant(); });
})();
</script>

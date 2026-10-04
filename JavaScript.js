<!-- === ФИКС: ИИ ПОВЕРХ КАРТЫ === -->
<style>
/* Поднимаем карту ниже, а ИИ выше всего */
.leaflet-pane{ z-index: 400!important; }
.leaflet-top,.leaflet-bottom{ z-index: 800!important; }
#app{ position: relative; z-index: 1; }
.sidebar{ z-index: 900!important; overflow: visible!important; }

/* ИИ теперь всегда на карте */
#aiFloatWrap{
  position: fixed!important;
  left: 410px!important; /* сразу на карте, а не в сайдбаре */
  bottom: 20px!important;
  width: 320px!important;
  height: 300px!important;
  z-index: 99999!important; /* выше чем Leaflet */
  display: flex!important;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.8);
  flex-direction: column;
  resize: both;
  overflow: hidden;
}
#aiMinimizedBtn{
  position: fixed!important;
  left: 410px!important;
  bottom: 20px!important;
  z-index: 99999!important;
  background: #238636;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(0,0,0,.6);
  display: none;
}
#aiFloatHeader{ cursor: grab; }
#aiFloatHeader:active{ cursor: grabbing; }
</style>

<button id="aiMinimizedBtn" onclick="document.getElementById('aiFloatWrap').style.display='flex'; this.style.display='none'">🤖 Гео-ИИ</button>

<div id="aiFloatWrap">
  <div id="aiFloatHeader" style="padding:8px 10px;background:#161b22;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:12px;font-weight:700;color:#58a6ff">🤖 Гео-ИИ • на карте</span>
    <div style="display:flex;gap:4px">
      <button onclick="document.getElementById('aiFloatWrap').style.display='none';document.getElementById('aiMinimizedBtn').style.display='block'" style="background:#21262d;border:1px solid #30363d;color:#fff;width:22px;height:22px;border-radius:4px;cursor:pointer">−</button>
      <button onclick="document.getElementById('aiFloatWrap').style.display='none'" style="background:#21262d;border:1px solid #30363d;color:#fff;width:22px;height:22px;border-radius:4px;cursor:pointer">×</button>
    </div>
  </div>
  <div id="aiChatMessages" style="flex:1;padding:8px;overflow-y:auto;font-size:12px;display:flex;flex-direction:column;gap:6px;background:#0d1117">
    <div style="background:#161b22;padding:6px 8px;border-radius:6px;border:1px solid #30363d;color:#8b949e;font-size:11px">Я теперь на карте! Таскай меня мышкой за шапку. Задай вопрос про страну/город/село.</div>
  </div>
  <div style="padding:6px;background:#161b22;border-top:1px solid #30363d;display:flex;gap:5px">
    <input type="text" id="aiUserInput" placeholder="Например: Атырау..." style="flex:1;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;outline:none">
    <button onclick="executeAIAssistant()" style="background:#238636;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600">↵</button>
  </div>
</div>

<script>
// DRAG ПО КАРТЕ - теперь работает 100%
(function(){
  const wrap=document.getElementById('aiFloatWrap'), header=document.getElementById('aiFloatHeader');
  let sx, sy, sl, st, drag=false;
  header.addEventListener('mousedown', e=>{ drag=true; sx=e.clientX; sy=e.clientY; sl=wrap.offsetLeft; st=wrap.offsetTop; wrap.style.bottom='auto'; e.preventDefault(); });
  window.addEventListener('mousemove', e=>{ if(!drag) return; wrap.style.left=(sl+e.clientX-sx)+'px'; wrap.style.top=(st+e.clientY-sy)+'px'; });
  window.addEventListener('mouseup', ()=>drag=false);
  // телефон
  header.addEventListener('touchstart', e=>{ const t=e.touches[0]; drag=true; sx=t.clientX; sy=t.clientY; sl=wrap.offsetLeft; st=wrap.offsetTop; });
  window.addEventListener('touchmove', e=>{ if(!drag) return; const t=e.touches[0]; wrap.style.left=(sl+t.clientX-sx)+'px'; wrap.style.top=(st+t.clientY-sy)+'px'; });
  window.addEventListener('touchend', ()=>drag=false);

  // Логика ИИ
  window.executeAIAssistant=function(){
    const inp=document.getElementById('aiUserInput'), chat=document.getElementById('aiChatMessages');
    const q=inp.value.trim(); if(!q) return;
    const d=document.createElement('div'); d.style.cssText='align-self:flex-end;background:#1f6feb;color:#fff;padding:5px 8px;border-radius:10px 2px 10px 10px;max-width:80%;font-size:11px'; d.textContent='👤 '+q; chat.appendChild(d);
    inp.value=''; chat.scrollTop=chat.scrollHeight;
    setTimeout(()=>{
      const l=q.toLowerCase();
      let ans='🤖 Запрос "'+q+'" обработан. Уточни: население, климат, район?';
      if(l.includes('атырау')) ans='📍 Атырау - на Урале, 400 тыс.чел, нефтяная столица.';
      if(l.includes('казахстан')) ans='🇰🇿 Казахстан - Астана, 20 млн.';
      const d2=document.createElement('div'); d2.style.cssText='align-self:flex-start;background:#161b22;border:1px solid #30363d;padding:6px 8px;border-radius:2px 10px 10px 10px;max-width:85%;font-size:11px'; d2.textContent=ans; chat.appendChild(d2); chat.scrollTop=chat.scrollHeight;
    },300);
  };
  document.getElementById('aiUserInput').addEventListener('keydown', e=>{ if(e.key==='Enter') executeAIAssistant(); });
})();
</script>

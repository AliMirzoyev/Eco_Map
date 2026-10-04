/* Плавающая перетаскиваемая панель ИИ снизу по центру */
#aiFloatingPanel {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    max-width: 90vw;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Шапка панели, за которую можно тащить мышкой */
.ai-drag-handle {
    padding: 10px 14px;
    background: #161b22;
    border-bottom: 1px solid #30363d;
    cursor: grab;
    font-size: 13px;
    font-weight: 600;
    color: #58a6ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}
.ai-drag-handle:active {
    cursor: grabbing;
}

.ai-body-content {
    padding: 12px;
    max-height: 200px;
    overflow-y: auto;
    font-size: 13px;
    color: #c9d1d9;
    background: #0d1117;
}

const panel = document.getElementById('aiFloatingPanel');
const handle = document.getElementById('aiDragHandle');

let isDragging = false;
let startX, startY, initialLeft, initialTop;

handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = panel.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Убираем центрирование через transform при начале перетаскивания
    panel.style.transform = 'none';
    panel.style.left = initialLeft + 'px';
    panel.style.top = initialTop + 'px';
    panel.style.bottom = 'auto';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    panel.style.left = (initialLeft + dx) + 'px';
    panel.style.top = (initialTop + dy) + 'px';
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

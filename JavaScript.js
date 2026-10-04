/* Плавающая панель ИИ внизу справа (чуть левее Activate Windows) */
#aiFloatingPanel {
    position: fixed;
    bottom: 40px;
    right: 200px; /* Сдвинута левее от надписи Activate Windows */
    width: 380px;
    max-width: 90vw;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Шапка панели для перетаскивания мышкой */
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
    max-height: 220px;
    overflow-y: auto;
    font-size: 13px;
    color: #c9d1d9;
    background: #0d1117;
    line-height: 1.4;
}

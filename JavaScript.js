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

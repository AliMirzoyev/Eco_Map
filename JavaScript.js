const panel = document.getElementById('aiFloatingPanel');
const handle = document.getElementById('aiDragHandle');

let isDragging = false;
let startX, startY, initialLeft, initialTop;

handle.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return; // Не тащим, если кликнули по кнопке «Вернуть»

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

function onMouseMove(e) {
    if (!isDragging) return;
    
    // Вычисляем новые координаты с учетом смещения мыши
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Получаем размеры окна браузера и самой панели
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;

    // ЗАЩИТНЫЕ ОГРАНИЧЕНИЯ: не даем панели выходить за края экрана
    // Слева (не меньше 10px) и справа (не больше ширина экрана минус ширина панели минус 10px)
    if (newLeft < 10) newLeft = 10;
    if (newLeft > windowWidth - panelWidth - 10) newLeft = windowWidth - panelWidth - 10;

    // Сверху (не меньше 10px) и снизу (не больше высота экрана минус высота панели минус 10px)
    if (newTop < 10) newTop = 10;
    if (newTop > windowHeight - panelHeight - 10) newTop = windowHeight - panelHeight - 10;

    // Применяем безопасные координаты
    panel.style.left = newLeft + 'px';
    panel.style.top = newTop + 'px';
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// Функция мгновенного возврата панели на центр внизу
function resetAIPosition() {
    panel.style.top = 'auto';
    panel.style.bottom = '25px';
    panel.style.left = '50%';
    panel.style.right = 'auto';
    panel.style.transform = 'translateX(-50%)';
}

let map, markersCluster;

document.addEventListener("DOMContentLoaded", () => {
    map = L.map('map').setView([48.0, 68.0], 4);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    markersCluster = L.markerClusterGroup();
    map.addLayer(markersCluster);

    loadCountriesData();
});

function loadCountriesData() {
    const select = document.getElementById('countrySelect');
    const resultsList = document.getElementById('resultsList');
    
    if (select) {
        const countries = [
            { name: "Казахстан", lat: 48.0196, lon: 66.9237 },
            { name: "Россия", lat: 61.5240, lon: 105.3188 },
            { name: "Узбекистан", lat: 41.3775, lon: 64.5853 }
        ];

        select.innerHTML = '<option value="">Выберите страну...</option>';
        countries.forEach(c => {
            let opt = document.createElement('option');
            opt.value = `${c.lat},${c.lon}`;
            opt.textContent = c.name;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            if (!e.target.value || !map) return;
            const [lat, lon] = e.target.value.split(',').map(Number);
            map.setView([lat, lon], 6);
        });
    }

    if (resultsList) {
        resultsList.innerHTML = `
            <div class="item" onclick="if(map) map.setView([47.1000, 51.9167], 10)">
                <b>📍 Город Атырау</b><br><small>Запад Казахстана, р. Урал</small>
            </div>
            <div class="item" onclick="if(map) map.setView([55.7558, 37.6173], 10)">
                <b>📍 Москва</b><br><small>Столица России</small>
            </div>
        `;
    }
}

function searchLocation() {
    const input = document.getElementById('searchInput');
    if (!input || !input.value.trim()) return;
    alert(`Поиск объекта: ${input.value}`);
}

function getUserLocation() {
    if (navigator.geolocation && map) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 12);
            L.marker([lat, lon]).addTo(markersCluster).bindPopup("Вы здесь").openPopup();
        }, () => {
            alert("Не удалось определить геолокацию.");
        });
    }
}

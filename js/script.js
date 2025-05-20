document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('participants');
    const searchInput = document.getElementById('search');
    let data = [];

    // Завантаження JSON
    fetch('js/table-data.json')
        .then(res => res.json())
        .then(json => {
            // Фільтруємо лише ті об'єкти, які мають всі потрібні поля
            data = json.filter(item => item.title && item.category && item.region);
            renderTable(data);
        });

    // Функція рендеру таблиці
    function renderTable(list) {
        tableBody.innerHTML = '';
        list.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.region}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Пошук
    searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase();
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(value) ||
            item.region.toLowerCase().includes(value)
        );
        renderTable(filtered);
    });
});
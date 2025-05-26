document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');
    const searchInput = document.getElementById('search');

    // Додаємо селектор для перемикання між джерелами
    const select = document.createElement('select');
    select.id = 'data-source';
    select.style.marginBottom = '18px';
    select.innerHTML = `
        <option value="js/projects_1-20.json">Картки (projects_1-20.json)</option>
        <option value="js/table-data.json">Список (table-data.json)</option>
    `;
    searchInput.parentNode.insertBefore(select, searchInput);

    let data = [];
    let currentSource = select.value;

    function normalize(item, src) {
        if (src.includes('projects_1-20')) {
            return {
                title: item.title || '',
                author: item.author || '',
                institution: item.institution || '',
                department: item.department || '',
                section: item.section || '',
                region: item.region || '',
                description: item.description || '',
                image: item.image || '',
                booth: item.virtual_booth_url || '#',
            };
        } else {
            return {
                title: item.title || '',
                category: item.category || '',
                region: item.region || '',
                booth: item.booth_url || '#',
            };
        }
    }

    function fetchAndRender(src) {
        fetch(src)
            .then(res => res.json())
            .then(json => {
                data = json.map(item => normalize(item, src));
                render(data, src);
            });
    }

    function render(list, src) {
        cardsContainer.innerHTML = '';
        if (!list.length) {
            cardsContainer.innerHTML = '<p>Немає даних</p>';
            return;
        }
        if (src.includes('projects_1-20')) {
            // Картки
            list.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="https://jasu2025.eu/${item.image || 'https://via.placeholder.com/320x220?text=No+Image'}" alt="Постер">
                    <div class="card-content">
                        <a class="card-title" href="${item.booth}" target="_blank">${item.title}</a>
                        <div class="card-author">Автор(ка): ${item.author}</div>
                        <div class="card-meta">
                            ${item.institution ? `<b>Заклад:</b> ${item.institution}<br>` : ''}
                            ${item.region ? `<b>Регіон:</b> ${item.region}<br>` : ''}
                            ${item.department ? `<b>Відділення:</b> ${item.department}<br>` : ''}
                            ${item.section ? `<b>Розділ:</b> ${item.section}` : ''}
                        </div>
                        <div class="card-desc">${item.description ? item.description.substring(0, 90) + '...' : ''}</div>
                    </div>
                    <div class="card-footer">
                        <a class="card-btn" href="${item.booth}" target="_blank">Віртуальний постер</a>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        } else {
            // Таблиця
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.background = '#fff';
            table.style.borderCollapse = 'collapse';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th style="border:1px solid #ddd;padding:8px;">№</th>
                        <th style="border:1px solid #ddd;padding:8px;">Назва</th>
                        <th style="border:1px solid #ddd;padding:8px;">Категорія</th>
                        <th style="border:1px solid #ddd;padding:8px;">Регіон</th>
                        <th style="border:1px solid #ddd;padding:8px;">Посилання</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map((item, idx) => `
                        <tr>
                            <td style="border:1px solid #ddd;padding:8px;">${idx + 1}</td>
                            <td style="border:1px solid #ddd;padding:8px;">${item.title}</td>
                            <td style="border:1px solid #ddd;padding:8px;">${item.category}</td>
                            <td style="border:1px solid #ddd;padding:8px;">${item.region}</td>
                            <td style="border:1px solid #ddd;padding:8px;">
                                <a href="${item.booth}" target="_blank">Стенд</a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            cardsContainer.appendChild(table);
        }
    }

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase();
        let filtered;
        if (currentSource.includes('projects_1-20')) {
            filtered = data.filter(item =>
                (item.title || '').toLowerCase().includes(value) ||
                (item.region || '').toLowerCase().includes(value) ||
                (item.author || '').toLowerCase().includes(value) ||
                (item.institution || '').toLowerCase().includes(value)
            );
        } else {
            filtered = data.filter(item =>
                (item.title || '').toLowerCase().includes(value) ||
                (item.region || '').toLowerCase().includes(value) ||
                (item.category || '').toLowerCase().includes(value)
            );
        }
        render(filtered, currentSource);
    });

    select.addEventListener('change', () => {
        currentSource = select.value;
        searchInput.value = '';
        fetchAndRender(currentSource);
    });

    // Початкове завантаження
    fetchAndRender(currentSource);
});
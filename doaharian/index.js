document.addEventListener('DOMContentLoaded', () => {
    const doaList = document.getElementById('doa-list');
    const searchInput = document.getElementById('search-input');

    fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian')
        .then(response => response.json())
        .then(data => {
            displayDoa(data.data);
            setupSearch(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            doaList.innerHTML = '<p class="text-danger">Gagal memuat data doa.</p>';
        });

    function displayDoa(doaData) {
        doaList.innerHTML = '';
        doaData.forEach(doa => {
            const doaCard = document.createElement('div');
            doaCard.className = 'col-md-6 mb-4';
            doaCard.innerHTML = `
                <div class="doa-card">
                    <h5>${doa.title}</h5>
                    <p class="arabic">${doa.arabic}</p>
                    <p class="latin">${doa.latin}</p>
                    <p class="translation">${doa.translation}</p>
                </div>
            `;
            doaList.appendChild(doaCard);
        });
    }

    function setupSearch(doaData) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredDoa = doaData.filter(doa => {
                return doa.title.toLowerCase().includes(searchTerm) ||
                       doa.arabic.includes(searchTerm) ||
                       doa.latin.toLowerCase().includes(searchTerm) ||
                       doa.translation.toLowerCase().includes(searchTerm);
            });
            displayDoa(filteredDoa);
        });
    }
});

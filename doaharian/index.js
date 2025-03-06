document.addEventListener('DOMContentLoaded', () => {
    const doaList = document.getElementById('doa-list');
    const searchInput = document.getElementById('search-input');

    function showLoading() {
        doaList.innerHTML = `
            <div class="col text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }

    function showError(message) {
        doaList.innerHTML = `<p class="text-danger">${message}</p>`;
    }

    function displayDoa(doaData) {
        doaList.innerHTML = '';
        if (doaData.length === 0) {
            showError('Tidak ada doa yang ditemukan.');
            return;
        }
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

    async function fetchData() {
        showLoading();
        try {
            const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayDoa(data.data);
            setupSearch(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Gagal memuat data doa. Silakan coba lagi nanti.');
        }
    }

    fetchData();
});

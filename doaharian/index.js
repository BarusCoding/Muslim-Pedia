document.addEventListener('DOMContentLoaded', () => {
    const doaList = document.getElementById('doa-list');
    const searchInput = document.getElementById('search-input');

    // Fungsi untuk menampilkan indikator loading
    function showLoading() {
        doaList.innerHTML = `
            <div class="col text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }

    // Fungsi untuk menampilkan pesan error
    function showError(message) {
        doaList.innerHTML = `<p class="text-danger">${message}</p>`;
    }

    // Fungsi untuk menampilkan data doa
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

    // Fungsi untuk menangani pencarian
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

    // Fungsi utama untuk mengambil data dan menampilkan halaman
    function fetchData() {
        showLoading(); // Tampilkan loading sebelum fetch

        fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayDoa(data.data);
                setupSearch(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                showError('Gagal memuat data doa. Silakan coba lagi nanti.');
            });
    }

    fetchData(); // Panggil fungsi utama saat halaman dimuat
});

$(document).ready(function () {
    const chatLog = $('#chat-log');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');

    sendButton.click(function () {
        const message = userInput.val().toLowerCase();
        if (message.trim() !== '') {
            chatLog.append(`<p><strong>Anda:</strong> ${message}</p>`);
            userInput.val('');

            // Panggil fungsi untuk mencari jawaban
            cariJawaban(message);
        }
    });

    userInput.keypress(function (event) {
        if (event.which === 13) {
            sendButton.click();
        }
    });

    function cariJawaban(pertanyaan) {
        // Coba cari tafsir terlebih dahulu
        cariTafsir(pertanyaan);
    }

    function cariTafsir(keyword) {
        $.ajax({
            url: `https://equran.id/api/v2/search/${keyword}`, // API Quran Kemenag
            success: function (response) {
                if (response.data.verses.length > 0) {
                    const ayat = response.data.verses[0];
                    chatLog.append(`<p><strong>Ustadz (Tafsir):</strong> ${ayat.text.arab} <br> ${ayat.translation.id}</p>`);
                } else {
                    // Jika tidak ada tafsir, coba cari hadis
                    cariHadis(keyword);
                }
                chatLog.scrollTop(chatLog[0].scrollHeight);
            },
            error: function () {
                chatLog.append(`<p><strong>Ustadz:</strong> Gagal mengambil data tafsir.</p>`);
                chatLog.scrollTop(chatLog[0].scrollHeight);
            }
        });
    }

    function cariHadis(keyword) {
        $.ajax({
            url: `https://api.hadith.sutanlab.id/books/muslim?range=1-10`, // API Hadis Sutan Lab
            success: function (response) {
                const hadisRelevan = response.data.filter(hadis => hadis.contents.toLowerCase().includes(keyword));
                if (hadisRelevan.length > 0) {
                    chatLog.append(`<p><strong>Ustadz (Hadis):</strong> ${hadisRelevan[0].contents}</p>`);
                } else {
                    chatLog.append(`<p><strong>Ustadz:</strong> Maaf, saya tidak menemukan jawaban.</p>`);
                }
                chatLog.scrollTop(chatLog[0].scrollHeight);
            },
            error: function () {
                chatLog.append(`<p><strong>Ustadz:</strong> Gagal mengambil data hadis.</p>`);
                chatLog.scrollTop(chatLog[0].scrollHeight);
            }
        });
    }
});

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
        // Contoh: Menggunakan Hadith API
        $.ajax({
            url: `https://api.hadith.sutanlab.id/books/muslim?range=1-10`, // Contoh endpoint API hadis
            success: function (response) {
                // Logika pencarian hadis yang relevan
                const hadisRelevan = response.data.filter(hadis => hadis.contents.toLowerCase().includes(pertanyaan));
                if (hadisRelevan.length > 0) {
                    chatLog.append(`<p><strong>Ustadz (Hadis):</strong> ${hadisRelevan[0].contents}</p>`);
                } else {
                    // Jika tidak ada hadis yang relevan, coba cari tafsir
                    cariTafsir(pertanyaan);
                }
                chatLog.scrollTop(chatLog[0].scrollHeight);
            },
            error: function () {
                chatLog.append(`<p><strong>Ustadz:</strong> Gagal mengambil data hadis.</p>`);
                chatLog.scrollTop(chatLog[0].scrollHeight);
            }
        });
    }

    function cariTafsir(keyword) {
        $.ajax({
            url: `https://api.quran.com/api/v4/verses/search?q=${keyword}`, // Contoh endpoint API tafsir
            success: function (response) {
                if (response.verses.length > 0) {
                    const ayat = response.verses[0];
                    chatLog.append(`<p><strong>Ustadz (Tafsir):</strong> ${ayat.text_uthmani}</p>`);
                } else {
                    chatLog.append(`<p><strong>Ustadz:</strong> Maaf, saya tidak menemukan jawaban.</p>`);
                }
                chatLog.scrollTop(chatLog[0].scrollHeight);
            },
            error: function () {
                chatLog.append(`<p><strong>Ustadz:</strong> Gagal mengambil data tafsir.</p>`);
                chatLog.scrollTop(chatLog[0].scrollHeight);
            }
        });
    }
});

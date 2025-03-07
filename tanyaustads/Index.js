$(document).ready(function () {
    const chatLog = $('#chat-log');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');

    sendButton.click(function () {
        const message = userInput.val();
        if (message.trim() !== '') {
            chatLog.append(`<p><strong>Anda:</strong> ${message}</p>`);
            userInput.val('');

            // Menggunakan API-Islami untuk mendapatkan jawaban
            $.ajax({
                url: 'https://api.banghasan.com/sholat/format/json/kota/712/tanggal/2023-10-25', // Contoh endpoint (ganti sesuai kebutuhan)
                method: 'GET',
                success: function (response) {
                    // Logika untuk menampilkan jawaban dari API
                    if (response && response.hasil && response.hasil.maghrib) {
                        const jawaban = `Waktu maghrib hari ini adalah ${response.hasil.maghrib}`;
                        chatLog.append(`<p><strong>Ustadz:</strong> ${jawaban}</p>`);
                    } else {
                        chatLog.append(`<p><strong>Ustadz:</strong> Maaf, saya tidak dapat menemukan jawaban.</p>`);
                    }
                    chatLog.scrollTop(chatLog[0].scrollHeight);
                },
                error: function (error) {
                    console.error('Error fetching answer:', error);
                    chatLog.append(`<p><strong>Ustadz:</strong> Maaf, terjadi kesalahan saat menghubungi server.</p>`);
                    chatLog.scrollTop(chatLog[0].scrollHeight);
                }
            });
        }
    });

    userInput.keypress(function (event) {
        if (event.which === 13) {
            sendButton.click();
        }
    });
});

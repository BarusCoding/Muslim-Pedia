$(document).ready(function () {
    const chatLog = $('#chat-log');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');

    sendButton.click(function () {
        const message = userInput.val().toLowerCase(); // Ambil pertanyaan dan ubah ke huruf kecil
        if (message.trim() !== '') {
            chatLog.append(`<p><strong>Anda:</strong> ${message}</p>`);
            userInput.val('');

            // Logika untuk mencari hadis atau tafsir yang relevan
            cariJawaban(message);
        }
    });

    userInput.keypress(function (event) {
        if (event.which === 13) {
            sendButton.click();
        }
    });

    function cariJawaban(pertanyaan) {
        //

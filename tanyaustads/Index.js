// JavaScript untuk halaman Tanya Ustadz
document.addEventListener('DOMContentLoaded', function () {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        const message = userInput.value;
        if (message.trim() !== '') {
            chatLog.innerHTML += `<p><strong>Anda:</strong> ${message}</p>`;
            userInput.value = '';
            // Di sini Anda dapat menambahkan logika untuk mendapatkan jawaban dari "ustadz"
            // Misalnya, dengan menggunakan API atau logika lokal
            chatLog.innerHTML += `<p><strong>Ustadz:</strong> Jawaban dari ustadz...</p>`;
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });

    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});

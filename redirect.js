// redirect.js
window.addEventListener('DOMContentLoaded', () => {

    chrome.storage.local.get("message", function (data) {
        if (data && data.message) {

            const message = data.message;

            const messageContainer = document.getElementById('message-container');

            messageContainer.textContent = message;


            // Clear message from storage for next usage (and after usage is done)
            chrome.storage.local.remove("message");

        }
    });
});
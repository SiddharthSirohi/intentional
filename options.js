function updateStatusDisplay() {
    const checkboxes = document.querySelectorAll('.status-checkbox');
    const statusText = document.getElementById('status-text');

    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

    if (checkboxes.length > 0) {
        const percentage = (checkedCount / checkboxes.length) * 100;
        statusText.textContent = `${checkedCount} of ${checkboxes.length} sites blocked (${percentage.toFixed(0)}%)`;
    } else {
        statusText.textContent = "No sites being monitored.";
    }
}

function saveSettings() {
    const blockedSites = {};
    const siteEntries = document.querySelectorAll('#blocked-sites-container div');

    siteEntries.forEach(entry => {
        const siteKey = entry.querySelector('input[type="text"]:disabled').value;
        const siteValue = entry.querySelector('input[type="text"]:not(:disabled)').value;
        const siteStatus = entry.querySelector('.status-checkbox').checked;

        blockedSites[siteKey] = {
            'message': siteValue,
            'status': siteStatus
        };
    });

    chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
        alert('Settings saved!');
    });
}

function loadSettings() {
    chrome.storage.sync.get('blockedSites', function (data) {
        const blockedSites = data.blockedSites || {};

        const container = document.getElementById('blocked-sites-container');
        container.innerHTML = ''; // Clear before loading

        for (const site in blockedSites) {
            createSiteEntry(site, blockedSites[site]['message'], container, blockedSites[site]['status']);
        }

        updateStatusDisplay(); //added
    });
}

function createSiteEntry(site, message, container, status = true) {
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="checkbox" class="status-checkbox" ${status ? 'checked' : ''}>
        <input type="text" value="${site}" disabled>
        <input type="text" value="${message}">
        <button class="remove-button">Remove</button>
    `;
    container.appendChild(div);

    const removeButton = div.querySelector('.remove-button');
    removeButton.onclick = function () {
        div.remove();
        updateStatusDisplay();
    };

    const statusCheckbox = div.querySelector('.status-checkbox');
    statusCheckbox.addEventListener('change', updateStatusDisplay);
}

function showAddSiteInputs() {
    const siteInputDiv = document.getElementById('site-input');
    if (siteInputDiv.style.display === 'none') {
        siteInputDiv.style.display = 'block';
    } else {
        siteInputDiv.style.display = 'none';
    }
}

function addNewSite() {
    const newSiteInput = document.getElementById('new-site-input');
    const newMessageInput = document.getElementById('new-message-input');

    const newSite = newSiteInput.value.trim();
    const newMessage = newMessageInput.value;

    if (!isValidURL(newSite)) {
        alert('Please enter a valid website URL.');
        return;
    }

    if (newSite && newMessage) {
        const container = document.getElementById('blocked-sites-container');
        createSiteEntry(newSite, newMessage, container);

        newSiteInput.value = '';
        newMessageInput.value = '';

        document.getElementById('site-input').style.display = 'none';
    }
}

function isValidURL(urlString) {
    const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    return urlPattern.test(urlString);
}

document.addEventListener('DOMContentLoaded', function () {
    loadSettings();
    document.getElementById('add-site-button').onclick = showAddSiteInputs;
    document.getElementById('add-button').onclick = addNewSite;
    document.getElementById('save-button').onclick = saveSettings;
});
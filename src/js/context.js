chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'annotate',
        title: 'Annotate Selected Text',
        contexts: ['selection'],
    });

    chrome.contextMenus.create({
        id: 'highlightOnDomain',
        title: 'Highlight Annotated Text on Domain',
        contexts: ['all'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'annotate') {
        const selectedText = info.selectionText.trim();

        if (selectedText) {
            chrome.tabs.sendMessage(tab.id, { action: 'annotate', text: selectedText });
        }
    } else if (info.menuItemId === 'highlightOnDomain') {
        chrome.tabs.sendMessage(tab.id, { action: 'highlightOnDomain' });
    }
});

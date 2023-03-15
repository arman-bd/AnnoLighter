// Wrap the annotation functionality in a function
function annotateSelectedText(selectedText) {
  const highlight = document.createElement('mark');
  highlight.className = 'custom-highlight';
  highlight.textContent = selectedText;

  const range = window.getSelection().getRangeAt(0);
  range.deleteContents();
  range.insertNode(highlight);

  const highlightData = {
    url: window.location.href,
    text: selectedText,
    timestamp: Date.now(),
  };

  chrome.storage.local.set({ [highlightData.timestamp]: highlightData });
}

// Listen for messages from the popup and context scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'annotate') {
    annotateSelectedText(message.text);
  } else if (message.action === 'highlightOnDomain') {
    chrome.storage.local.get(null, (annotations) => {
      highlightAnnotationsOnDomain(annotations);
    });
  }
});


// Annotate the selected text when the mouse button is released
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    annotateSelectedText(selectedText);
  }
});

// New function to highlight previously annotated text on the current domain
function highlightAnnotationsOnDomain(annotations) {
  for (const key in annotations) {
    const annotation = annotations[key];
    if (window.location.href.includes(annotation.url)) {
      const bodyText = document.body.innerHTML;
      const regex = new RegExp(`(${annotation.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
      document.body.innerHTML = bodyText.replace(regex, '<mark class="custom-highlight">$1</mark>');
    }
  }
}

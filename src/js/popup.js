chrome.storage.local.get(null, (annotations) => {
    const annotationsDiv = document.getElementById('annotations');

    for (const key in annotations) {
        const annotation = annotations[key];
        const annotationElement = document.createElement('div');
        annotationElement.className = 'annotation-container';
        annotationElement.innerHTML = `
        <div class="annotation-header">
          <h2>Annotation</h2>
          <div class="annotation-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
        <div class="annotation-text">${annotation.text}</div>
        <div class="annotation-url">${annotation.url}</div>
      `;

        annotationsDiv.appendChild(annotationElement);

        const editButton = annotationElement.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit annotation text:', annotation.text);
            if (newText && newText.trim() !== '') {
                annotation.text = newText.trim();
                chrome.storage.local.set({ [key]: annotation }, () => {
                    annotationElement.querySelector('.annotation-text').textContent = newText;
                });
            }
        });

        const deleteButton = annotationElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            chrome.storage.local.remove(key, () => {
                annotationElement.remove();
            });
        });
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    chrome.storage.local.get(null, (annotations) => {
        const annotationsArray = Object.values(annotations);
        const fileContent = JSON.stringify(annotationsArray, null, 2);
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        a.click();
        URL.revokeObjectURL(url);
    });
});

document.getElementById('highlight-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'highlightOnDomain' });
    });
});

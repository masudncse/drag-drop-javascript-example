document.addEventListener('DOMContentLoaded', () => {
    const draggableList = document.getElementById('draggable-list');
    const dropArea = document.getElementById('drop-area');
  
    let fields = []; // Temporary in-memory store for fields.json
  
    // Load draggable elements from elements.json
    fetch('elements.json')
      .then(response => response.json())
      .then(elements => {
        elements.forEach(element => {
          const li = document.createElement('li');
          li.className = 'draggable bg-blue-500 text-white px-4 py-2 rounded shadow';
          li.draggable = true;
          li.dataset.id = element.id;
          li.innerText = element.label;
          draggableList.appendChild(li);
        });
      });
  
    // Add drag and drop events
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('droppable');
    });
  
    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('droppable');
    });
  
    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('droppable');
  
      const id = e.dataTransfer.getData('text/plain');
      const draggedElement = document.querySelector(`[data-id="${id}"]`);
      if (!draggedElement) return;
  
      // Generate a unique random ID
      const uniqueId = generateRandomId();
  
      // Create a dropped item container
      const droppedItem = document.createElement('div');
      droppedItem.className = 'dropped-item flex items-center gap-4 mb-4 p-2 border rounded';
  
      // Editable Label
      const labelElement = document.createElement('span');
      labelElement.className = 'font-bold editable-label px-3 py-1';
      labelElement.contentEditable = true; // Make the label editable
      labelElement.innerText = draggedElement.innerText;
  
      // Input
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter value...';
      input.className = 'border px-2 py-1 rounded flex-1';
  
      // Update label on blur (when the user finishes editing)
      labelElement.addEventListener('blur', () => {
        const updatedLabel = labelElement.innerText;
        const fieldIndex = fields.findIndex(field => field.uniqueId === uniqueId);
        if (fieldIndex > -1) {
          fields[fieldIndex].label = updatedLabel;
          console.log('Updated fields:', fields);
        }
      });
  
      // Update input value on change
      input.addEventListener('input', () => {
        const updatedValue = input.value;
        const fieldIndex = fields.findIndex(field => field.uniqueId === uniqueId);
        if (fieldIndex > -1) {
          fields[fieldIndex].value = updatedValue;
          console.log('Updated fields:', fields);
        }
      });
  
      // Append elements to the dropped item container
      droppedItem.appendChild(labelElement);
      droppedItem.appendChild(input);
  
      // Append the dropped item to the drop area
      dropArea.appendChild(droppedItem);
  
      // Add the dropped field to the array with initial values
      fields.push({ uniqueId, label: draggedElement.innerText, value: '' });
    });
  
    // Handle drag start
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('draggable')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
      }
    });
  });
  
  // Generate a random unique ID
  function generateRandomId() {
    return `field_${Math.random().toString(36).substr(2, 9)}`;
  }
  
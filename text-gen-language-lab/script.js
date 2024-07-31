document.addEventListener('DOMContentLoaded', function() {
  const dataList = document.getElementById('dataList');
  const addDataRowBtn = document.getElementById('addDataRowBtn');
  const clearDataBtn = document.getElementById('clearDataBtn');
  const code = document.getElementById('code');
  const submitBtn = document.getElementById('submitBtn');
  const resultText = document.getElementById('resultText');

  const codeTextarea = document.getElementById('code');
  const saveBtn = document.getElementById('saveBtn');
  const saveModal = document.getElementById('saveModal');
  const closeModalBtn = document.querySelector('#close-save');
  const closeDesc = document.querySelector('#close-desc');
  const saveCodeBtn = document.getElementById('saveCodeBtn');
  const codeNameInput = document.getElementById('codeName');
  const codeDescriptionInput = document.getElementById('codeDescription');
  const savedCodesList = document.getElementById('savedCodesList');
  const descModal = document.getElementById('descModal');
  const descTitle = document.getElementById('desc-title');
  const desc = document.getElementById('desc');

  let data = {};

  // Add event listener for adding a data row
  addDataRowBtn.addEventListener('click', function() {
    const newRow = createDataRow();
    dataList.appendChild(newRow);
  });

  // Function to create a new data row with key and value inputs
  function createDataRow() {
    const row = document.createElement('div');
    row.className = 'data-row';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Enter data key';
    row.appendChild(keyInput);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Enter data value';
    row.appendChild(valueInput);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&#128465;'; // Unicode for trash can icon
    deleteBtn.className = "delete-btn"
    deleteBtn.addEventListener('click', function() {
      row.remove();
    });
    row.appendChild(deleteBtn);

    return row;
  }

  // Event listener for clearing all data rows
  clearDataBtn.addEventListener('click', function() {
    dataList.innerHTML = ''; // Clear all data rows
  });

  // Event listener for submitting the code
  submitBtn.addEventListener('click', function() {
    // Gather data from all data rows
    data = {};
    const dataRows = dataList.getElementsByClassName('data-row');
    Array.from(dataRows).forEach(row => {
      const keyInput = row.querySelector('input:nth-child(1)');
      const valueInput = row.querySelector('input:nth-child(2)');
      if (keyInput.value.trim() && valueInput.value.trim()) {
        data[keyInput.value.trim()] = valueInput.value.trim();
      }
    });

    const code = document.getElementById('code').value.trim();
    if (code) {
      const result = parseCode(code, data);
      resultText.textContent = result;
    }
  });

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  // Function to show a toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
  }

  // Open modal
  saveBtn.addEventListener('click', function() {
    saveModal.style.display = 'block';
  });

// Close modal
closeModalBtn.addEventListener('click', function() {
    saveModal.style.display = 'none';
});

closeDesc.addEventListener('click', function() {
  descModal.style.display = 'none';
});

// Save code
saveCodeBtn.addEventListener('click', function() {
    const code = codeTextarea.value;
    const name = codeNameInput.value;
    const description = codeDescriptionInput.value;

    if (code && name) {
        const savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
        const newCode = {
            code,
            name,
            description,
            timestamp: new Date().getTime()
        };
        
        savedCodes.unshift(newCode);
        if (savedCodes.length > 100) {
            savedCodes.pop();
        }

        localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
        displaySavedCodes();
        saveModal.style.display = 'none';
        codeNameInput.value = '';
        codeDescriptionInput.value = '';
    }
});

// Display saved codes
function displaySavedCodes() {
    const savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
    savedCodesList.innerHTML = '';

    savedCodes.forEach((codeObj) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const pre = document.createElement('pre');
        const span = document.createElement('span');
        const infoIcon = document.createElement('span');

        div.textContent = codeObj.name;
        div.style.cursor = 'pointer';
        div.classList.add('code-name');
        
        infoIcon.innerHTML = '&nbsp;&#9432;'; // Unicode for info circle icon
        infoIcon.classList.add('info-circle');
        //infoIcon.dataset.description = codeObj.description;

        infoIcon.onclick = () => {
          descTitle.innerText = codeObj.name
          desc.innerText = codeObj.description
          descModal.style.display = 'block';
        }
        
        div.appendChild(infoIcon);

        pre.textContent = codeObj.code;
        span.innerHTML = '&nbsp;&#128196;';
        span.className = 'copy';
        span.dataset.copy = codeObj.code;

        pre.appendChild(span);
        li.appendChild(div);
        li.appendChild(pre);
        savedCodesList.appendChild(li);

        span.addEventListener('click', function() {
            navigator.clipboard.writeText(span.dataset.copy).then(() => {
                code.value = span.dataset.copy
                showToast('Code copied to clipboard');
            });
        });
    });
}

//Add code samples if not present
const savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
if(savedCodes.length == 0) {
  savedCodes.push({
    code: `P<USA({Surname_Name.text})<<({Given_Name_name.text[w1]})(<{Given_Name_name.text[w2]})(<**44)`,
    name: "Passport Code 1",
    description: "Code for US International Passport at bottom on line 1",
    timestamp: new Date().getTime()
  })

  savedCodes.push({
    code: `({Passport_Id.text})(rn[2d])USA(rn[7d])M(rn[16d])<(rn[6d])`,
    name: "Passport Code 2",
    description: "Code for US International Passport at bottom on line 2",
    timestamp: new Date().getTime()
  })

  savedCodes.push({
    code: `P<USA({Surname_Name.text})<<(<{Given_Name_name.text[w2]})(<**45)(|*7)<(rn[2,10])<(rn[4d,16d])`,
    name: "Code displaying all functions",
    description: "This code shows all or most of the native functions in language",
    timestamp: new Date().getTime()
  })

  localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
}
// Initial display of saved codes
displaySavedCodes();
});
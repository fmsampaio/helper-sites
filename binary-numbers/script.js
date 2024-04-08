document.addEventListener('DOMContentLoaded', function () {
    const binaryTable = document.getElementById('binaryTable');
    const addRowBtn = document.getElementById('addRowBtn');
    const removeRowBtn = document.getElementById('removeRowBtn');
  
    addRowBtn.addEventListener('click', function () {
      addNewRow();
      updateRemoveButtonState();
    });
  
    removeRowBtn.addEventListener('click', function () {
      removeLastRow();
      updateRemoveButtonState();
    });
  
    // Iniciar com cálculos
    updateDecimalValues();
    updateBinaryValues();

    addNewRow();
    updateRemoveButtonState();
  
    // Função para adicionar uma nova linha à tabela
    function addNewRow() {
      const newRow = document.createElement('tr');
      for (let i = 7; i >= 0; i--) {
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function () {
          updateDecimalValues();
          updateBinaryValues();
        });
        checkboxCell.appendChild(checkbox);
        newRow.appendChild(checkboxCell);
      }
      const decimalResultCell = document.createElement('td');
      decimalResultCell.className = 'decimalResult';
      decimalResultCell.textContent = '0';
      newRow.appendChild(decimalResultCell);
  
      const binaryResultCell = document.createElement('td');
      binaryResultCell.className = 'binaryResult';
      binaryResultCell.textContent = '0';
      newRow.appendChild(binaryResultCell);
  
      binaryTable.appendChild(newRow);
    }
  
    // Função para remover a última linha da tabela
    function removeLastRow() {
      const rows = binaryTable.querySelectorAll('tr');
      if (rows.length > 1) { // Mantenha pelo menos uma linha de conversão
        binaryTable.removeChild(rows[rows.length - 1]);
      }
    }
  
    // Função para atualizar o estado do botão de remoção
    function updateRemoveButtonState() {
      const rows = binaryTable.querySelectorAll('tr');
      removeRowBtn.disabled = rows.length <= 1;
    }
  
    // Função para atualizar os valores decimais de todas as linhas
    function updateDecimalValues() {
      const rows = binaryTable.querySelectorAll('tr');
      rows.forEach(row => {
        let decimalValue = 0;
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, bitIndex) => {
          if (checkbox.checked) {
            decimalValue += Math.pow(2, 7 - bitIndex);
          }
        });
        const decimalResultCell = row.querySelector('.decimalResult');
        decimalResultCell.textContent = decimalValue;
      });
    }
  
    // Função para atualizar os valores binários de todas as linhas
    function updateBinaryValues() {
      const rows = binaryTable.querySelectorAll('tr');
      rows.forEach(row => {
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        let binaryValue = '';
        checkboxes.forEach(checkbox => {
          binaryValue += checkbox.checked ? '1' : '0';
        });
        const binaryResultCell = row.querySelector('.binaryResult');
        binaryResultCell.textContent = binaryValue;
      });
    }
  });
  
document.addEventListener('DOMContentLoaded', function () {
  const hillForm = document.getElementById('hillForm');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');
  const resultInput = document.getElementById('ket_qua');
  let encryptFunction = hill2x2Encrypt;
  let decryptFunction = hill2x2Decrypt;


  hillForm.addEventListener('submit', function (event) {
    event.preventDefault();


    const plainTextInput = document.querySelector('.form-input[type="text"]');
    const fileInput = document.querySelector('.form-input[type="file"]');
    const keyMatrixInput = document.getElementById('keyMatrixInput');

    const plaintext = plainTextInput.value;
    const keyMatrix = keyMatrixInput.value;

    function validateKey(keyMatrixArray) {
      if (keyMatrixArray.length !== 4) {
        alert('Khóa bị sai định dạng');
        return false;
      }
      for (let i = 0; i < keyMatrixArray.length; i++) {
        if (!Number.isInteger(keyMatrixArray[i])) {
          alert('Khóa cần phải là số nguyên');
          return false;
        }
      }
      return true;
    }
    
    const keyMatrixArray = keyMatrix.split(",").map(value => parseInt(value.trim()));
    if (!validateKey(keyMatrixArray)) {
      return;
    }
    if ((plaintext || (fileInput.files.length > 0 && fileInput.files[0])) && keyMatrixArray.length === 4) {
      let inputText = plaintext;

      if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          inputText = event.target.result;
          if (encryptButton.classList.contains('active')) {
            const encryptedText = hill2x2Encrypt(inputText, keyMatrix);
            downloadFile(encryptedText, 'maHoaHill.txt');
          } else if (decryptButton.classList.contains('active')) {
            const decryptedText = hill2x2Decrypt(inputText, keyMatrix);
            downloadFile(decryptedText, 'giaiMaHill.txt');
          }

        };

        reader.readAsText(fileInput.files[0]);
      } else {
        if (encryptButton.classList.contains('active')) {
          const encryptedText = hill2x2Encrypt(inputText, keyMatrix);
          resultInput.value = encryptedText;
        } else if (decryptButton.classList.contains('active')) {
          const decryptedText = hill2x2Decrypt(inputText, keyMatrix);
          resultInput.value = decryptedText;
        }

      }
    } else {
      alert('Vui lòng nhập plaintext hoặc tải file và nhập keyMatrix trước khi thực hiện.');
    }
  });

  encryptButton.addEventListener('click', function () {
    encryptButton.classList.add('active');
    decryptButton.classList.remove('active');
  });

  decryptButton.addEventListener('click', function () {
    encryptButton.classList.remove('active');
    decryptButton.classList.add('active');
  });

  function hill2x2Encrypt(plainText, key) {

    const keyMatrix = key.split(',').map(Number);
    const matrix = [
      [keyMatrix[0], keyMatrix[1]],
      [keyMatrix[2], keyMatrix[3]]
    ];

    const textPairs = plainText.toUpperCase().match(/.{2}/g);

    const encryptedPairs = textPairs.map(pair => {
      const char1 = pair.charCodeAt(0) - 65;
      const char2 = pair.charCodeAt(1) - 65;

      const result1 = (char1 * matrix[0][0] + char2 * matrix[1][0]) % 26;
      const result2 = (char1 * matrix[0][1] + char2 * matrix[1][1]) % 26;

      return String.fromCharCode(result1 + 65, result2 + 65);
    });

    return encryptedPairs.join('');
  }

  function hill2x2Decrypt(encryptedText, key) {

    const keyMatrix = key.split(',').map(Number);
    const matrix = [
      [keyMatrix[0], keyMatrix[1]],
      [keyMatrix[2], keyMatrix[3]]
    ];

    const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;

    let multiplicativeInverse = -1;
    for (let i = 0; i < 26; i++) {
      if ((det * i) % 26 === 1) {
        multiplicativeInverse = i;
        break;
      }
    }

    if (multiplicativeInverse === -1) {
      return "Không thể giải mã với keyMatrix này";
    }

    const inverseMatrix = [
      [(matrix[1][1] * multiplicativeInverse) % 26, (-matrix[0][1] * multiplicativeInverse + 26) % 26],
      [(-matrix[1][0] * multiplicativeInverse + 26) % 26, (matrix[0][0] * multiplicativeInverse) % 26]
    ];

    const textPairs = encryptedText.toUpperCase().match(/.{2}/g);

    const decryptedPairs = textPairs.map(pair => {
      const char1 = pair.charCodeAt(0) - 65;
      const char2 = pair.charCodeAt(1) - 65;

      const result1 = (char1 * inverseMatrix[0][0] + char2 * inverseMatrix[1][0]) % 26;
      const result2 = (char1 * inverseMatrix[0][1] + char2 * inverseMatrix[1][1]) % 26;

      return String.fromCharCode(result1 + 65, result2 + 65);
    });

    return decryptedPairs.join('');
  }

  function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1;
  }


  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
});

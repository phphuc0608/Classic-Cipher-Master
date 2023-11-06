document.addEventListener('DOMContentLoaded', function () {
  const vigenereForm = document.getElementById('vigenereForm');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');

  vigenereForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn nạp lại trang sau khi submit

    // Lấy giá trị từ các input
    const plainTextInput = document.querySelector('.form-input[type="text"]');
    const fileInput = document.querySelector('.form-input[type="file"]');
    const keywordInput = document.querySelector('.form-input[type="text"][style="width: 100%"]');

    const plaintext = plainTextInput.value;
    const keyword = keywordInput.value;

    if ((plaintext || (fileInput.files.length > 0 && fileInput.files[0])) && keyword) {
      let inputText = plaintext;

      if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          inputText = event.target.result;
          if (encryptButton.classList.contains('active')) {
            const encryptedText = vigenereEncrypt(inputText, keyword);
            downloadFile(encryptedText, 'maHoaVigenere.txt');
          } else if (decryptButton.classList.contains('active')) {
            const decryptedText = vigenereDecrypt(inputText, keyword);
            downloadFile(decryptedText, 'giaiMaVigenere.txt');
          }
        };

        reader.readAsText(fileInput.files[0]);
      } else {
        if (encryptButton.classList.contains('active')) {
          const encryptedText = vigenereEncrypt(inputText, keyword);
          downloadFile(encryptedText, 'maHoaVigenere.txt');
        } else if (decryptButton.classList.contains('active')) {
          const decryptedText = vigenereDecrypt(inputText, keyword);
          downloadFile(decryptedText, 'giaiMaVigenere.txt');
        }
      }
    } else {
      alert('Vui lòng nhập plaintext hoặc tải file và keyword trước khi thực hiện.');
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

  function vigenereEncrypt(plaintext, keyword) {
    if (!plaintext || !keyword) {
      return 'Vui lòng nhập plaintext và keyword.';
    }

    plaintext = plaintext.toUpperCase();
    keyword = keyword.toUpperCase();
    const plaintextLength = plaintext.length;
    const keywordLength = keyword.length;
    let encryptedText = '';

    for (let i = 0; i < plaintextLength; i++) {
      const plaintextChar = plaintext[i];
      if (plaintextChar >= 'A' && plaintextChar <= 'Z') {
        const plaintextCharCode = plaintextChar.charCodeAt(0) - 'A'.charCodeAt(0);
        const keywordChar = keyword[i % keywordLength];
        const keywordCharCode = keywordChar.charCodeAt(0) - 'A'.charCodeAt(0);
        const encryptedCharCode = (plaintextCharCode + keywordCharCode) % 26 + 'A'.charCodeAt(0);
        encryptedText += String.fromCharCode(encryptedCharCode);
      } else {
        encryptedText += plaintextChar;
      }
    }

    return encryptedText;
  }
  function vigenereDecrypt(ciphertext, keyword) {
    if (!ciphertext || !keyword) {
      return 'Vui lòng nhập ciphertext và keyword.';
    }

    ciphertext = ciphertext.toUpperCase();
    keyword = keyword.toUpperCase();
    const ciphertextLength = ciphertext.length;
    const keywordLength = keyword.length;
    let decryptedText = '';

    for (let i = 0; i < ciphertextLength; i++) {
      const ciphertextChar = ciphertext[i];
      if (ciphertextChar >= 'A' && ciphertextChar <= 'Z') {
        const ciphertextCharCode = ciphertextChar.charCodeAt(0) - 'A'.charCodeAt(0);
        const keywordChar = keyword[i % keywordLength];
        const keywordCharCode = keywordChar.charCodeAt(0) - 'A'.charCodeAt(0);
        const decryptedCharCode = (ciphertextCharCode - keywordCharCode + 26) % 26 + 'A'.charCodeAt(0);
        decryptedText += String.fromCharCode(decryptedCharCode);
      } else {
        decryptedText += ciphertextChar;
      }
    }

    return decryptedText;
  }

  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
});

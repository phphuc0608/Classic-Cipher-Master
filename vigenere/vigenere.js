document.addEventListener('DOMContentLoaded', function () {
  const vigenereForm = document.getElementById('vigenereForm');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');
  const resultElement = document.getElementById('ket_qua');

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
          resultElement.value = encryptedText;
        } else if (decryptButton.classList.contains('active')) {
          const decryptedText = vigenereDecrypt(inputText, keyword);
          resultElement.value = decryptedText;
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
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let encryptedText = '';

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      if (alphabet.includes(char)) {
        const plaintextIndex = alphabet.indexOf(char);
        const keywordChar = keyword[i % keyword.length].toUpperCase();
        const keywordIndex = alphabet.indexOf(keywordChar);
        const encryptedChar = alphabet[(plaintextIndex + keywordIndex) % alphabet.length];
        encryptedText += encryptedChar;
      } else {
        encryptedText += char;
      }
    }

    return encryptedText;
  }
  
  function vigenereDecrypt(encryptedText, keyword) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let decryptedText = '';

    for (let i = 0; i < encryptedText.length; i++) {
      const char = encryptedText[i].toUpperCase();
      if (alphabet.includes(char)) {
        const encryptedTextIndex = alphabet.indexOf(char);
        const keywordChar = keyword[i % keyword.length].toUpperCase();
        const keywordIndex = alphabet.indexOf(keywordChar);
        const decryptedChar = alphabet[(encryptedTextIndex - keywordIndex + alphabet.length) % alphabet.length];
        decryptedText += decryptedChar;
      } else {
        decryptedText += char;
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

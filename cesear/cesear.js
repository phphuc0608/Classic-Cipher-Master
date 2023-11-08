document.addEventListener('DOMContentLoaded', function () {
  const cesearForm = document.getElementById('cesearForm');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');

  cesearForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const plainTextInput = document.querySelector('.form-input[type="text"]');
    const fileInput = document.querySelector('.form-input[type="file"]');
    const keyInput = document.querySelector('.form-input[type="text"][style="width: 100%"]');

    const plaintext = plainTextInput.value;
    const key = keyInput.value;

    if ((plaintext || (fileInput.files.length > 0 && fileInput.files[0])) && key) {
      let inputText = plaintext;

      if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          inputText = event.target.result;
          if (encryptButton.classList.contains('active')) {
            const encryptedText = cesearEncrypt(inputText, key);
            downloadFile(encryptedText, 'maHoaCesear.txt');
          } else if (decryptButton.classList.contains('active')) {
            const decryptedText = cesearDecrypt(inputText, key);
            downloadFile(decryptedText, 'giaiMaCesear.txt');
          }
        };

        reader.readAsText(fileInput.files[0]);
      } else {
        if (encryptButton.classList.contains('active')) {
          const encryptedText = cesearEncrypt(inputText, key);
          downloadFile(encryptedText, 'maHoaCesear.txt');
        } else if (decryptButton.classList.contains('active')) {
          const decryptedText = cesearDecrypt(inputText, key);
          downloadFile(decryptedText, 'giaiMaCesear.txt');
        }
      }
    } else {
      alert('Vui lòng nhập plaintext hoặc tải file và key trước khi thực hiện.');
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

  function cesearEncrypt(plaintext, key) {
    key = parseInt(key);

    if (isNaN(key)) {
      throw new Error('Key phải là một số nguyên.');
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let encryptedText = '';

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i];

      if (alphabet.includes(char.toLowerCase())) {
        const isUpperCase = char === char.toUpperCase();
        const charIndex = alphabet.indexOf(char.toLowerCase());
        const encryptedIndex = (charIndex + key) % 26;
        const encryptedChar = alphabet.charAt(encryptedIndex);

        encryptedText += isUpperCase ? encryptedChar.toUpperCase() : encryptedChar;
      } else {
        encryptedText += char;
      }
    }

    return encryptedText;
  }

  function cesearDecrypt(ciphertext, key) {
    key = parseInt(key);

    if (isNaN(key)) {
      throw new Error('Key phải là một số nguyên.');
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let decryptedText = '';

    for (let i = 0; i < ciphertext.length; i++) {
      const char = ciphertext[i];

      if (alphabet.includes(char.toLowerCase())) {
        const isUpperCase = char === char.toUpperCase();
        const charIndex = alphabet.indexOf(char.toLowerCase());
        const decryptedIndex = (charIndex - key + 26) % 26;
        const decryptedChar = alphabet.charAt(decryptedIndex);

        decryptedText += isUpperCase ? decryptedChar.toUpperCase() : decryptedChar;
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

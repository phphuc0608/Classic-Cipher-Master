document.addEventListener('DOMContentLoaded', function () {
  const affineForm = document.getElementById('affineForm');
  const encryptButton = document.getElementById('encryptButton');
  const decryptButton = document.getElementById('decryptButton');
  const resultInput = document.getElementById('ket_qua');

  affineForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const plainTextInput = document.querySelector('.form-input[type="text"]');
    const fileInput = document.querySelector('.form-input[type="file"]');
    const keyInput = document.querySelector('.form-input[type="text"][style="width: 100%"]');

    const plaintext = plainTextInput.value;
    const key = keyInput.value;

    const keyParts = key.split(' ').map(Number);

    if (keyParts.length !== 2) {
      alert('Nhập sai định dạng khóa');
      return;
    } else if (keyParts[0] >= keyParts[1]) {
      alert('Nhập sai định dạng khóa');
      return;
    } else if (!Number.isInteger(keyParts[0])) {
      alert('Khóa phải là cặp số nguyên');
      return;
    } else if (!Number.isInteger(keyParts[1])) {
      alert('Khóa phải là cặp số nguyên');
      return;
    }
    if ((plaintext || (fileInput.files.length > 0 && fileInput.files[0])) && key) {
      let inputText = plaintext;

      if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          inputText = event.target.result;
          if (encryptButton.classList.contains('active')) {
            const encryptedText = affineEncrypt(inputText, key);
            downloadFile(encryptedText, 'maHoaAffine.txt');
          } else if (decryptButton.classList.contains('active')) {
            const decryptedText = affineDecrypt(inputText, key);
            downloadFile(decryptedText, 'giaiMaAffine.txt');
          }
        };

        reader.readAsText(fileInput.files[0]);
      } else {
        if (encryptButton.classList.contains('active')) {
          const encryptedText = affineEncrypt(inputText, key);
          resultInput.value = encryptedText;
        } else if (decryptButton.classList.contains('active')) {
          const decryptedText = affineDecrypt(inputText, key);
          resultInput.value = decryptedText;
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

  function affineEncrypt(plaintext, key) {
    // Chuyển key thành mảng số nguyên
    const [a, b] = key.split(' ').map(Number);

    // Kiểm tra tính hợp lệ của key
    if (isNaN(a) || isNaN(b)) {
      throw new Error('Khóa không hợp lệ');
    }

    let encryptedText = '';

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i];

      if (char.match(/[a-z]/i)) {
        // Mã hóa ký tự chữ cái
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
        const encryptedCharCode = (a * charCode + b) % 26;
        const encryptedChar = String.fromCharCode(encryptedCharCode + 'a'.charCodeAt(0));

        encryptedText += isUpperCase ? encryptedChar.toUpperCase() : encryptedChar;
      } else {
        // Giữ nguyên các ký tự không phải chữ cái
        encryptedText += char;
      }
    }

    return encryptedText;
  }

  function affineDecrypt(ciphertext, key) {
    // Chuyển key thành mảng số nguyên
    const [a, b] = key.split(' ').map(Number);

    // Tìm nghịch đảo của a trong modulo 26
    let aInverse = -1;
    for (let i = 0; i < 26; i++) {
      if ((a * i) % 26 === 1) {
        aInverse = i;
        break;
      }
    }

    // Kiểm tra tính hợp lệ của key
    if (isNaN(a) || isNaN(b) || aInverse === -1) {
      throw new Error('Khóa không hợp lệ');
    }

    let decryptedText = '';

    for (let i = 0; i < ciphertext.length; i++) {
      const char = ciphertext[i];

      if (char.match(/[a-z]/i)) {
        // Giải mã ký tự chữ cái
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
        // Sử dụng nghịch đảo của a để giải mã
        const decryptedCharCode = (aInverse * (charCode - b + 26)) % 26;
        const decryptedChar = String.fromCharCode(decryptedCharCode + 'a'.charCodeAt(0));

        decryptedText += isUpperCase ? decryptedChar.toUpperCase() : decryptedChar;
      } else {
        // Giữ nguyên các ký tự không phải chữ cái
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
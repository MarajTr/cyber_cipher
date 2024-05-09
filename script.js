const bgAnimation = document.getElementById('bgAnimation');

const numberOfColorBoxes = 400;

for (let i = 0; i < numberOfColorBoxes; i++) {
    const colorBox = document.createElement('div');
    colorBox.classList.add('colorBox');
    bgAnimation.append(colorBox);
}

// additive shift left- right
function encrypt() {
    const text = document.getElementById('inputText').value.toUpperCase();
    const additiveKey = parseInt(document.getElementById('additiveKey').value) % 26;
    const shiftKey = parseInt(document.getElementById('shiftKey').value) % text.length;

    let additiveCipher = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char >= 'A' && char <= 'Z') {
            additiveCipher += String.fromCharCode((char.charCodeAt(0) - 65 + additiveKey) % 26 + 65);
        } else {
            additiveCipher += char;
        }
    }

    let finalCipher = additiveCipher.substring(shiftKey) + additiveCipher.substring(0, shiftKey);
    document.getElementById('cipherText').value = finalCipher;
}

function decrypt() {
    const cipherText = document.getElementById('cipherText').value.toUpperCase();
    const additiveKey = parseInt(document.getElementById('additiveKey').value) % 26;
    const shiftKey = parseInt(document.getElementById('shiftKey').value) % cipherText.length;

    let shiftedText = cipherText.substring(cipherText.length - shiftKey) + cipherText.substring(0, cipherText.length - shiftKey);

    let decryptedText = '';
    for (let i = 0; i < shiftedText.length; i++) {
        const char = shiftedText[i];
        if (char >= 'A' && char <= 'Z') {
            decryptedText += String.fromCharCode((char.charCodeAt(0) - 65 - additiveKey + 26) % 26 + 65);
        } else {
            decryptedText += char;
        }
    }

    document.getElementById('decryptedText').value = decryptedText;
}

//Multiplecative inverse
function performMultiplicativeEncryption() {
    var plaintext = document.getElementById("multiplicativePlaintext").value;
    var key = parseInt(document.getElementById("multiplicativeKey").value);
    
    var encryptedText = multiplicativeCipherEncrypt(plaintext, key);
    
    document.getElementById("multiplicativeResult").value = encryptedText;
}

function performMultiplicativeDecryption() {
    var ciphertext = document.getElementById("multiplicativePlaintext").value;
    var key = parseInt(document.getElementById("multiplicativeKey").value);
    
    var decryptedText = multiplicativeCipherDecrypt(ciphertext, key);
    
    document.getElementById("multiplicativeResult").value = decryptedText;
}

function multiplicativeCipherEncrypt(plaintext, key) {
    var domain = 26;
    var string = "abcdefghijklmnopqrstuvwxyz";
    var cipher = "";

    for (var i = 0; i < plaintext.length; i++) {
        var char = plaintext[i].toLowerCase();
        var index = string.indexOf(char);

        if (index !== -1) {
            var encryptedIndex = (index * key) % domain;
            cipher += string[encryptedIndex];
        } else {
            cipher += char; // Keep non-alphabetic characters unchanged
        }
    }

    return cipher;
}

function multiplicativeCipherDecrypt(ciphertext, key) {
    var domain = 26;
    var string = "abcdefghijklmnopqrstuvwxyz";
    var plaintext = "";

    // Calculate multiplicative inverse of key modulo domain
    var t1 = multiplicativeInverse(key, domain);

    for (var i = 0; i < ciphertext.length; i++) {
        var char = ciphertext[i].toLowerCase();
        var index = string.indexOf(char);

        if (index !== -1) {
            // Decrypt using the multiplicative inverse
            var decryptedIndex = (index * t1) % domain;
            plaintext += string[decryptedIndex];
        } else {
            plaintext += char; // Keep non-alphabetic characters unchanged
        }
    }

    return plaintext;
}

function multiplicativeInverse(key, domain) {
    // Extended Euclidean Algorithm to find the multiplicative inverse of key modulo domain
    var r1 = domain;
    var r2 = key;
    var t1 = 0;
    var t2 = 1;

    while (r2 > 0) {
        var q = Math.floor(r1 / r2);
        var r = r1 % r2;
        var t = t1 - q * t2;

        r1 = r2;
        r2 = r;
        t1 = t2;
        t2 = t;
    }

    if (r1 === 1) {
        return (t1 + domain) % domain;
    } else {
        // If no multiplicative inverse exists
        console.error("Multiplicative inverse does not exist.");
        return -1;
    }
}
//playfair
// Function to generate the 5x5 key square
function playfair(plain, key) {
    // Constructor function, not used in this implementation
  }
  
  playfair.prototype.encrypt = function(plain, key) {
    key = constructKeyMatrix(key);
    plain = editPlain(plain);
    result = encryptPlayFair(plain, key);
    return result;
  }
  
  playfair.prototype.decrypt = function(cipher, key) {
    key = constructKeyMatrix(key);
    result = decryptPlayFair(cipher, key);
    return result;
  }
  
  function constructKeyMatrix(key) {
    const alphabet = "abcdefghiklmnopqrstuvwxyz";
    key += alphabet;
    for (let i = 0; i < key.length; i++) {
      if (key.indexOf(key[i]) !== i) {
        key = key.slice(0, i) + key.slice(i + 1);
        i--;
      }
    }
    return key;
  }
  
  function editPlain(plain) {
    for (let i = 0; i < plain.length - 1; i += 2) {
      if (plain[i] === plain[i + 1])
        plain = plain.slice(0, i + 1) + 'x' + plain.slice(i + 1);
    }
    if (plain.length % 2 === 1) plain += 'x';
    plain = plain.replace(/j/g, 'i');
    return plain;
  }
  
  function encryptPlayFair(plaintext, key) {
    var ciphertext = "";
    for (let i = 0; i < plaintext.length - 1; i += 2) {
      var i1, i2, j1, j2;
      i1 = key.indexOf(plaintext[i]) / 5 | 0;
      j1 = key.indexOf(plaintext[i]) % 5;
      i2 = key.indexOf(plaintext[i + 1]) / 5 | 0;
      j2 = key.indexOf(plaintext[i + 1]) % 5;
      if (i1 == i2)
        ciphertext += key[i1 * 5 + (j1 + 1) % 5] + key[i2 * 5 + (j2 + 1) % 5];
      else if (j1 == j2)
        ciphertext += key[((i1 + 1) % 5) * 5 + j1] + key[((i2 + 1) % 5) * 5 + j2];
      else
        ciphertext += key[i1 * 5 + j2] + key[i2 * 5 + j1];
    }
    return ciphertext;
  }
  
  function decryptPlayFair(ciphertext, key) {
    var plaintext = "";
    for (let i = 0; i < ciphertext.length - 1; i += 2) {
      var i1, i2, j1, j2;
      i1 = key.indexOf(ciphertext[i]) / 5 | 0;
      j1 = key.indexOf(ciphertext[i]) % 5;
      i2 = key.indexOf(ciphertext[i + 1]) / 5 | 0;
      j2 = key.indexOf(ciphertext[i + 1]) % 5;
      if (i1 == i2)
        plaintext += key[i1 * 5 + (j1 - 1 + 5) % 5] + key[i2 * 5 + (j2 - 1 + 5) % 5];
      else if (j1 == j2)
        plaintext += key[((i1 - 1 + 5) % 5) * 5 + j1] + key[((i2 - 1 + 5) % 5) * 5 + j2];
      else
        plaintext += key[i1 * 5 + j2] + key[i2 * 5 + j1];
    }
    return plaintext;
  }
  
  // Function to trigger encryption
  function performPlayfairEncrypt() {
    var plaintext = document.getElementById("plaintext").value;
    var key = document.getElementById("key").value;
    var pf = new playfair();
    var result = pf.encrypt(plaintext, key);
    document.getElementById("resultLabel").innerText = "Encrypted Text:";
    document.getElementById("result").innerText = result;
  }
  
  // Function to trigger decryption
  function performPlayfairDecrypt() {
    var ciphertext = document.getElementById("result").value;
    var key = document.getElementById("key").value;
    var pf = new playfair();
    var result = pf.decrypt(ciphertext, key);
    document.getElementById("resultLabel").innerText = "Decrypted Text:";
    document.getElementById("result").innerText = result;
  }


  
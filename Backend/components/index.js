const crypto = require("crypto"),
  algorithm = "aes-256-cbc",
  password = "8UHjPgXZzXCGkhxV2QCnooyJexUzvJrO",
  ivstring = "43c8539ab49012be";
const jwt = require("jsonwebtoken");
const config = require("../config/config")
const fs = require("fs");
const path = require("path");
const util = require("util");
const multer = require("multer");
const mime = require("mime-types");

// token
const tokencheck = (req, res, next) => {
  console.log('ck_token');
  var token = req.headers["x-access-token"];
  if (!token) {
    console.log("no token");
    return res.status(401).send({ message: "No token provided." });
  }
  jwt.verify(
    token,
    config.secret,
    { algorithm: "HS256" },
    function (err, decoded) {
      if (err) {
        return res.status(401).send({ message: err.message });
      }
      decoded.auth = true;
      req.auth = decoded.gen_token;
      next();
    }
  );
};

// เข้ารหัส ปกติ
const encrypt = (text) => {
  var cipher = crypto.createCipheriv(algorithm, password, ivstring);
  var crypted = cipher.update(text, "utf8", "base64");
  crypted += cipher.final("base64");
  return crypted;
};

// เข้ารหัสแบบ sha256
const sha256 = (ascii) => {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = "length";
  var i, j;
  var result = "";
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  var hash = (sha256.h = sha256.h || []);
  var k = (sha256.k = sha256.k || []);
  var primeCounter = k[lengthProperty];
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    var oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15],
        w2 = w[i - 2];
      var a = hash[0],
        e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
};

// upload file - แบบ base64
const decodeBase64Image = async (filebase64, name) => {
  var matches = filebase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");
  var imageBuffer = response.data;
  var type = response.type;
  var extension = mime.extension(type);
  let file = `${name}.` + extension; // ชื่อไฟล ตัวอย่าง image.png (เพิ่มชื่อไฟล์ลงในฟิวดาต้าเบสใช้สำหรับเรียกแสดงผล)
  console.log(file);
  var fileName = path.join(__dirname, `../assets/image/${file}`); // โฟลเดอร์ที่เก็บรูป
  const data = {
    fileName,
  };
  await fs.writeFileSync(fileName, imageBuffer, "utf8");
  try {
    return file;
  } catch (err) {
    return "error";
  }
};

// upload file - แบบ form data
const uploadFiles = (req, res) => {
  const uploadFile = util.promisify(
    multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, `../../assets/file-image`)); // โฟลเดอร์ที่เก็บรูป
        },
        filename: (req, file, cb) => {
          var extension = mime.extension(file.mimetype);
          let filename = `${req.body.name}.` + extension; // ชื่อไฟล ตัวอย่าง image.png (เพิ่มชื่อไฟล์ลงในฟิวดาต้าเบสใช้สำหรับเรียกแสดงผล)
          cb(null, filename);
        },
      }),
    }).single("file") // key ไฟลรูป
  );
  uploadFile(req, res);
};

module.exports = {
  tokencheck,
  encrypt,
  sha256,
  decodeBase64Image,
  uploadFiles,
};

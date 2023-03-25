const express = require("express");
const dynamicUploadRouter = express.Router();
const multer = require('multer');
const path = require('path');
const shell = require('shelljs')
const config = require("../../config/config");
// const { upload_file_only, upload_file_over_one } = require('../API/upload');
const fs = require('fs-extra');

let chk = false;
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
   
    const full_path = req.body.full_path;
    const id = req.body.id;
    const upload_path = path.join(__dirname, "../../" + full_path + '/' + `${id}`);
    if (!chk) {
      await fs.remove(upload_path);
      chk = true;
    }
    shell.mkdir('-p', upload_path);
    cb(null, upload_path + '/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

dynamicUploadRouter.post('/upload-file-over-one', upload.array('file'), async (req, res) => {
  const { full_path } = req.body;
  if (!req.files) {
    return res.status(400).send({ error: false, status: 400, message: 'Please select a file to upload' })
  }
  let file = req.files
  file = await file.map(e => {
    `${config.ip_getimg}${full_path}/${e.filename}`
  })
  chk = false;
  return res.status(200).send({
    code: false, status: 200, message: 'success', data: {
      file: req.files,
      img: file
    }
  })

});
dynamicUploadRouter.post('/upload-file-only', upload.single('file'), async (req, res) => {
  const { full_path, id } = req.body
  if (!req.file) {
    return res.status(400).send({ error: false, status: 400, message: 'Please select a file to upload' })
  }
  chk = false;
  return res.status(200).send({
    code: false, status: 200, message: 'success', data: {
      file: req.file,
      filename: req.file.filename,
      img: `${config.ip_getimg}${full_path}/${id}/${req.file.filename}`

    }
  })
});
module.exports = { dynamicUploadRouter };

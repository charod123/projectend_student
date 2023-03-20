const express = require("express");
const dynamicUploadRouter = express.Router();
const multer = require('multer');
const path = require('path');
const shell = require('shelljs')
const config = require("../../config/config");
// const pgcon = require("../../pgConnection/pgCon");
const { upload_file_only, upload_file_over_one } = require('../API/upload');
const fs = require('fs')
const resourceMethods = {
  upload_file_only: upload_file_only,
  upload_file_over_one: upload_file_over_one
};

// dynamicUploadRouter.post("/:resource", async (req, res) => {
//   try {
//     const resource = req.params.resource.split('-').join('_');
//     if (!resource || !req || !Object.keys(resourceMethods).includes(resource)) {
//       return res.status(404).send({ code: 404, error: 'Invalid resource or method or Your parameter is not correct. Please check parameter in body.' });
//     }
//     const result = await resourceMethods[resource](req, res);
//     res.send(result);
//   } catch (error) {
//     res.send(error.message);
//   }
// });

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    console.log(file);
    const path_read = path.join(__dirname, "../../" + req.body.full_path + '/' + `${req.body.id}`)
    fs.readdir(path_read, (err, files) => {
      if (err) {
        return console.error(`Error reading folder: ${err}`);
      }

      let deletedFile = false;
      for (const file of files) {
        if (!deletedFile) {
          fs.unlink(path.join(path_read, file), (unlinkErr) => {
            if (unlinkErr) {
              return console.error(`Error deleting file: ${unlinkErr}`);
            } else {
              deletedFile = true;
              console.log('Successfully deleted an existing file');
            }
          });
        }
      }
    });
    shell.mkdir('-p', path_read)
    cb(null, path_read + '/');
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
  // if (!id) {
  //   const path_ = { filed: filed, table: table }
  //   const id_ = await getid(path_)
  //   return res.status(200).send({
  //     code: false, status: 200, message: 'success', data: {
  //       file: req.file,
  //       filename: req.file.filename,
  //       img: `${config.ip_getimg}${full_path}/${folder_name}-${id_ + 1}/${req.file.filename}`,
  //       pat_id: id_ + 1
  //     }
  //   })
  // }
  return res.status(200).send({
    code: false, status: 200, message: 'success', data: {
      file: req.file,
      filename: req.file.filename,
      img: `${config.ip_getimg}${full_path}/${id}/${req.file.filename}`

    }
  })
});
module.exports = { dynamicUploadRouter };

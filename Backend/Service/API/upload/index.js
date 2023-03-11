
const shell = require('shelljs')
const path = require("path");
const util = require("util");
const multer = require("multer");
const maxSize = 5000 * 5000;
const upload_file_over_one = async (req, res) => {
    console.log(req);
    try {
        await util.promisify(multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    shell.mkdir('-p', path.join(__dirname, "../../../" + req.body.full_path + '/' + req.body.id))
                    cb(null, path.join(__dirname, "../../../" + req.body.full_path + '/' + req.body.id + "/"));
                },
                filename: (req, file, cb) => {
                    file.originalname = file.originalname.split(" ").join("-")
                    cb(null, 'more-' + file.originalname);
                },
            }),
            limits: { fileSize: maxSize }
        }).array("file"))(req, res);

        return { error: false, status: 200, message: 'success' }

    } catch (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }
        return { message: `Upload failed: ${req.file.originalname}. ${err}`, }
    }
}
const upload_file_only = async (req, res) => {
    try {
        await util.promisify(multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    shell.mkdir('-p', path.join(__dirname, "../../../" + req.body.full_path + req.body.id))
                    cb(null, path.join(__dirname, "../../../" + req.body.full_path + req.body.id + "/"));
                },
                filename: (req, file, cb) => {
                    file.originalname = file.originalname.split(" ").join("-")
                    cb(null, 'cover-' + file.originalname);
                },
            }),
            limits: { fileSize: maxSize }
        }).single("file"))(req, res);

        return { error: false, status: 200, message: 'success' }
    } catch (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return { message: "File size cannot be larger than 2MB!" }
        }
        return { message: `Upload failed: ${req.file.originalname}. ${err}`, }
    }
}

  
module.exports={
    upload_file_over_one,
    upload_file_only
}

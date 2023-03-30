const express = require("express");
const cors = require("cors");
const app = express();
const moment = require("moment");
const port_service = process.env.PORT || 3001;
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const config = require("./config/config");
const pg = config.connectionString_pg();
const server_socket = require('./background-socket/server')
const server_notify = require('./background-notify/server')
const rateLimit = require("express-rate-limit");
const { dynamicDeleteRouter } = require("./Service/route-delete");
const { dynamicGetRouter } = require("./Service/route-read");
const { dynamicWriteRouter } = require("./Service/route-write");
const { dynamicLoginRouter } = require("./Service/route-login");
const { dynamicUploadRouter } = require("./Service/route-upload");

// const path_role = path.join(__dirname, "../system_privilege.json");
// const pgcon = require("./pgconnection/pgCon");
// const config = require("./config/config");
const { tokencheck } = require("./components");
app.use(cors());
const limit = rateLimit({
  windowMs: 2 * 1000, // 1 s
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});


// Apply the rate limit to all requests
app.use(limit);
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  })
);

// const folder = 'C:/charod/project-student/projectend_new_version/Backend/resources/assets/complain-img/cp-1';

// const readDataRole = async () => {
//     try {
//         const data = await fs.promises.readFile(path_role, 'utf8');
//         const role = JSON.parse(data);
//         for (let i = 0; i < role.role_1.length; i++) {
//             const e = role.role_1[i];
//             const sql = `INSERT INTO priority_config VALUES ('${e.priority_id}','${e.can_read}','${e.can_write}','${e.can_delete}','${e.can_export}','${e.role_id}');`
//             const r2 = await pgcon.execute(sql, config.connectionString());
//             if (r2.code) {
//                 return { code: true, status: 400, message: r2.message, data: [] };
//             }
//         }

//     } catch (err) {
//         throw err;
//     }
// };
// readDataRole()
http.createServer((req, res) => {
  // Parsing the URL
  const filepath = decodeURIComponent(req.url).trim();
  const split_ = filepath.split("/");

  var request = url.parse(filepath, true);

  // Extracting the path of file
  var action = request.pathname;

  // Path Refinements
  var filePath = path.join(__dirname, action);

  // Checking if the path exists

  fs.exists(filePath, function (exists) {
    if (!exists) {
      res.writeHead(404, {
        "Content-Type": "text/plain",
      });
      res.end("404 Not Found");
      return;
    }

    // Extracting file extension
    var ext = path.extname(action);

    // Setting default Content-Type
    var contentType = "text/plain";
    var ContentDisposition = null;

    // Checking if the extension of
    // image is '.png'
    switch (ext.toLowerCase()) {
      case ".png":
      case ".jpeg":
      case ".jfif":
      case ".gif":
      case ".jpg":
      case ".svg":
        contentType = "image/png";
        break;
      case ".docx":
      case ".doc":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        // ContentDisposition = `attachment;`;
        break;
      case ".xlsx":
      case ".csv":
      case ".xml":
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        // ContentDisposition = `attachment;`;
        break;
      case ".mp3":
        contentType = "audio/mpeg"
        break
      case ".pdf":
        contentType = "application/pdf";
        console.log(split_[split_.length - 1]);
        // ContentDisposition = `attachment;`;
        break;
      default: contentType = "application/json";
        break;
    }

    // Setting the headers
    console.log(String(ext.toLowerCase()));
    if (
      [".png", ".jpg", ".jpeg", ".jfif", ".gif", ".json", ".svg"].includes(ext.toLowerCase())
    ) {
      res.writeHead(200, {
        "Content-Type": contentType,
      });
    } else {
      fs.createReadStream(filePath).pipe(res);
      res.writeHead(200, {
        "Content-Type": contentType,
        // "Content-Disposition": ContentDisposition,
      });
    }

    // Reading the file
    fs.readFile(filePath, function (err, content) {
      // Serving the image
      res.end(content);
    });
  });
}).listen(3003);

app.listeners(server_notify)
app.listeners(server_socket)
app.use("/read", tokencheck, dynamicGetRouter);
app.use("/delete", tokencheck, dynamicDeleteRouter);
app.use("/write", tokencheck, dynamicWriteRouter);
app.use("", dynamicLoginRouter);
app.use("/upload", dynamicUploadRouter);

app.use(logFunction);

app.listen(port_service);

console.log(`App Listen on ${port_service}`);


function logFunction(req, res, next) {
  console.log(moment().format("YYYY-MM-DD HH:mm:ss") + " :" + req.url);
  next();
}
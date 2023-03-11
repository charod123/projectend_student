const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const readfile_ = ({ id, full_path }) => {
  const pat = path.join(__dirname, "../" + full_path + "/" + id + "/");
  return new Promise((resolve, reject) => {
    fs.readdir(pat, (err, data) => {
      console.log(data);
      if (err) {
        // if (id.split("-")[0] === 'onborading') {
        //   reject(`${config.ip_getimg}resources/assets/mian-icon/default/no-img/no-photo-onborading.png`);

        // } else {
        reject(`${config.ip_getimg}resources/assets/mian-icon/default/no-img/no-photo.png`);
        // }

      } else {
        const data_ = data.map(file => `${config.ip_getimg}${full_path}/${id}/${file}`);
        resolve(data_);
      }
    });
  });
}
module.exports = {
  readfile_
}




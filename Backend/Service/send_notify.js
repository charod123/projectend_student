const sendnotify = ({ token, stickerId, package_id }) => {
    const lineNotify = require("line-notify-nodejs")(token);
    const template = `<div style="width: 500px;"><p>มีเรื่องร้องเรียนใหม่</p></div>`;
    const message = template.replace(/<[^>]+>/g, '');

    lineNotify.notify({
        message: message,
        stickerPackageId: package_id,
        stickerId: stickerId,
    })
        .then(() => {
            console.log(
                "send LINE notify completed! if"
            );
        })
        .catch(() => {
            console.log("ส่งข้อมูลผิดพลาด");
        });
}
module.exports = { sendnotify }
const express = require('express');
const config = require('../config/config')
const port_websocket = config.port_websocket;
const app = express();
const pgcon = require("../pgConnection/pgCon");
const CLIENTS = []
const connectedClients = {}
const moment = require('moment')
moment.locale('th')
const WebSocket = require('ws');
const { readfile_ } = require('../Service/readfile');
const rateLimit = require("express-rate-limit");
let WSServer = WebSocket.Server;
const pg = config.connectionString_pg();
let server = require('http').createServer();
const limit = rateLimit({
  windowMs: 2 * 1000, // 1 s
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});
let wss = new WSServer({
  server: server,
  perMessageDeflate: false
})
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

server.on('request', app);
app.use(limit);
wss.on("connection", (ws) => {
  console.log('Client connected');
  const clientId = generateUniqueId();
  ws.send('connection');
  connectedClients[clientId] = ws;
  // getData({ status: 'chk_data' })
  ws.on("message", async (message) => {
    console.log("==", JSON.parse(message));
    const data_mqtt = JSON.parse(message)
    if (+data_mqtt.data.status == 1) {
      const id = await getData_in_database(JSON.parse(message))
      console.log(id);
      if (id.length > 0) {
        await getDataAll(id, JSON.parse(message))
      }
    }
    // getData(JSON.parse(message));
  });
  ws.on("close", close = () => {
    console.log("disconnected");
    delete connectedClients[clientId];
  });
});
server.listen(port_websocket, () => console.log(`Server started - websocket server on port ${port_websocket}`))

const getData = (data) => {
  for (var i = 0; i < Object.values(connectedClients).length; i++) {
    const snednoti = Object.values(connectedClients)[i];
    snednoti.send(JSON.stringify(data));
  }
}

const getData_in_database = async (data) => {
  try {
    if (data.data) {
      const get_maxid_pro_file = await pg.select('device_ip','pat_id').from('device_master').where({ device_ip: data.data.IMEI, del_flag: '1' });
      // const get_maxid_pro_file = await pgcon.get(`SELECT device_ip,pat_id FROM device_master WHERE device_ip = '${data.data.IMEI}' AND del_flag = '1'`, config.connectionString());
      if (!get_maxid_pro_file) {
        return { code: true, status: 400, message: get_maxid_pro_file, data: [] };
      }
      return get_maxid_pro_file
    }
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }

}
const getDataAll = async (id, notify) => {
  const get_device = await pg.select('*').from('device_master').where({ device_ip: id[0].device_ip, del_flag: '1' });
  if (!get_device) {
    return { code: true, status: 400, message: get_device, data: [] };
  }
  const get_pat = await pg.select('patient_master.*', 'user_profile.*', 'subdistricts.sub_name_in_thai', 'provinces.pro_name_in_thai', 'districts.dis_name_in_thai','division_master.division_id',
    'user_master.email', 'user_master.line_token').from('patient_master')
    .innerJoin('user_profile', 'patient_master.user_pro_id', '=', 'user_profile.user_pro_id')
    .innerJoin('subdistricts', 'subdistricts.sub_id', '=', 'patient_master.subdistrict_id')
    .innerJoin('provinces', 'provinces.pro_id', '=', 'patient_master.province_id')
    .innerJoin('districts', 'districts.dis_id', '=', 'patient_master.district_id')
    .innerJoin('division_master', 'division_master.subdistrict_id', '=', 'patient_master.subdistrict_id')
    .innerJoin('user_master', 'user_master.email', '=', 'patient_master.user_id')
    .where('patient_master.pat_id', '=', `${id[0].pat_id}`)
    .andWhere(`patient_master.del_flag`, '=', '1')
  if (!get_pat) {
    return { code: true, status: 400, message: get_pat, data: [] };
  }
  const datapat = get_pat.map(async a => {
    const img_pat = await readfile_({ id: `pat-${a.pat_id}`, full_path: a.img_path }).then((e) => e).catch(err => err);
    a.img_path = img_pat
    return a
  })

  const get_uty = await pg.select('*').from('usertry_master')
    .innerJoin('user_profile', 'user_profile.user_pro_id', '=', 'usertry_master.user_pro_id')
    .where('usertry_master.pat_id', '=', `${id[0].pat_id}`)
    .andWhere(`usertry_master.del_flag`, '=', '1')

  if (!get_pat) {
    return { code: true, status: 400, message: get_pat, data: [] };
  }
  return sendLINE_Notify({ device: get_device, pat: await Promise.all(datapat), id, usertry: get_uty, notify })
}

const sendLINE_Notify = async (data) => {
  const insert = await insert_notifications(data)
  if (insert.code != true) {
    const notify = data.notify
    const usertry = data.usertry
    const tag_p_uty = await Promise.all(usertry.map((e) => `<p>ชื่อ ${e.fristname + ' ' + e.lastname} เบอร์โทร ${e.phone}</p>\n`))
    if (!data.pat[0].line_token) {
      const data_ = { ...data, ni_id: insert.data, not_token_line: true }
      console.log(data_);
      return getData(data_);
    } else {
      const data_ = { ...data, ni_id: insert.data, not_token_line: false }
      console.log(data_);
      getData(data_);
      const lineNotify = require("line-notify-nodejs")(data.pat[0].line_token);
      const template = `<div style="width: 500px;">
  <p>มีการกดปุ่มเมื่อ ${moment(notify.date).format("LLLL")}</p>
  <p>ชื่อผู้ป่วย ${data.pat[0].fristname + ' ' + data.pat[0].lastname} เพศ ${data.pat[0].gender}</p>
  <p>ญาติที่สามารถติดต่อได้</p>
  ${tag_p_uty}
     </div>`
        ;
      const message = template.replace(/<[^>]+>/g, '');

      lineNotify.notify({
        message: message,
        stickerPackageId: 446,
        stickerId: 2024,
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

  }

}
const insert_notifications = async (data) => {
  const device = data.device
  const notify = data.notify
  const get_maxid = await pg('notification').max('ni_id')
  const insert_noti = await pg('notification').insert({
    ni_id: get_maxid[0].max + 1,
    detail_deliver: '',
    del_flag: '1',
    detail_patient: '',
    device_ip: device[0].device_ip,
    time_event: moment(new Date(notify.data.date)).format("YYYY-MM-DD HH:mm:ss"),
    status: notify.data.status,
    ping_gsm: notify.data.GSMCSQ
  }).returning('ni_id');
  if (insert_noti.code) {
    return { code: true, status: 400, message: insert_noti, data: [] };
  }
  return { code: false, status: 200, message: "success", data: insert_noti };
}

const pgcon = require("../../../pgconnection/pgCon");
const config = require("../../../config/config");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { readfile_ } = require("../../readfile");
moment.locale("th");
const pg = config.connectionString_pg();

const Login = async ({ email, password }) => {
  try {
    // let sql = `SELECT * FROM user_master WHERE del_flag = '1' `;

    // if (email != "") {
    //   sql += ` AND email = '${email}'`;
    // }
    // const r1 = await pgcon.get(sql, config.connectionString());
    let query = await pg.select('user_master.*').from('user_master').where('user_master.email', '=', email)
    let sql
    if (query[0].role_id != 3) {
      sql = await pg.select('user_master.*', 'subdivision_master.*', 'division_master.division_id', 'division_master.subdistrict_id').from('user_master')
        .innerJoin('employee', 'employee.user_id', 'user_master.user_id')
        .innerJoin('subdivision_master', 'subdivision_master.subdivision_id', 'employee.subdivision_id')
        .innerJoin('division_master', 'division_master.division_id', 'subdivision_master.division_id')
        .where('user_master.email', '=', email)
    }
    if (query[0].role_id == 3) {
      sql = query
    }
    const r1 = await sql
    if (!r1) {
      return {
        code: true,
        status: 200,
        message: "ไม่มีผู้ใช้นี้ในระบบ",
        data: [],
      };
    }
    const isPasswordMatch = await bcrypt.compare(password, r1[0].password);
    if (!isPasswordMatch) {
      console.log("รหัสผ่านไม่ถูก");
      return {
        code: true,
        status: 200,
        message: "รหัสผ่านไม่ถูกต้อง",
        data: [],
      };
    }
    let gen_token = {}
    if (+r1[0].role_id === 3) {
      gen_token = {
        email: email,
        role: r1[0].role_id,
        user_id: r1[0].user_id,
        subdistrict_id: r1[0].subdistrict_id
      };
    }
    if (+r1[0].role_id != 3) {
      gen_token = {
        email: email,
        role: r1[0].role_id,
        user_id: r1[0].user_id,
        subdistrict_id: r1[0].subdistrict_id,
        division_id: r1[0].division_id,
        subdivision_id: r1[0].subdivision_id
      };
    }

    const token = jwt.sign({ gen_token }, config.secret, {
      expiresIn: "10h",
      algorithm: "HS256",
    });

    const r1_ = await r1.map((x) => {
      delete x["password"];
      return x;
    });
    const data = await r1_.map(async (e) => {
      const img_user = await readfile_({ id: `user-${e.user_id}`, full_path: e.img_path }).then((e) => e[0]).catch(err => err);
      // const r1 = await pgcon.get(
      //   `SELECT * FROM user_profile WHERE user_pro_id = '${e.user_pro_id}'`,
      //   config.connectionString()
      // );
      const r1 = await pg.select('*').from('user_profile').where('user_pro_id', '=', e.user_pro_id)
      let data = {}
      if (+e.role_id < 3) {
        data = {
          user_id: e.user_id,
          create_date: moment(e.create_date).format("LLLL"),
          update_date: moment(e.update_date).format("LLLL"),
          email: e.email,
          password: e.password,
          fristname: r1[0].fristname,
          lastname: r1[0].lastname,
          phone: r1[0].phone,
          gender: r1[0].phone,
          img_path: img_user,
          birthday: moment(e.um_birthday).format("LLLL"),
          token: token,
          subdivision_id: e.subdivision_id,
          division_id: e.division_id
        }
      }
      if (+e.role_id == 3) {
        data = {
          user_id: e.user_id,
          create_date: moment(e.create_date).format("LLLL"),
          update_date: moment(e.update_date).format("LLLL"),
          email: e.email,
          password: e.password,
          fristname: r1[0].fristname,
          lastname: r1[0].lastname,
          phone: r1[0].phone,
          gender: r1[0].phone,
          img_path: img_user,
          birthday: moment(e.um_birthday).format("LLLL"),
          token: token,
          subdistrict_id: e.subdistrict_id
        }
      }
      return data
    });
    return {
      code: false,
      status: 200,
      message: "success",
      data: await Promise.all(data),
    };
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }
};

module.exports = {
  Login,
};

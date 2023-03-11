const pgcon = require("../../../pgconnection/pgCon");
const pgcon_pg = require("../../../pgconnection/pgCon_for_kenx");
const config = require("../../../config/config");
const nodemailer = require("nodemailer");
const moment = require('moment')
const bcrypt = require('bcryptjs')
const pg = config.connectionString_pg();
const register = async (data) => {
    const {
        user_pro_id,
        user_id,
        email,
        password,
        img_path,
        fristname,
        lastname,
        birthday,
        gender,
        phone,
        role_id,
        district_id,
        province_id,
        subdistrict_id
    } = data;
    console.log(data);
    try {

        if (!email || !password || !fristname || !lastname || !birthday || !gender || !phone || !role_id || !district_id || !subdistrict_id || !province_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const result = await pg.select('email').from('user_master').where({ email: email });
        if (result.length === 1) {
            return {
                code: false,
                status: 200,
                message: "มีอีเมลในระบบแล้ว",
                data: [],
            };
        }
        const table = 'user_profile'
        const script = {
            user_pro_id: user_pro_id,
            fristname: fristname,
            lastname: lastname,
            birthday: moment(birthday).format('YYYY-MM-DD'),
            gender: gender,
            phone: phone.split('-').join(''),

        }
        // `INSERT INTO user_profile VALUES  ('${get_maxid_user_pro}','${fristname}','${lastname}','${birthday}','${gender}','${phone}') RETURNING user_pro_id `;
        // const r1 = await pgcon.get(sql_pro, config.connectionString());
        const r1 = await pgcon_pg.insert(table, script, pg)
        if (r1.code) {
            return { code: true, status: 400, message: r1.message, data: [] };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // const sql_pat = `INSERT INTO user_master VALUES  ('${get_maxid_user}','${email}','${hashedPassword}','${img_path}','1','${r1.data[0].user_pro_id}',NULL,now(),NULL,'${role_id}','${province_id.pro_id}','${district_id.dis_id}','${subdistrict_id.sub_id}')RETURNING user_id `;
        // const r2 = await pgcon.get(sql_pat, config.connectionString());
        const table_user = 'user_master'
        const script_user = {
            user_id: user_id,
            email: email,
            password: hashedPassword,
            img_path: img_path,
            del_flag: '1',
            user_pro_id: user_pro_id,
            line_token: null,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: null,
            role_id: role_id,
            province_id: province_id.pro_id ?? province_id,
            district_id: district_id.dis_id ?? district_id,
            subdistrict_id: subdistrict_id.sub_id??subdistrict_id
        }
        const r2 = await pgcon_pg.insert(table_user, script_user, pg)

        if (r2.code) {
            return { code: true, status: 400, message: r2.message, data: [] };
        }
        // const data = await readDataRole(r2.data[0].user_id).then(e => e).catch(err => err)

        return { code: false, status: 200, message: "success", data: r2.data[0].user_id };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};
module.exports = {
    register
}

// const readDataRole = async (userId) => {
//     try {
//         const data = await fs.promises.readFile(path_role, 'utf8');
//         const role = JSON.parse(data);
//         const getMaxIdSys = await pgcon.get(`SELECT MAX(id) FROM system_privilege`, config.connectionString());
//         for (let i = 0; i < role.role_1.length; i++) {
//             const e = role.role_1[i];
//             const maxId = getMaxIdSys.data[0].max + 1 + i;
//             const sql = `INSERT INTO system_privilege VALUES ('${maxId}','${userId}','${e.privilege_name}',now(),NULL,'${e.can_read}','${e.can_write}','${e.can_delete}','1');`
//             const r2 = await pgcon.execute(sql, config.connectionString());
//             if (r2.code) {
//                 return { code: true, status: 400, message: r2.message, data: [] };
//             }
//         }

//     } catch (err) {
//         throw err;
//     }
// };
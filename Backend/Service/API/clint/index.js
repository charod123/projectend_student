const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment');
const { readfile_ } = require("../../readfile");
const pg = config.connectionString_pg();
const get_clint = async ({ }, { email, role, user_id, subdistrict_id }) => {
    try {
        let sql
        if (!(+role == 2 || +role == 1)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (+role == 2 || +role == 1) {
            sql = await pg.select('*').from('user_master')
                .innerJoin('user_profile', 'user_profile.user_pro_id', '=', 'user_master.user_pro_id')
                .where('user_master.del_flag', '=', `1`)
                .andWhere(`user_master.role_id`, '=', '3')
                .andWhere('user_master.subdistrict_id', '=', `${subdistrict_id}`)

        }

        // const get_user = await pgcon.get(sql, config.connectionString());
        if (!sql) {
            return { code: true, status: 400, message: sql, data: [] };
        }
        const data = await sql.map(async e => {
            const pat = await pg.select('*').from('patient_master')
                .innerJoin('user_profile', 'user_profile.user_pro_id', '=', 'patient_master.user_pro_id')
                .where({ user_id: e.email })
                .andWhere(`patient_master.del_flag`, '=', '1')
            const data_pat = await Promise.all(pat.map(async a => {
                const img = await readfile_({ id: `pat-${a.pat_id}`, full_path: a.img_path }).then((e) => e[0]).catch(err => err);
                a.img_path = img;
                a.create_date = moment(a.create_date).format('YYYY-MM-DD HH:mm:ss');
                a.update_date = moment(a.update_date).format('YYYY-MM-DD HH:mm:ss');
                a.birthday = moment(a.birthday).format('YYYY-MM-DD HH:mm:ss');
                return a
            }))
            const img = await readfile_({ id: `user-${e.user_id}`, full_path: e.img_path }).then((e) => e[0]).catch(err => err);
            e.create_date = moment(e.create_date).format('YYYY-MM-DD HH:mm:ss');
            e.update_date = moment(e.update_date).format('YYYY-MM-DD HH:mm:ss');
            e.birthday = moment(e.birthday).format('YYYY-MM-DD HH:mm:ss');
            e.img_path = img
            delete e.password;
            e.pat = data_pat
            return e;
        })
        return { code: false, status: 200, message: "success", data: await Promise.all(data) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const insert_divison = async ({ division_name, division_email, subdistrict_id, province_id, district_id, long, lat, tel }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!division_name || !lat || !long || !province_id || !subdistrict_id || !district_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }

        const get_maxid_division = await pg('division_master').max('division_id'); // pgcon.get(`SELECT MAX(division_id) FROM division_master`, config.connectionString());
        const insert_divison = await pg('division_master').insert({
            division_id: get_maxid_division[0].max + 1,
            division_name: division_name,
            del_flag: '1',
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            create_by: email,
            tel: tel,
            email: division_email,
            lat: lat,
            long: long,
            province_id: province_id,
            district_id: district_id,
            subdistrict_id: subdistrict_id
        })
        // pgcon.execute(`INSERT INTO division_master VALUES ('${get_maxid_division.data[0].max + 1}','${division_name}','1',now(),NULL,'${email}','${tel}','${division_email}','${lat}','${long}','${province_id}','${district_id}','${subdistrict_id}')`, config.connectionString());
        if (!insert_divison) {
            return { code: true, status: 400, message: insert_divison, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_divison = async ({ division_name, division_email, long, lat, tel, subdistrict_id }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!division_name || !lat || !long) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const insert_divison = await pg('division_master').update({
            division_name: division_name,
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            create_by: email,
            tel: tel,
            email: division_email,
            lat: lat,
            long: long
        }).where('subdistrict_id', '=', `${subdistrict_id}`)
        // let sql = `UPDATE  division_master SET update_date = NOW(),division_name='${division_name}',email='${division_email}',long='${long}',lat='${lat}',tel='${tel}'  WHERE subdistrict_id = '${subdistrict_id}'`
        // const insert_divison = await pgcon.execute(sql, config.connectionString());
        if (!insert_divison) {
            return { code: true, status: 400, message: insert_divison, data: [] };
        }

        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_divison = async ({ division_id }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        // const sql = `UPDATE  division_master SET del_flag ='0',update_date = now() WHERE division_id = '${division_id}'`
        const insert_divison = pg('division_master').update({ del_flag: '0', update_date: pg.fn.now() }).where({ division_id: division_id })
        // const insert_divison = await pgcon.execute(sql, config.connectionString());
        if (!insert_divison) {
            return { code: true, status: 400, message: insert_divison, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_clint, insert_divison, update_divison, delete_divison }
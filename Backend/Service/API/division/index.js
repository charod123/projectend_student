const config = require("../../../config/config");
const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment')
const pg = config.connectionString_pg();
const get_divison = async ({ }, { email, role, subdistrict_id, division_id }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }

        const data = await pg('division_master as dm')
            .innerJoin('provinces as p', 'dm.province_id', '=', 'p.pro_id')
            .innerJoin('subdistricts as s', 'dm.subdistrict_id', '=', 's.sub_id')
            .innerJoin('districts as  d', 'dm.district_id', '=', 'd.dis_id')
            .where('dm.del_flag', '1')
            .andWhere('dm.division_id', division_id)
            .select('dm.*','p.pro_name_in_thai','d.dis_name_in_thai','s.sub_name_in_thai')
        const data_ = data.map(e => {
            e.create_date = moment(e.create_date).format('YYYY-MM-DD HH:mm:ss');
            e.update_date = moment(e.update_date).format('YYYY-MM-DD HH:mm:ss');
            return e;
        })

        return { code: false, status: 200, message: "success", data: await Promise.all(data_) };

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
        const get_maxid_division = await pgcon.get(`SELECT MAX(division_id) FROM division_master`, config.connectionString());
        const insert_divison = await pgcon.execute(`INSERT INTO division_master VALUES ('${get_maxid_division.data[0].max + 1}','${division_name}','1',now(),NULL,'${email}','${tel}','${division_email}','${lat}','${long}','${province_id}','${district_id}','${subdistrict_id}')`, config.connectionString());
        if (insert_divison.code) {
            return { code: true, status: 400, message: insert_divison.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_divison = async ({ division_name, division_email, long, lat, tel }, { subdistrict_id, email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!division_name || !lat || !long) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        let sql = `UPDATE  division_master SET update_date = NOW(),division_name='${division_name}',email='${division_email}',long='${long}',lat='${lat}',tel='${tel}'  WHERE subdistrict_id = '${subdistrict_id}'`
        const insert_divison = await pgcon.execute(sql, config.connectionString());
        if (insert_divison.code) {
            return { code: true, status: 400, message: insert_divison.message, data: [] };
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
        const sql = `UPDATE  division_master SET del_flag ='0',update_date = now() WHERE division_id = '${division_id}'`
        const insert_divison = await pgcon.execute(sql, config.connectionString());
        if (insert_divison.code) {
            return { code: true, status: 400, message: insert_divison.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_divison, insert_divison, update_divison, delete_divison }
const pgcon = require("../../../pgconnection/pgCon");
const config = require("../../../config/config");
const moment = require('moment')
const pg = config.connectionString_pg();
const get_disease = async () => {
    try {
        // const get_district = await pgcon.get(`SELECT * FROM disease_master WHERE del_flag='1'`, config.connectionString());
        const get_district = await pg('disease_master')
            .select()
            .where('del_flag', '=', '1');
        if (!get_district) {
            return { code: true, status: 400, message: get_district, data: [] };
        }
        return { code: false, status: 200, message: "success", data: get_district };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const insert_disease = async (req) => {
    const { cd_name, cd_tilte, cd_detail, cd_symptom, cd_prevent, cd_source, detail_json, detail_html } = req
    try {
        const sql_maxid = `SELECT MAX(cd_id) FROM disease`;

        if (!cd_name || !cd_tilte || !cd_detail || !cd_symptom || !cd_prevent || !cd_source || !detail_json || !detail_html) {
            return { code: true, status: 400, message: 'ข้อมูลไม่ครบถ้วน', data: [] };
        } else {
            const max_id = await pgcon.get(sql_maxid, config.connectionString());
            const sql = `INSERT INTO disease VALUES ('${max_id.data[0].max + 1}','${cd_name}','${cd_tilte}','${cd_detail}','${cd_symptom}','${cd_prevent}','${cd_source}','0','${detail_json}','${detail_html}','${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}',${null}) RETURNING *`;
            const r1 = await pgcon.get(sql, config.connectionString());
            // console.log(encrypt(password));
            if (r1.code) {
                return { code: true, status: 400, message: r1.message, data: [] };
            }
            return { code: false, status: 200, message: "success", data: r1.data };

        }

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};


module.exports = {
    insert_disease,
    get_disease,
}


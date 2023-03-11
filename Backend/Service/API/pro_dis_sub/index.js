const config = require("../../../config/config");
const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment')

const get_province = async () => {
    try {
        const select_divison = await pgcon.get(`SELECT pro_id,pro_name_in_thai FROM provinces`, config.connectionString());
        if (select_divison.code) {
            return { code: true, status: 400, message: select_divison.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: select_divison.data };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_district = async ({ province_id }) => {
    console.log(province_id);
    try {
        if (!province_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const get_district = await pgcon.get(`SELECT dis_id,dis_name_in_thai FROM districts WHERE province_id='${province_id.pro_id}'`, config.connectionString());
        if (get_district.code) {
            return { code: true, status: 400, message: get_district.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: get_district.data };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_subdistrict = async ({ district_id }) => {
    try {
        if (!district_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const get_district = await pgcon.get(`SELECT sub_id,sub_name_in_thai,zip_code FROM subdistricts WHERE district_id='${district_id.dis_id}'`, config.connectionString());
        if (get_district.code) {
            return { code: true, status: 400, message: get_district.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: get_district.data };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_pro_dis_sub_by_id = async ({ province_id, district_id, subdistrict_id }) => {
    try {
        if (!province_id || !district_id || !subdistrict_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const sql = `SELECT sub.sub_id,sub.sub_name_in_thai,sub.zip_code,dis.dis_id,dis.dis_name_in_thai,pro.pro_id,pro.pro_name_in_thai FROM provinces AS pro
    INNER JOIN  districts AS dis ON dis.province_id = pro.pro_id
    INNER JOIN  subdistricts AS sub ON sub.district_id = dis.dis_id
     WHERE dis.dis_id='${district_id}' AND pro.pro_id ='${province_id}' AND sub.sub_id ='${subdistrict_id}'`
        const get_district = await pgcon.get(sql, config.connectionString());
        if (get_district.code) {
            return { code: true, status: 400, message: get_district.message, data: [] };
        }
        return { code: false, status: 200, message: "success", data: get_district.data };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_province, get_district, get_subdistrict, get_pro_dis_sub_by_id }
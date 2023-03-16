const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
// const moment = require('moment')
const pg = config.connectionString_pg();
const get_province = async () => {
    try {
        const select_division = await pg.select('pro_id', 'pro_name_in_thai').from('provinces');

        return { code: false, status: 200, message: "success", data: select_division };
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

        const get_district = await pg.select('dis_id', 'dis_name_in_thai')
            .from('districts')
            .where('province_id', province_id.pro_id);

        return { code: false, status: 200, message: "success", data: get_district };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }

}
const get_subdistrict = async ({ district_id }) => {
    try {
        if (!district_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }

        const get_subdistrict = await pg.select('sub_id', 'sub_name_in_thai', 'zip_code')
            .from('subdistricts')
            .where('district_id', district_id.dis_id);

        return { code: false, status: 200, message: "success", data: get_subdistrict };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }

}
const get_pro_dis_sub_by_id = async ({ province_id, district_id, subdistrict_id }) => {
    try {
        if (!province_id || !district_id || !subdistrict_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }

        const get_district = await pg.select('sub.sub_id', 'sub.sub_name_in_thai', 'sub.zip_code', 'dis.dis_id', 'dis.dis_name_in_thai', 'pro.pro_id', 'pro.pro_name_in_thai')
            .from('provinces as pro')
            .innerJoin('districts as dis', 'dis.province_id', 'pro.pro_id')
            .innerJoin('subdistricts as sub', 'sub.district_id', 'dis.dis_id')
            .where('dis.dis_id', district_id)
            .andWhere('pro.pro_id', province_id)
            .andWhere('sub.sub_id', subdistrict_id);

        return { code: false, status: 200, message: "success", data: get_district };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }

}
module.exports = { get_province, get_district, get_subdistrict, get_pro_dis_sub_by_id }
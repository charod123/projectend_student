const config = require("../../../config/config");
const moment = require('moment');
const pg = config.connectionString_pg();

const update_user = async ({ data }, { email, role }) => {
    try {
        if (!data.user_id || !data.user_pro_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }

        const update_user_profile = await pg('user_profile').where({ user_pro_id: data.user_pro_id }).update({
            fristname: data.fristname,
            lastname: data.lastname,
            birthday: moment(data.birthday, 'YYYY-MM-DD').format("YYYY-MM-DD"),
            gender: data.gender,
            phone: data.phone.split('-').join(''),
        })
        const update_user = await pg('user_master').where({ user_id: data.user_id }).update({ update_date: pg.fn.now() })

        if (!update_user || !update_user_profile) {
            return { code: true, status: 400, message: update_user || update_user_profile, data: [] };
        }
        return { code: false, status: 200, message: "success", data: update_user };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_user = async ({ user_id }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        try {
            const res = await pg("user_master").where({ user_id: user_id }).update({ del_flag: "0", update_date: pg.fn.now() });
            return { code: false, status: 200, message: "success", data: res };
        } catch (error) {
            return { code: true, status: 400, message: error.message, data: [] };
        }

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_count_user_devive = async ({ subdistrict_id }, { division_id, role }) => {
    try {

        const result = await pg('user_master as um')
            .select(
                pg.raw('COUNT(DISTINCT um.user_id) as count_user'),
                pg.raw('COUNT(DISTINCT dm.device_ip) as count_device'),
                pg.raw('COUNT(DISTINCT p_.pat_id) as count_pat')
            )
            .leftJoin('patient_master as p_', 'um.email', '=', 'p_.user_id')
            .leftJoin('device_master as dm', 'dm.pat_id', '=', 'p_.pat_id')
            .where('um.subdistrict_id', '=', `${subdistrict_id}`)
            .andWhere('um.role_id', '=', '3')


        return { code: false, status: 200, message: "success", data: result };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { update_user, delete_user, get_count_user_devive }
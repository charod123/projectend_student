const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require("moment");
// const { readfile_ } = require("../../../readfile");
moment.locale("th");
const pg = config.connectionString_pg();
const get_on_report = async ({ select_type_complain }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    console.log(email, role);
    try {
        let sql = pg.select('*', pg.raw("CASE WHEN c.cp_type_id='1' THEN 'แจ้งปัญหาการใช้งานระบบ' WHEN c.cp_type_id='2' THEN 'แจ้งปัญหาอุปกรณ์' ELSE 'อื่นๆ' END as cp_type"))
            .from('complain as c')
            .leftJoin('patient_master as p', 'p.pat_id', 'c.pat_id')
            .leftJoin('device_master as dm', 'dm.device_ip', 'c.device_id');

        if (role == 3) {
            sql.where({ 'c.del_flag': '1', 'c.user_id': email })
            select_type_complain == 4 ? null : sql.andWhere({ 'c.cp_type_id': select_type_complain })

        }
        if (role != 3) {
            sql.leftJoin('user_master as um', 'um.email', 'c.user_id')
            sql.where('c.del_flag', '1');
            sql.andWhere('um.role_id', '3');
            sql.andWhere('um.subdistrict_id', subdistrict_id)
            select_type_complain == 4 ? null : sql.andWhere({ 'c.cp_type_id': select_type_complain })

        }
        const get_com = await sql
        if (get_com.length > 0) {

            const taskTypePromises = get_com.map(e => {
                e.cp_create_date = moment(e.cp_create_date).format("YYYY-MM-DD HH:mm:ss")
                e.cp_update_date = moment(e.cp_update_date).format("YYYY-MM-DD HH:mm:ss")
                return e
            })
            return { code: false, status: 200, message: "success", data: await Promise.all(taskTypePromises) };
        }
        return { code: false, status: 200, message: "success", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};

module.exports = {
    get_on_report,

};

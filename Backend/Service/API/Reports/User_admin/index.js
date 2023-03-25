const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require("moment");
const { readfile_ } = require("../../../readfile");
moment.locale("th");
const pg = config.connectionString_pg();
const get_user_admin_on_report = async ({ subdivision_id_ }, { email, role, subdistrict_id, division_id }) => {
    try {
        if (role != 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        let query = pg.select('*')
            .from('user_master as um')
            .innerJoin('user_profile as up', 'up.user_pro_id', '=', 'um.user_pro_id')
            .innerJoin('employee as e', 'e.user_id', '=', 'um.user_id')
            .innerJoin('subdivision_master as sm', 'sm.subdivision_id', '=', 'e.subdivision_id')
            .innerJoin('division_master as dm', 'dm.division_id', '=', 'sm.division_id')
            .where({ 'um.del_flag': 1 })
            .andWhere({ 'sm.del_flag': 1 })
            .andWhere({ 'dm.del_flag': 1 })
        if (subdivision_id_ != 9.9) {
            query.andWhere({ 'sm.subdivision_id': subdivision_id_ });

        }

        const data_ = await query
        const data__ = data_.map(e => {
            e.create_date = moment(e.create_date).format('YYYY-MM-DD')
            e.update_date = moment(e.update_date).format('YYYY-MM-DD')
            return e
        })
        return { code: false, status: 200, message: "success", data: await Promise.all(data__) };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};

module.exports = {
    get_user_admin_on_report

};

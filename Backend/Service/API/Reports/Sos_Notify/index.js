const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require("moment");
const { readfile_ } = require("../../../readfile");
moment.locale("th");
const pg = config.connectionString_pg();
const get_notify_on_report = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    try {
        let query = pg('notification as n_')
            .select(pg.raw(`CASE
          WHEN n_.detail_deliver != '' and n_.detail_patient  != '' THEN
            'มีการดำเนินการจากเจ้าหน้าที่'
          ELSE
            'ไม่มีการดำเนินการจากเจ้าหน้าที่'
          END as status_noti`))
            .select('n_.*', 'p_.*', 'dm.*','um.*')
            .innerJoin('device_master as dm', 'dm.device_ip', 'n_.device_ip')
            .innerJoin('patient_master as p_', 'p_.pat_id', 'dm.pat_id')
            .innerJoin('user_profile as um', 'um.user_pro_id', 'p_.user_pro_id')
            .whereRaw(`to_char(time_event, 'YYYYMMDD') >= ? AND to_char(time_event, 'YYYYMMDD') <= ?`, [moment(start_date).format("YYYYMMDD"), moment(end_date).format("YYYYMMDD")]);


        if (role == 3) {
            query.andWhere({ 'p_.user_id': email })
        }
        if (role != 3) {
            query.andWhere({ 'p_.subdistrict_id': subdistrict_id })
        }
        const data_ = await query
        const data__ = data_.map(e => {
            e.time_event = moment(e.time_event).format('LLLL')
            e.create_date = moment(e.create_date).format('YYYY-MM-DD')
            e.birthday = moment(e.birthday).format('YYYY-MM-DD')
            return e 
        })
        return { code: false, status: 200, message: "success", data: await Promise.all(data__) };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};

module.exports = {
    get_notify_on_report

};

const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
// const pgcon_knex = require("../../../../pgConnection/pgCon_for_kenx");
const moment = require('moment')
const pg = config.connectionString_pg();
const get_dashboard_count_time = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        // const select_dis = await pg.select('*').from('disease_master').where({ del_flag: 1 })
        let query
        query = pg('notification as n')
            .select(
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '00:01' AND to_char(n.time_event, 'HH:mm') <= '03:59' THEN 1 END) AS time_00_04`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '04:00' AND to_char(n.time_event, 'HH:mm') <= '07:59' THEN 1 END) AS time_04_08`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '08:00' AND to_char(n.time_event, 'HH:mm') <= '11:59' THEN 1 END) AS time_08_12`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '12:00' AND to_char(n.time_event, 'HH:mm') <= '15:59' THEN 1 END) AS time_12_16`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '16:00' AND to_char(n.time_event, 'HH:mm') <= '19:59' THEN 1 END) AS time_16_20`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '20:00' AND to_char(n.time_event, 'HH:mm') <= '23:59' THEN 1 END) AS time_20_00`),
                pg.raw(`COUNT(n.ni_id) AS count_noti`),
            )
            .innerJoin('device_master as d', 'd.device_ip', '=', 'n.device_ip')
            .innerJoin('patient_master as p_', 'p_.pat_id', '=', 'd.pat_id')
            .innerJoin('division_master as dm', 'dm.subdistrict_id', '=', 'p_.subdistrict_id')
            .innerJoin('subdivision_master as sm', 'sm.division_id', '=', 'dm.division_id')
        if (role == 1 || role == 2) {
            query = query.where({ 'dm.division_id': division_id })
        }
        if (role == 3) {
            query = query.where({ 'p_.user_id': email })
        }
        if (start_date && end_date) {
            query = query.whereRaw(`to_char(time_event, 'YYYYMMDD') >= ? AND to_char(time_event, 'YYYYMMDD') <= ?`, [moment(start_date).format("YYYYMMDD"), moment(end_date).format("YYYYMMDD")]);
        }
        const select_divison = await query


        //        const select_divison = await pg('notification')
        //   .select(
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '00:01' AND to_char(time_event, 'HH24:MI') <= '03:59' THEN 1 END) AS time_00_04`),
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '04:00' AND to_char(time_event, 'HH24:MI') <= '07:59' THEN 1 END) AS time_04_08`),
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '08:00' AND to_char(time_event, 'HH24:MI') <= '11:59' THEN 1 END) AS time_08_12`),
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '12:00' AND to_char(time_event, 'HH24:MI') <= '15:59' THEN 1 END) AS time_12_16`),
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '16:00' AND to_char(time_event, 'HH24:MI') <= '19:59' THEN 1 END) AS time_16_20`),
        //     pg.raw(`COUNT(CASE WHEN to_char(time_event, 'HH24:MI') >= '20:00' AND to_char(time_event, 'HH24:MI') <= '23:59' THEN 1 END) AS time_20_00`)
        //   );
        if (!select_divison) {
            return { code: true, status: 400, message: select_divison, data: [] };
        }

        return { code: false, status: 200, message: "success", data: select_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_dashboard_count_pat = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        // const select_dis = await pg.select('*').from('disease_master').where({ del_flag: 1 })
        let query
        query = pg('notification as n')
            .select(
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '00:01' AND to_char(n.time_event, 'HH:mm') <= '03:59' THEN 1 END) AS time_00_04`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '04:00' AND to_char(n.time_event, 'HH:mm') <= '07:59' THEN 1 END) AS time_04_08`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '08:00' AND to_char(n.time_event, 'HH:mm') <= '11:59' THEN 1 END) AS time_08_12`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '12:00' AND to_char(n.time_event, 'HH:mm') <= '15:59' THEN 1 END) AS time_12_16`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '16:00' AND to_char(n.time_event, 'HH:mm') <= '19:59' THEN 1 END) AS time_16_20`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'HH:mm') >= '20:00' AND to_char(n.time_event, 'HH:mm') <= '23:59' THEN 1 END) AS time_20_00`),
                pg.raw(`COUNT(n.ni_id) AS count_noti`),
                pg.raw(`COUNT(DISTINCT p_.pat_id) AS count_pat`),
            )
            .innerJoin('device_master as d', 'd.device_ip', '=', 'n.device_ip')
            .innerJoin('patient_master as p_', 'p_.pat_id', '=', 'd.pat_id')
            .innerJoin('division_master as dm', 'dm.subdistrict_id', '=', 'p_.subdistrict_id')
            .innerJoin('subdivision_master as sm', 'sm.division_id', '=', 'dm.division_id')
        if (role == 1 || role == 2) {
            query = query.where({ 'dm.division_id': division_id })
        }
        if (role == 3) {
            query = query.where({ 'p_.user_id': email })
        }
        if (start_date && end_date) {
            query = query.whereRaw(`to_char(time_event, 'YYYYMMDD') >= ? AND to_char(time_event, 'YYYYMMDD') <= ?`, [moment(start_date).format("YYYYMMDD"), moment(end_date).format("YYYYMMDD")]);
        }
        const select_divison = await query
        if (!select_divison) {
            return { code: true, status: 400, message: select_divison, data: [] };
        }

        return { code: false, status: 200, message: "success", data: select_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}


module.exports = { get_dashboard_count_time, get_dashboard_count_pat }
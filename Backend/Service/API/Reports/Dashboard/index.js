const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
// const pgcon_knex = require("../../../../pgConnection/pgCon_for_kenx");
const moment = require('moment')
const pg = config.connectionString_pg();
const get_dashboard_count_time = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id }) => {
    try {

        // const select_dis = await pg.select('*').from('disease_master').where({ del_flag: 1 })
        let query
        query = pg('notification as n')
            .select(
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '00:01' AND to_char(n.time_event, 'hh24:mi') <= '03:59' THEN 1 END) AS time_00_04`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '04:00' AND to_char(n.time_event, 'hh24:mi') <= '07:59' THEN 1 END) AS time_04_08`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '08:00' AND to_char(n.time_event, 'hh24:mi') <= '11:59' THEN 1 END) AS time_08_12`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '12:00' AND to_char(n.time_event, 'hh24:mi') <= '15:59' THEN 1 END) AS time_12_16`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '16:00' AND to_char(n.time_event, 'hh24:mi') <= '19:59' THEN 1 END) AS time_16_20`),
                pg.raw(`COUNT(CASE WHEN to_char(n.time_event, 'hh24:mi') >= '20:00' AND to_char(n.time_event, 'hh24:mi') <= '23:59' THEN 1 END) AS time_20_00`),
                pg.raw(`COUNT(n.ni_id) AS count_noti`),
                pg.raw(`COUNT(DISTINCT p_.pat_id) AS count_pat`),
                pg.raw(`COUNT(DISTINCT d.device_ip) AS count_device`),

            )
            .innerJoin('device_master as d', 'd.device_ip', '=', 'n.device_ip')
            .innerJoin('patient_master as p_', 'p_.pat_id', '=', 'd.pat_id')

        if (role == 1 || role == 2) {
            query.innerJoin('division_master as dm', 'dm.subdistrict_id', '=', 'p_.subdistrict_id')
            query.where({ 'dm.division_id': division_id })
        }
        if (role == 3) {
            query.where({ 'p_.user_id': email })
        }
        if (start_date && end_date) {
            query.whereRaw(`to_char(time_event, 'YYYYMMDD') >= ? AND to_char(time_event, 'YYYYMMDD') <= ?`, [moment(start_date).format("YYYYMMDD"), moment(end_date).format("YYYYMMDD")]);
        }
        const select_divison = await query

        if (!select_divison) {
            return { code: true, status: 400, message: select_divison, data: [] };
        }
        let get_dis_count = pg.select('p_.disease').from('patient_master as p_')
        if (role == 1 || role == 2) {
            get_dis_count.innerJoin('division_master as dm', 'dm.subdistrict_id', '=', 'p_.subdistrict_id')
            get_dis_count.where({ 'dm.division_id': division_id })
        }
        if (role == 3) {
            get_dis_count.where({ 'p_.user_id': email })
        }
        const data_pat = await get_dis_count
        const dis_pat = data_pat.map(e => JSON.parse(e.disease))

        const get_Data_dis = await pg.select('*').from('disease_master').where({ del_flag: 1 }).orderBy('cd_id', 'asc')
        const a = get_Data_dis.map(e => {
            return ex = dis_pat.map(dis => {
                return dis.reduce((count, p) => {
                    if (p.cd_id === e.cd_id) {
                        return count + 1;
                    }
                    return count;
                }, 0);
            })

        });
        const sum = await Promise.all(a)
        const sums = sum.map(subarray => subarray.reduce((acc, val) => acc + val, 0));
        return { code: false, status: 200, message: "success", data: select_divison, count: { sums, data: get_Data_dis } };

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
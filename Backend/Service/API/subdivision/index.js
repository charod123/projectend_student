const config = require("../../../config/config");
const pgcon = require("../../../pgConnection/pgCon");
const pgcon_knex = require("../../../pgConnection/pgCon_for_kenx");
const moment = require('moment');
const { get_id } = require("../get-id");
const pg = config.connectionString_pg();
const get_subdivison = async ({ }, { email, role, subdistrict_id, division_id }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const select_division = await pg('division_master')
            .select('sm.*', 'dm.division_id', 'dm.division_name')
            .from('subdivision_master as sm')
            .join('division_master as dm', 'sm.division_id', 'dm.division_id')
            .where('sm.del_flag', '1')
            .andWhere('dm.division_id', division_id);
        if (!select_division) {
            return { code: true, status: 400, message: select_division, data: [] };
        }
        const data = await select_division.map(e => {
            e.create_date = moment(e.create_date).format('YYYY-MM-DD HH:mm:ss');
            e.update_date = moment(e.update_date).format('YYYY-MM-DD HH:mm:ss');
            return e;
        })
        return { code: false, status: 200, message: "success", data: data };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const insert_subdivison = async ({ subdivision_name }, { division_id, email, role }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!subdivision_name || !division_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const get_maxid_subdivision = await get_id({ table: 'subdivision_master', filed: 'subdivision_id' })
        const table = 'subdivision_master'
        const script = {
            subdivision_id: get_maxid_subdivision.data,
            subdivision_name: subdivision_name,
            create_by: email,
            create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            update_date: null,
            del_flag: '1',
            division_id: division_id
        }
        const r1 = await pg(table).insert(script)
        if (!r1) {
            return { code: true, status: 400, message: r1, data: [] };
        }

        return { code: false, status: 200, message: "success", data: r1 };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_subdivison = async ({ subdivision_id, subdivision_name }, { email, role }) => {
    try {
        if (!(+role == 1 || +role == 2)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const table = 'subdivision_master'
        const r1 = await pg(table).update({ subdivision_name: subdivision_name, update_date: moment().format("YYYY-MM-DD HH:mm:ss") }).where({ subdivision_id: subdivision_id, del_flag: '1' })
        if (!r1) {
            return { code: true, status: 400, message: r1, data: [] };
        }


        return { code: false, status: 200, message: "success", data: r1 };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_subdivison = async ({ subdivision_id }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const insert_divison = await pg('subdivision_master').update({ del_flag: '0', update_date: moment().format("YYYY-MM-DD HH:mm:ss") }).where({ subdivision_id: subdivision_id })
        if (!insert_divison) {
            return { code: true, status: 400, message: insert_divison, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_divison };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_subdivison, insert_subdivison, update_subdivison, delete_subdivison }
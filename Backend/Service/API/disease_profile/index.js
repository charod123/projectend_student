// const { execute, get } = require("../../../pgconnection/pgCon");
const { connectionString, connectionString_pg } = require("../../../config/config");
const moment = require('moment');
const { get_id } = require("../get-id");
const pg = connectionString_pg();
const get_disease_manage = async ({ }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role !== 3) {
            const result = await pg.select('*').from('disease_master').where({ del_flag: '1' }).orderBy('cd_id', 'asc');
            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const create_disease = async ({ cd_id, cd_name }, { email, role, division_id }) => {
    try {
        if (+role !== 3) {
            if ((!cd_id || !cd_name)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('disease_master').insert({
                cd_id: cd_id,
                cd_name,
                create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                del_flag: '1',
            });

            if (!pat_master) {
                return { code: true, status: 400, message: "Error inserting data", data: [] };
            }

            return { code: false, status: 200, message: "success", data: pat_master };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_disease = async ({ cd_id, cd_name }, { email, role, division_id }) => {
    try {
        if (+role !== 3) {
            if ((!cd_id || !cd_name)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('disease_master').update({
                cd_name,
                update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            }).where({ cd_id: cd_id })

            if (!pat_master) {
                return { code: true, status: 400, message: "Error inserting data", data: [] };
            }

            return { code: false, status: 200, message: "success", data: pat_master };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const delete_disease = async ({ cd_id }, { email, role, division_id }) => {
    try {
        if (+role !== 3) {
            if ((!cd_id)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('disease_master').update({
                update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                del_flag: '0',
            }).where({ cd_id: cd_id })

            if (!pat_master) {
                return { code: true, status: 400, message: "Error inserting data", data: [] };
            }

            return { code: false, status: 200, message: "success", data: pat_master };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}


module.exports = {
    delete_disease,
    get_disease_manage,
    create_disease,
    update_disease
}

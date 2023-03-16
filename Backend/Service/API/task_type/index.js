const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment');
const { readfile_ } = require("../../readfile");
const pg = config.connectionString_pg();

const insert_task_type = async ({ task_type_id, task_type_name }, { email, role, subdivision_id }) => {
    try {

        if (!task_type_id || !task_type_name) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (role != 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }

        const insert_task = await pg('task_type').insert({
            task_type_id,
            task_type_name,
            create_by: email,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            del_flag: '1'
        })

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_task_type = async ({ task_type_id, task_type_name }, { email, role, subdivision_id }) => {
    try {

        if (!task_type_id || !task_type_name) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (role != 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }

        const insert_task = await pg('task_type').update({
            task_type_name,
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).where({ task_type_id: task_type_id })

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const delete_task_type = async ({ task_type_id }, { email, role, subdivision_id }) => {
    try {

        if (!task_type_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (role != 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }

        const insert_task = await pg('task_type').update({
            del_flag: '0',
        }).where({ task_type_id: task_type_id })

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { insert_task_type, update_task_type, delete_task_type }
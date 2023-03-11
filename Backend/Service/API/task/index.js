const config = require("../../../config/config");
const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment');
const { readfile_ } = require("../../readfile");
const pg = config.connectionString_pg();
const fs = require('fs')
const path = require('path');
const get_task = async ({ }, { email, role, subdivision_id, division_id }) => {
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }

        const insert_task = await pg.select('*').from('task').innerJoin('task_type as tt', 'tt.task_type_id', 'task.task_type_id')
        .where({ subdivision_id: subdivision_id })
        .andWhere({ 'task.task_type_id': '1' })
        .orWhere({ 'task.opener_task': email })
        .orderBy('task.start_date', 'desc');
        const data_ = await insert_task.map(async (e) => {
            const file = await readfile_({ id: `tsk-${e.task_id}`, full_path: e.file_path })
                .then((e) => e)
                .catch((err) => err);
            e.file = file
            return e
        })
        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }
        return { code: false, status: 200, message: "success", data: await Promise.all(data_) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const insert_task = async ({ values }, { email, role, subdivision_id }) => {
    try {
        const chk_Data = values.map(e => {
            if (!e.task_id || !e.task_title || !e.task_detail || !e.start_date || !e.end_date || !e.status || !e.file_path || !e.task_type_id || !e.del_flag || !e.real_work) {
                return true
            }
            return false

        })
        const chk = chk_Data.filter(x => x == true);
        if (chk.length > 0) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (+role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        for (let i = 0; i < values.length; i++) {
            const tsk = values[i];
            const insert_task = await pg('task').insert({
                task_id: tsk.task_id,
                task_title: tsk.task_title,
                task_detail: tsk.task_detail,
                start_date: moment(tsk.start_date).format("YYYY-MM-DD HH:mm:ss"),
                end_date: moment(tsk.end_date).format("YYYY-MM-DD HH:mm:ss"),
                opener_task: email,
                status: tsk.status,
                file_path: tsk.file_path,
                task_type_id: tsk.task_type_id,
                create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                del_flag: tsk.del_flag,
                subdivision_id: subdivision_id,
                user_id: email,
                remark: tsk.remark,
                real_work: tsk.real_work
            })

            if (!insert_task) {
                return { code: true, status: 400, message: insert_task, data: [] };
            }
        }


        return { code: false, status: 200, message: "success", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_task = async ({ values }, { email, role, subdivision_id }) => {
    try {
        const chk_Data = values.map(e => {
            if (!e.task_id || !e.task_title || !e.start_date || !e.end_date || !e.opener_task || !e.status || !e.file_path || !e.task_type_id || !e.del_flag || !e.real_work) {
                return true
            }
            return false

        })
        const chk = chk_Data.filter(x => x == true);
        if (chk.length > 0) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (+role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        for (let i = 0; i < values.length; i++) {
            const tsk = values[i];
            const insert_task = await pg('task').update({
                task_title: tsk.task_title,
                task_detail: tsk.task_detail,
                start_date: moment(tsk.start_date, 'YYYY-MM-DD').format("YYYY-MM-DD HH:mm:ss"),
                end_date: moment(tsk.end_date, 'YYYY-MM-DD').format("YYYY-MM-DD HH:mm:ss"),
                opener_task: email,
                task_type_id: tsk.task_type_id,
                update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                user_id: email,
                remark: tsk.remark,
                real_work: tsk.real_work
            }).where({ task_id: tsk.task_id })

            if (!insert_task) {
                return { code: true, status: 400, message: insert_task, data: [] };
            }
        }


        return { code: false, status: 200, message: "success", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_task = async ({ task_id }, { email, role }) => {
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!task_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const insert_task = await pg('task').update({
            status: '0'
        }).where({ task_id: task_id })

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: insert_task };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_type_task = async ({ }, { email, role }) => {
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const get_type_task = await pg.select('*').from('task_type').where({ del_flag: '1' })
        if (!get_type_task) {
            return { code: true, status: 400, message: get_type_task, data: [] };
        }
        return { code: false, status: 200, message: "success", data: get_type_task };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_file = async ({ task_id, file_name }, { email, role }) => {
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const path_read = path.join(__dirname, `../../../resources/assets/task-file/${task_id}`)
        fs.unlink(path.join(path_read, file_name), (unlinkErr) => {
            if (unlinkErr) {
                return { code: true, status: 400, message: unlinkErr, data: [] };
                // return console.error(`Error deleting file: ${unlinkErr}`);
            }
        });

        return { code: false, status: 200, message: "success", data: 'success' };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_task, insert_task, update_task, delete_task, get_type_task, delete_file }
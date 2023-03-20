const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
const moment = require('moment');
const { readfile_ } = require("../../readfile");
const pg = config.connectionString_pg();
const fs = require('fs')
const path = require('path');
const get_user_in_subdivision = async ({ }, { email, role, subdivision_id, division_id }) => {
    try {
        if (role != 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const insert_task = await pg.select('*').from('user_master as um')
            .innerJoin('employee as emp', 'emp.user_id', 'um.user_id')
            .innerJoin('subdivision_master as sm', 'sm.subdivision_id', 'emp.subdivision_id')
            .innerJoin('user_profile as up', 'up.user_pro_id', 'um.user_pro_id')
            .where({ 'emp.subdivision_id': subdivision_id })
            .andWhere({ 'um.role_id': '2' })
            .andWhere({ 'um.del_flag': '1' })

        const data_ = await insert_task.map(e => {
            e.fullname = e.fristname + ' ' + e.lastname + ' ' + 'หน่วยงาน' + ' ' + e.subdivision_name
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
const get_task = async ({ }, { email, role, subdivision_id, division_id }) => {
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        let sql = pg.select('task.*', 'tt.task_type_id', 'tt.task_type_name').from('task').innerJoin('task_type as tt', 'tt.task_type_id', 'task.task_type_id')



        if (role == 1) {
            sql = sql.where({ subdivision_id: subdivision_id })
            // sql = sql.andWhere('status', '=', '2')
            // sql = sql.orWhere('status', '=', '3')
            sql = sql.orderBy('task.start_date', 'desc');
        }
        if (role == 2) {
            sql = sql.where({ subdivision_id: subdivision_id })
            sql = sql.andWhere({ 'task.task_type_id': '1' })
            sql = sql.orWhere((builder) => {
                builder.orWhere({ 'task.opener_task': email })
                    .orWhere({ 'task.person_responsible': email })
            })
            sql = sql.orderBy('task.start_date', 'desc');
        }
        const insert_task = await sql
        // ('task')
        //     .where((builder) => {
        //         builder.where({ 'task.task_type_id': '1' })
        //             .orWhere({ 'task.opener_task': email })
        //             .orWhere({ 'task.person_responsible': email })
        //     })
        //     .orderBy('task.start_date', 'desc');

        const data_ = await insert_task.map(async (e) => {
            const file = await readfile_({ id: `tsk-${e.task_id}`, full_path: e.file_path }).then((e) => e).catch((err) => err);
            e.start_date = moment(e.start_date).format("YYYY-MM-DD HH:mm:ss")
            e.end_date = moment(e.end_date).format("YYYY-MM-DD HH:mm:ss")
            e.create_date = moment(e.create_date).format("YYYY-MM-DD HH:mm:ss")
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
            let sc = {}
            if (tsk.task_type_id != 1) {
                const insert_task = await pg.select('up.fristname', 'up.lastname').from('user_master as um')
                    .innerJoin('user_profile as up', 'up.user_pro_id', 'um.user_pro_id').where({ 'um.email': email })

                sc = {
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
                    real_work: tsk.real_work,
                    person_responsible: !tsk.user_id ? email : tsk.user_id
                }
            }
            if (tsk.task_type_id == 1) {
                const insert_task = await pg.select('subdivision_name').from('subdivision_master').where({ subdivision_id: subdivision_id })
                sc = {
                    task_id: tsk.task_id,
                    task_title: tsk.task_title,
                    task_detail: tsk.task_detail,
                    start_date: moment(tsk.start_date).format("YYYY-MM-DD HH:mm:ss"),
                    end_date: moment(tsk.end_date).format("YYYY-MM-DD HH:mm:ss"),
                    opener_task: !tsk.user_id ? email : tsk.user_id,
                    status: tsk.status,
                    file_path: tsk.file_path,
                    task_type_id: tsk.task_type_id,
                    create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    del_flag: tsk.del_flag,
                    subdivision_id: subdivision_id,
                    user_id: !tsk.user_id ? email : tsk.user_id,
                    remark: tsk.remark,
                    real_work: tsk.real_work,
                    person_responsible: insert_task[0].subdivision_name

                }
            }
            const insert_task = await pg('task').insert(sc)

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
                start_date: moment(tsk.start_date).format("YYYY-MM-DD HH:mm:ss"),
                end_date: moment(tsk.end_date).format("YYYY-MM-DD HH:mm:ss"),
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
const update_end_task = async ({ end_task, task }, { email, role, subdivision_id }) => {
    try {

        if (!task.task_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (+role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        let sql = pg('task')
        if (role == 1) {

            sql = sql.update({ recommend: end_task, status: '3' }).where({ task_id: task.task_id })
        }
        if (role == 2) {
            let status
            if (moment(task.end_date).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
                status = '4'
            }
            if (moment(task.end_date).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) {
                status = '2'
            }
            sql = sql.update({ detail_end_html: end_task, status: status }).where({ task_id: task.task_id })
        }
        const insert_task = await sql

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: insert_task };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const update_status_task = async ({ status, task_id }, { email, role, subdivision_id }) => {
    try {

        if (!status || !task_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (+role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        // const select_user = await pg.select('up.fristname', 'up.lastname').from('user_master as um')
        // .innerJoin('user_profile as up', 'up.user_pro_id', 'um.user_pro_id').where({ 'um.email': email })
        const insert_task = await pg('task').update({ status: status == 1 ? 8 : 3, person_responsible: email }).where({ task_id: task_id }).returning('status')

        if (!insert_task) {
            return { code: true, status: 400, message: insert_task, data: [] };
        }


        return { code: false, status: 200, message: "success", data: insert_task };

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


module.exports = { get_task, insert_task, update_task, delete_task, get_type_task, delete_file, update_status_task, update_end_task, get_user_in_subdivision }
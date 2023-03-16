const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require("moment");
const { readfile_ } = require("../../../readfile");
moment.locale("th");
const pg = config.connectionString_pg();
const get_dashboard_task = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    console.log(email, role);
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (role == 2) {

            const task = await pg('task as t')
                .join('task_type as tt', 'tt.task_type_id', 't.task_type_id')
                .where('t.subdivision_id', subdivision_id)
                .andWhere('t.create_date', '>', start_date)
                .andWhere('t.create_date', '<', end_date)
                .andWhere((builder) => {
                    builder.where('t.task_type_id', 1)
                        .orWhere('t.opener_task', email)
                        .orWhere('t.person_responsible', email);
                })
                .select(
                    pg.raw('COUNT(t.task_id) as all_task'),
                    pg.raw(`SUM(CASE WHEN t.status = '1' THEN 1 ELSE 0 END) as open_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '2' THEN 1 ELSE 0 END) as pending_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '3' THEN 1 ELSE 0 END) as success_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '4' THEN 1 ELSE 0 END) as late_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '8' THEN 1 ELSE 0 END) as action_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '0' THEN 1 ELSE 0 END) as cancel_task`)
                );

            const taskTypes = await pg.select('task_type_id')
                .from('task_type')
                .where({ del_flag: '1' });

            const taskTypePromises = taskTypes.map(async (taskType) => {
                const countTaskType = await pg('task')
                    .select(pg.raw(`SUM(CASE WHEN task_type_id = '${taskType.task_type_id}' THEN 1 ELSE 0 END) as count_task_type`))
                    .where('subdivision_id', subdivision_id)
                    .andWhere('create_date', '>', start_date)
                    .andWhere('create_date', '<', end_date)
                    .andWhere({ del_flag: '1' })
                    .andWhere((builder) => {
                        builder.where('task_type_id', taskType.task_type_id)
                            .orWhere('opener_task', email)
                            .orWhere('person_responsible', email);
                    });

                return {
                    task_type_id: taskType.task_type_id,
                    count_task_type: countTaskType[0].count_task_type,
                };
            });



            return { code: false, status: 200, message: "success", data: { task: task[0], task_type: await Promise.all(taskTypePromises) } };

        }
        if (role == 1) {
            const user = await pg('user_master as um')
                .count('um.user_id')
                .join('employee as emp', 'emp.user_id', '=', 'um.user_id')
                .join('subdivision_master as sm', 'sm.subdivision_id', '=', 'emp.subdivision_id')
                .where('sm.subdivision_id', '=', subdivision_id);


            const task = await pg('task as t')
                .join('task_type as tt', 'tt.task_type_id', 't.task_type_id')
                .where('t.subdivision_id', subdivision_id)
                .andWhere('t.create_date', '>', start_date)
                .andWhere('t.create_date', '<', end_date)
                .andWhere({ 't.del_flag': '1' })

                .select(
                    pg.raw('COUNT(t.task_id) as all_task'),
                    pg.raw(`SUM(CASE WHEN t.status = '1' THEN 1 ELSE 0 END) as open_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '2' THEN 1 ELSE 0 END) as pending_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '3' THEN 1 ELSE 0 END) as success_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '4' THEN 1 ELSE 0 END) as late_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '8' THEN 1 ELSE 0 END) as action_task`),
                    pg.raw(`SUM(CASE WHEN t.status = '0' THEN 1 ELSE 0 END) as cancel_task`)
                )
            const tasl_type_count = await pg.select('*').from('task_type as tt').where({ 'tt.del_flag': '1' })
            const task_type = tasl_type_count.map(async (e) => {
                const task = await pg('task').select(pg.raw(`SUM(CASE WHEN task_type_id = '${e.task_type_id}' THEN 1 ELSE 0 END) as count_task_type`))
                    .where('task.subdivision_id', subdivision_id)
                    .andWhere('task.create_date', '>', start_date)
                    .andWhere('task.create_date', '<', end_date)
                    .andWhere({ 'task.del_flag': '1' })

                return task[0]
            })

            return { code: false, status: 200, message: "success", data: { task: task[0], user: user[0], task_type: await Promise.all(task_type) } };

        }



    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};
const get_data_on_import = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    try {
        let query = knex('notification AS p_')
            .select('p_.*', 'dm.*', 'pm.*', 'up.*')
            .innerJoin('device_master AS dm', 'p_.device_ip', 'dm.device_ip')
            .innerJoin('patient_master AS pm', 'pm.pat_id', 'dm.pat_id')
            .innerJoin('user_master AS um', 'um.email', 'pm.user_id')
            .innerJoin('user_profile AS up', 'up.user_pro_id', 'pm.user_pro_id')
        let countQuery = knex('notification AS p_')
            .count('p_.ni_id as count')
            .innerJoin('device_master AS dm', 'p_.device_ip', 'dm.device_ip')
            .innerJoin('patient_master AS pm', 'pm.pat_id', 'dm.pat_id')
            .innerJoin('user_master AS um', 'um.email', 'pm.user_id')
            .innerJoin('user_profile AS up', 'up.user_pro_id', 'pm.user_pro_id')


        if (!(+role == 1 || +role == 2)) {
            query = query.where('um.email', '=', email);
            query = query.andWhere('p_.del_flag', '=', '1')
            query = query.andWhere('dm.del_flag', '=', '1');
            query = query.andWhere('p_.time_event', '>', start_date);
            query = query.andWhere('p_.time_event', '<', end_date);
            countQuery = countQuery.where('um.email', '=', email);
            countQuery = countQuery.andWhere('p_.del_flag', '=', '1')
            countQuery = countQuery.andWhere('dm.del_flag', '=', '1');
            countQuery = countQuery.andWhere('p_.time_event', '>', start_date);
            countQuery = countQuery.andWhere('p_.time_event', '<', end_date);
        } else {
            query = query.where('pm.subdistrict_id', '=', subdistrict_id);
            query = query.andWhere('p_.del_flag', '=', '1')
            query = query.andWhere('dm.del_flag', '=', '1');
            query = query.andWhere('p_.time_event', '>', start_date);
            query = query.andWhere('p_.time_event', '<', end_date);
            countQuery = countQuery.where('pm.subdistrict_id', '=', subdistrict_id);
            countQuery = countQuery.andWhere('p_.del_flag', '=', '1')
            countQuery = countQuery.andWhere('dm.del_flag', '=', '1');
            countQuery = countQuery.andWhere('p_.time_event', '>', start_date);
            countQuery = countQuery.andWhere('p_.time_event', '<', end_date);
        }

        query = query.orderBy('p_.time_event', 'desc').limit(!limit ? 200 : limit);

        const pat_master = await query;
        const select_count = await countQuery;

        if (!pat_master || !select_count) {
            return { code: true, status: 400, message: 'Error retrieving data.', data: [] };
        }
        const data = await Promise.all(
            pat_master.map(async (e) => {
                const img = await readfile_({ id: `pat-${e.pat_id}`, full_path: e.img_path }).then((e) => e[0]).catch(err => err);
                e.time_event_table = moment(e.time_event).format("LLLL");
                e.time_event = moment(e.time_event).format("YYYY-MM-DD HH:mm:ss");
                e.device_time = moment(e.device_time).format("YYYY-MM-DD HH:mm:ss");
                e.create_date = moment(e.create_date).format("YYYY-MM-DD HH:mm:ss");
                e.update_date = moment(e.update_date).format("YYYY-MM-DD HH:mm:ss");
                e.img_path = img
                e.birthday = moment(new Date()).format("YYYY") - moment(e.birthday).format("YYYY")
                return e;
            })
        );

        return { code: false, status: 200, message: "success", data: data, count: select_count[0].count };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

module.exports = {
    get_dashboard_task,
    get_data_on_import

};

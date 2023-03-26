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
const get_task_on_report = async ({ task_type_id, subdivision_id_ }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    try {
        let taskList = pg('task as t')
            .leftJoin('task_type as tt', 'tt.task_type_id', 't.task_type_id')
            .leftJoin('user_master as um', 'um.email', 't.opener_task')
            .leftJoin('user_master as umm', 'umm.email', 't.person_responsible')
            .leftJoin('user_profile as upp', 'upp.user_pro_id', 'umm.user_pro_id')
            .leftJoin('user_profile as up', 'up.user_pro_id', 'um.user_pro_id')
            .leftJoin('subdivision_master as sm', 'sm.subdivision_id', 't.subdivision_id')
            .leftJoin('division_master as dm', 'dm.division_id', 'sm.division_id')
            .select(
                pg.raw(
                    `CASE WHEN t.status = '1' THEN 'งานเปิด' 
                  WHEN t.status = '2' THEN 'งานที่ดำเนินการ' 
                  WHEN t.status = '3' THEN 'งานปิด' 
                  WHEN t.status = '4' THEN 'งานสาย'
                  WHEN t.status = '8' THEN 'งานที่กำลังดำเนินการ' 
                  WHEN t.status = '0' THEN 'งานยกเลิก' END as status_task`
                ),
                'tt.task_type_name',
                pg.raw(`concat(up.fristname,' ',up.lastname) as open_task`),
                pg.raw(`concat(upp.fristname,' ',upp.lastname) as person_responsible`),
                'sm.subdivision_name',
                'dm.division_name',
                't.start_date',
                't.end_date'

            ).where({ 't.del_flag': 1 })
        if (role == 2) {
            taskList.andWhere('t.subdivision_id', subdivision_id)
            if (task_type_id != 9.9) {
                taskList.andWhere('t.task_type_id', task_type_id)
                taskList.andWhere((builder) => {
                    builder.where('t.task_type_id', 1)
                        .orWhere('t.opener_task', email)
                        .orWhere('t.person_responsible', email);
                })
            }

        }
        if (role == 1) {
            if (subdivision_id_ != 9.9 && task_type_id != 9.9) {
                taskList.andWhere('t.subdivision_id', subdivision_id_)
                taskList.andWhere('t.task_type_id', task_type_id)
            }
            if (subdivision_id_ != 9.9) {
                taskList.andWhere('t.subdivision_id', subdivision_id_)
            }
            if (task_type_id != 9.9) {
                taskList.andWhere('t.task_type_id', task_type_id)
            }

        }
        const data = await taskList
        const data__ = await data.map(e => {
            e.start_date = moment(e.start_date,'YYYY-MM-DD').format('DD/MM/YYYY')
            e.end_date = moment(e.end_date,'YYYY-MM-DD').format('DD/MM/YYYY')
            return e
        })
        return { code: false, status: 200, message: "success", data: await Promise.all(data__) };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }

}
module.exports = {
    get_dashboard_task,
    get_task_on_report

};

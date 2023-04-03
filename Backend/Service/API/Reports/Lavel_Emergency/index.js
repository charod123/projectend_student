const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require("moment");
moment.locale("th");
const pg = config.connectionString_pg();
const get_lavel_emergency = async ({ start_date, end_date }, { email, role, subdistrict_id, division_id, subdivision_id }) => {
    console.log(email, role);
    try {
        if (role == 3) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (role == 2) {

            // const pat_count = pg('notification AS n_')
            //     .innerJoin('device_master AS dm', 'dm.device_ip', 'n_.device_ip')
            //     .innerJoin('patient_master AS p_', 'p_.pat_id', 'dm.pat_id')
            //     .select('p_.*')
            //     .count('* AS total_records')
            //     .groupBy('p_.pat_id')
            //     .as('pat_count');

            // const max_pat_count = pg(pat_count).max('total_records AS total_records');
            // const min_pat_count = pg(pat_count).min('total_records AS total_records');

            // const result = pg.unionAll([
            //     pg(pat_count)
            //         .select('*', pg.raw('total_records, \'max\' AS type'))
            //         .whereIn('total_records', max_pat_count),
            //     pg(pat_count)
            //         .select('*', pg.raw('total_records, \'min\' AS type'))
            //         .whereIn('total_records', min_pat_count),
            // ]);

            // console.log(result.toSQL().sql);

            // const taskTypes = await pg.select('task_type_id')
            //     .from('task_type')
            //     .where({ del_flag: '1' });

            // const taskTypePromises = taskTypes.map(async (taskType) => {
            //     const countTaskType = await pg('task')
            //         .select(pg.raw(`SUM(CASE WHEN task_type_id = '${taskType.task_type_id}' THEN 1 ELSE 0 END) as count_task_type`))
            //         .where('subdivision_id', subdivision_id)
            //         .andWhere('create_date', '>', start_date)
            //         .andWhere('create_date', '<', end_date)
            //         .andWhere({ del_flag: '1' })
            //         .andWhere((builder) => {
            //             builder.where('task_type_id', taskType.task_type_id)
            //                 .orWhere('opener_task', email)
            //                 .orWhere('person_responsible', email);
            //         });

            //     return {
            //         task_type_id: taskType.task_type_id,
            //         count_task_type: countTaskType[0].count_task_type,
            //     };
            // });


            const ni = await pg('notification as n_')
                .select('p_.*')
                .count('n_.ni_id as emergency_count')
                .innerJoin('device_master as dm', 'dm.device_ip', 'n_.device_ip')
                .innerJoin('patient_master as p_', 'p_.pat_id', 'dm.pat_id')
                .groupBy('p_.pat_id')

            const avg = ni.reduce((sum, p) => sum + p.emergency_count, 0) / patientData.length;

            const stdDev = Math.sqrt(
                ni.reduce((sum, p) => sum + Math.pow(p.emergency_count - avg, 2), 0) / patientData.length
            );

            const patient = ni.find((p) => p.pat_id === 1);
            let risk = '';

            if (patient.emergency_count >= riskLevels.low.min && patient.emergency_count <= riskLevels.low.max) {
                risk = 'น้อย';
            } else if (patient.emergency_count >= riskLevels.moderateLow.min && patient.emergency_count <= riskLevels.moderateLow.max) {
                risk = 'ค่อนข้างน้อย';
            } else if (patient.emergency_count >= riskLevels.moderateHigh.min && patient.emergency_count <= riskLevels.moderateHigh.max) {
                risk = 'ปานกลาง';
            } else if (patient.emergency_count >= riskLevels.high.min && patient.emergency_count <= riskLevels.high.max) {
                risk = 'ค่อนข้างมาก';
            } else {
                risk = 'มาก';
            }

            console.log(`ความเสี่ยงของผู้ป่วย ${patient.pat_id}: ${risk}`);


            return { code: false, status: 200, message: "success", data: { task: task[0], task_type: await Promise.all(taskTypePromises) } };




        }



    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};

module.exports = {
    get_lavel_emergency,

};

const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
const moment = require("moment");
const { readfile_ } = require("../../readfile");
const { get_id } = require("../get-id");
moment.locale("th");
const knex = config.connectionString_pg();
const get_notify = async ({ limit }, { email, role, subdistrict_id, division_id }) => {
  console.log(email, role);
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
      countQuery = countQuery.where('um.email', '=', email);
      countQuery = countQuery.andWhere('p_.del_flag', '=', '1')
      countQuery = countQuery.andWhere('dm.del_flag', '=', '1');
    } else {
      query = query.where('pm.subdistrict_id', '=', subdistrict_id);
      query = query.andWhere('p_.del_flag', '=', '1')
      query = query.andWhere('dm.del_flag', '=', '1');
      countQuery = countQuery.where('pm.subdistrict_id', '=', subdistrict_id);
      countQuery = countQuery.andWhere('p_.del_flag', '=', '1')
      countQuery = countQuery.andWhere('dm.del_flag', '=', '1');
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
        e.time_event_dashborad = moment(e.time_event, 'YYYY-MM-DD HH:mm:ss').fromNow();
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
};
const performance_record_notify = async ({ detail_deliver, detail_patient, ni_id, lavel, agency_more, internal_division, pat_data }, { email, role, subdistrict_id, subdivision_id, division_id }) => {
  console.log(email, role);
  try {
    // if (+role == 2) {
    // const pat_master = await pgcon.execute(`UPDATE notification SET detail_deliver ='${detail_deliver}',update_date=now(), detail_patient='${detail_patient}',agency_more='${JSON.stringify(agency_more)}',lavel='${lavel}' WHERE del_flag = '1'  AND ni_id = '${ni_id}'`, config.connectionString());
    // if (pat_master.code) {
    //   return { code: true, status: 400, message: pat_master.message, data: [] };
    // }
    const result = await knex('notification')
      .update({
        detail_deliver: detail_deliver,
        update_date: knex.fn.now(),
        detail_patient: detail_patient,
        agency_more: JSON.stringify(agency_more),
        internal_division: JSON.stringify(internal_division),
        lavel: lavel
      })
      .where('del_flag', '1')
      .andWhere('ni_id', ni_id);
    let insert_task = knex.select('subdivision_id', 'subdivision_name').from('subdivision_master')
    for (let i = 0; i < internal_division.length; i++) {
      const ind = internal_division[i];
      if (i == 0) {
        insert_task = insert_task.where('subdivision_name', 'like', `%${ind}%`)
      }
      if (i > 0) {
        insert_task = insert_task.orWhere('subdivision_name', 'like', `%${ind}%`);
      }

    }
    const select_sub = await insert_task
    for (let q = 0; q < select_sub.length; q++) {
      const sub = select_sub[q];
      const id_max = await get_id({ filed: 'task_id', table: 'task' })
      const insert_task_ = await knex('task').insert({
        task_id: id_max.data,
        task_title: 'งานระบบเฝ้าระวังฉุกงาน',
        task_detail: lavel,
        start_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment().add(1, 'day').format("YYYY-MM-DD HH:mm:ss"),
        opener_task: 'system',
        status: '1',
        file_path: 'resources/assets/task-file',
        task_type_id: '1',
        create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        del_flag: '1',
        subdivision_id: sub.subdivision_id,
        user_id: 'system',
        remark: `
        <p>link ที่อยู่ของผู้ป่วย ${`https://www.google.com/maps/place/${pat_data.device[0].latitude},${pat_data.device[0].longgitude}`}</p>
        <p>link ชื่อ-นามสกุล ${`${pat_data.pat[0].fristname}  ${pat_data.pat[0].lastname}`} เพศ ${pat_data.pat[0].gender}</p>
        `,
        real_work: '8',
        person_responsible: sub.subdivision_name

      })
      if (!insert_task_) {
        return { code: true, status: 400, message: insert_task_, data: [] };

      }
    }

    if (result === 0) {
      return { code: true, status: 400, message: 'Update failed', data: [] };
    }
    return { code: false, status: 200, message: "success", data: result };
    // }
    // return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }
};

module.exports = {
  get_notify,
  performance_record_notify
};

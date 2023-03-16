const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
const moment = require("moment");
// const { readfile_ } = require("../../readfile");
moment.locale("th");
const knex = config.connectionString_pg();
const get_on_role = async ({ }, { email, role }) => {
  try {
    const priority = await knex('priority_config')
      .join('priority', 'priority.priority_id', '=', 'priority_config.priority_id')
      .select('priority.priority_id','priority_config.can_delete','priority_config.can_read','priority_config.can_export','priority_config.can_write','priority_config.role_id')
      .where('priority.del_flag', '=', '1')
      .andWhere('priority_config.role_id', '=', role);

    return {
      code: false,
      status: 200,
      message: 'success',
      data: priority,
    };
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }
};
const get_priority = async ({ }, { email, role }) => {
  try {
    if (+role !== 1) {
      return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
    }
    const priority = await knex('priority_config')
      .innerJoin('priority', 'priority.priority_id', 'priority_config.priority_id')
      .select('*')
      .where('priority.del_flag', '1');

    return {
      code: false,
      status: 200,
      message: "success",
      data: priority,
    };
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }
};
const update_priority = async ({ priority }, { email, role }) => {
  try {
    if (+role !== 1) {
      return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
    }
    if (!priority) {
      return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
    }

    for (let i = 0; i < priority.length; i++) {
      const e = priority[i];
      const { can_read, can_write, can_delete, can_export, priority_id, role_id } = e;

      await knex('priority_config')
        .where({ priority_id, role_id })
        .update({ can_read, can_write, can_delete, can_export });
    }

    return {
      code: false,
      status: 200,
      message: "success",
      data: priority,
    };
  } catch (error) {
    return { code: true, status: 400, message: error.message, data: [] };
  }
};
module.exports = {
  get_priority,
  update_priority,
  get_on_role
};

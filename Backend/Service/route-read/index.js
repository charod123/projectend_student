const express = require("express");
const dynamicGetRouter = express.Router();
const { get_patient_all } = require('../API/patients');
const { get_subdivison } = require('../API/subdivision');
const { get_divison } = require('../API/division');
const { get_district, get_province, get_subdistrict, get_pro_dis_sub_by_id } = require('../API/pro_dis_sub');
const { get_disease } = require('../API/disease');
const { get_notify } = require('../API/notify');
const { get_priority, get_on_role } = require('../API/priority');
const { get_complain, get_type_complain, get_count_title } = require('../API/complain');
const { get_content, get_main_menu, get_content_on_show } = require('../API/content-diseases');
const { get_clint } = require('../API/clint');
const { get_user_admin, get_count_on_subdivision } = require('../API/Admin/user');
const { get_count_user_devive } = require('../API/login & Register/user');
const { get_type_task, get_task, get_user_in_subdivision } = require('../API/task');
const { get_dashboard_task } = require('../API/Reports/Tasks');
const { get_dashboard_count_time } = require('../API/Reports/Dashboard');

const resourceMethods = {
  get_patient_all: get_patient_all,
  get_subdivison: get_subdivison,
  get_pro_dis_sub_by_id: get_pro_dis_sub_by_id,
  get_divison: get_divison,
  get_province: get_province,
  get_district: get_district,
  get_subdistrict: get_subdistrict,
  get_disease: get_disease,
  get_notify: get_notify,
  get_priority: get_priority,
  get_complain, get_content,
  get_clint,
  get_type_complain,
  get_count_title,
  get_user_admin,
  get_count_on_subdivision,
  get_on_role,
  get_count_user_devive,
  get_main_menu,
  get_content_on_show,
  get_type_task,
  get_task,
  get_user_in_subdivision,
  get_dashboard_task,
  get_dashboard_count_time

};

dynamicGetRouter.post("/:resource", async (req, res) => {
  try {
    const resource = req.params.resource.split('-').join('_');
    const data = req.body;
    const auth = req.auth;
    if (!resource || !data || !Object.keys(resourceMethods).includes(resource)) {
      return res.status(404).send({ code: 404, error: 'Invalid resource or method or Your parameter is not correct. Please check parameter in body.' });
    }
    const result = await resourceMethods[resource](data, auth);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});



module.exports = { dynamicGetRouter };

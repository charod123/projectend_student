const express = require("express");
const dynamicWriteRouter = express.Router();
const { add_patient, update_patient, delete_patient } = require('../API/patients');
const { insert_subdivison, update_subdivison, delete_subdivison } = require('../API/subdivision');
const { create_complain, update_status_complain, delete_complain, update_complain } = require('../API/complain');
const { delete_divison, insert_divison, update_divison } = require('../API/division');
const { update_priority } = require('../API/priority');
const { performance_record_notify } = require('../API/notify');
const { create_content, update_content, create_main_menu, update_main_menu, delete_main_menu } = require('../API/content-diseases');
const { update_token_line } = require('../API/token-line');
const { insert_user_admin, delete_user_admin, update_user_admin } = require('../API/Admin/user');
const { delete_user, update_user } = require('../API/login & Register/user');
const { insert_task, delete_file, update_task, delete_task, update_status_task, update_end_task } = require('../API/task');
const { delete_task_type, insert_task_type, update_task_type } = require('../API/task_type');


const resourceMethods = {
  update_patient: update_patient,
  add_patient: add_patient,
  insert_subdivison: insert_subdivison,
  update_subdivison: update_subdivison,
  update_priority: update_priority,
  delete_subdivison: delete_subdivison,
  delete_divison,
  insert_divison,
  update_divison,
  delete_patient,
  create_complain,
  update_status_complain,
  performance_record_notify,
  create_content,
  update_content,
  update_token_line,
  delete_complain,
  insert_user_admin,
  delete_user_admin,
  update_user_admin,
  delete_user,
  update_user,
  create_main_menu,
  update_main_menu,
  delete_main_menu,
  insert_task,
  delete_file,
  update_task,
  delete_task,
  update_status_task,
  update_end_task,
  delete_task_type,
  insert_task_type,
  update_task_type,
  update_complain
};

dynamicWriteRouter.post("/:resource", async (req, res) => {
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





module.exports = { dynamicWriteRouter };

const express = require("express");
const dynamicLoginRouter = express.Router();
// const shell = require('shelljs')
// const path = require("path");
// const util = require("util");
// const maxSize = 5000 * 5000;
// const multer = require("multer");
const { register } = require('../API/login & Register/register');
const { Login } = require('../API/login & Register/login');
const { get_district, get_province, get_subdistrict, get_pro_dis_sub_by_id } = require('../API/pro_dis_sub');
const { get_id } = require('../API/get-id')
const resourceMethods = {
  register: register,
  login: Login,
  get_district,
  get_province,
  get_subdistrict,
  get_pro_dis_sub_by_id,
  get_id
};

dynamicLoginRouter.post("/:resource", async (req, res) => {
  try {
    const resource = req.params.resource.split('-').join('_');
    const data = req.body;
    if (!resource || !data || !Object.keys(resourceMethods).includes(resource)) {
      return res.status(404).send({ code: 404, error: 'Invalid resource or method or Your parameter is not correct. Please check parameter in body.' });
    }
    const result = await resourceMethods[resource](data);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});





module.exports = { dynamicLoginRouter };

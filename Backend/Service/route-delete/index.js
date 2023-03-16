const express = require("express");
const dynamicDeleteRouter = express.Router();
// const shell = require('shelljs')
// const path = require("path");
// const util = require("util");
// const multer = require("multer");

const resourceMethods = {

};

dynamicDeleteRouter.post("/:resource", async (req, res) => {
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



module.exports = { dynamicDeleteRouter };

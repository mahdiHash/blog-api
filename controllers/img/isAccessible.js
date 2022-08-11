const isImgAccessible = require('../../lib/img/isAccessible');
const { BadGatewayErr } = require('../../lib/errors');
const errHandler = require('../error');

const controller = async (req, res, next) => {
  let isAccessible;

  try {
    isAccessible = await isImgAccessible(req.params.imgName);
  }
  catch (err) {
    return errHandler(new BadGatewayErr(), req, res);
  }

  res.json(isAccessible);
}

module.exports = controller;

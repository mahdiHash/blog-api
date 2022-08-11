const md = require('markdown-it')({ breaks: true });

const controller = (req, res, next) => {
  let html = md.render(req.body.markdown).replaceAll(/\n/gm, '<br>');
  res.json(html);
};

module.exports = controller;

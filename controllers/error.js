const {
  ServerSideErr,
  BadRequestErr,
  LoginFailedErr,
  ForbiddenErr,
  UnauthorizedErr,
  BadGatewayErr,
  NotFoundErr,
} = require('../lib/errors');

// errors objects are returned to the client inside of an array.

function errHandler(errs, req, res) {
  if (!(errs instanceof Array)) {
    errs = [errs];
  }

  let resBody = {
    errors: errs,
    reqBody: req.body,
    reqParams: req.params,
    timestamp: new Date(),
  }

  // this section sets specific HTTP code based on the error.
  // If there's only 1 error, it might be an specific error
  // but if it's not, then we have a 400.
  if (errs.length == 1) {
    if (errs[0] instanceof ServerSideErr) {
      res.status(500);
    }
    else if (errs[0] instanceof ForbiddenErr) {
      res.status(403);
    }
    else if (errs[0] instanceof UnauthorizedErr) {
      res.status(401);
    }
    else if (errs[0] instanceof BadGatewayErr) {
      res.status(502);
    }
    else if (errs[0] instanceof NotFoundErr) {
      res.status(404);
    }
    // the err is a single BadRequest error
    else {
      res.status(400);
    }
  }
  // an array of bad request errors coming from signup form or 
  // user profile edit form
  else {
    res.status(400);
  }

  res.json(resBody);
}

module.exports = errHandler;

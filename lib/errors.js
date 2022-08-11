const errors = {};

errors.ServerSideErr = class extends Error {
  constructor(msg = 'An error occured in server') {
    super(msg);
    this.name = 'ServerSide';
    this.statusCode = 500;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.LoginFailedErr = class extends Error {
  constructor(msg = 'Username or password is wrong') {
    super(msg);
    this.name = 'loginFailed';
    this.statusCode = 400;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.BadRequestErr = class extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'BadRequest';
    this.statusCode = 400;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.ForbiddenErr = class extends Error {
  constructor(msg = 'You can not access the resource') {
    super(msg);
    this.name = 'Forbidden';
    this.statusCode = 403;
    
    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.UnauthorizedErr = class extends Error {
  constructor(msg = 'You are not authorized to access resource') {
    super(msg);
    this.name = 'Unauthorized';
    this.statusCode = 401;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.NotFoundErr = class extends Error {
  constructor(msg = 'Not Found') {
    super(msg);
    this.name = 'NotFoundErr';
    this.statusCode = 404;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

errors.BadGatewayErr = class extends Error {
  constructor(msg = 'Bad Gateway') {
    super(msg);
    this.name = 'BadGatewayErr';
    this.statusCode = 502;

    // make message property enumerable so res.json() can stringify it
    Object.defineProperty(this, 'message', {
      value: msg,
      configurable: false,
      writable: true,
      enumerable: true,
    });
  }
}

module.exports = errors;

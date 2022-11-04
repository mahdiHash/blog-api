const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const errHandler = require('./controllers/error');
const graphqlSchema = require('./graphQL/schema');
const { graphqlHTTP } = require('express-graphql');
const { ServerSideErr, NotFoundErr } = require('./lib/errors');

const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comment');
const imgRouter = require('./routes/img');
const postsRouter = require('./routes/post');
const likeDislikeRouter = require('./routes/like-dislike');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.get('/convertmdtohtml', require('./controllers/convertmdtohtml'));

app.use('/users', usersRouter);
app.use('/img', imgRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/ld', likeDislikeRouter);

app.post('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: process.env.NODE_ENV === 'development',
}));

// 404 hanlder
app.use((req, res, next) => {
  return errHandler(new NotFoundErr(), req, res);
});

// error handler 
app.use(function(err, req, res, next) {
  if (err) {
    console.log('\x1b[31m%s\x1b[0m', '!!!!!! Uncaught Error !!!!!!\n', req.originalUrl, '\n', err.stack);
    errHandler(new ServerSideErr(), req, res);
  }
});

module.exports = app;

# Blog-api

The idea of this project is taken from [Blog-API](https://www.theodinproject.com/lessons/nodejs-blog-api) of [The Odin Project](https://www.theodinproject.com).

My goal in this project was to practice authentication with [Passport-jwt](http://www.passportjs.org/packages/passport-jwt/) strategy, learn how to implement CRUD operations with [GraphQL](https://graphql.org), and build my first api. 

The technologies I used:
- JavaScript on server-side,
- [Node.js](https://nodejs.org/en) runtime environment,
- [Express.js](https://expressjs.com) framework,
- [MongoDB](https://mongodb.com) database and [Mongoose](https://mongoosejs.com/) library,
- [Multer](https://github.com/expressjs/multer) package,
- [GraphQL](https://graphql.org) package,
- [Passport-jwt](http://www.passportjs.org/packages/passport-jwt/) and [Passport-local](https://www.passportjs.org/packages/passport-local/) for authentication.

To know how to use it and read about features, please visit [this file](https://github.com/mahdiHash/blog-api/blob/master/howToUse.md).

## How to run

To run this api and see if it works well, you need to take a few steps.

First, you need to download and install [Node.js](https://nodejs.org/en/download/).

Second, you need to have a MongoDB database so the app can connect to it. You can get a free tier of [MongoDB Atlas](https://www.mongodb.com/atlas/database). There's a guide [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#setting_up_the_mongodb_database). 

Third, you need an [AWS S3](https://aws.amazon.com/s3/) storage. I myself used [Arvan Cloud](https://www.arvancloud.com/en) storage service (for ease).

For the last part, you need to clone this repo. Go to any directory you want in your computer. Then, open the terminal and write the command below (I assume you already have Git installed):

```
git clone https://github.com/mahdiHash/blog-api.git
```  

After that:  

```
cd blog-api
```

Now you need to create a `.env` file in the root directory. This file is needed so the app can read the database URI, online storage service required information and JWT secret key from environment variables. Here's the list of variables you need to create:
- `S3_SECRET_KEY`: your online storage service secret key,
- `ACCESS_KEY`: your online storage service access key,
- `BUCKET`: your online storage service bucket name,
- `ENDPOINT`: your online storage service endpoint,
- `TOKEN_SECRET`: a secret code that will be used by passport-jwt configuration,
- `MONGODB`: your mongodb URI.

After these steps, you need to install the dependencies. For that, you can write `npm install` in the terminal. This will install all the dependencies the project needs.

Now to run a local server, enter `npm run start` (you can also write `npm run devstart` to use [nodemon](https://github.com/remy/nodemon)). After starting the server, you can send requests anyhow you're comfortable with (e.g. Postman) and get the response. The base URI is `http://127.0.0.1:3000` or `http://localhost:3000`.

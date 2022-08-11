# blog-api: How to use

## Features

- Create posts in markdown format.
- Submit comments with replies.
- Like/dislike the posts and comments.
- Create/delete/update the posts and comments.
- Upload images in the posts.
- See the preview of texts before you submit them.

## Endpoints

### posts

- **GET all posts**: `/posts/`
  - Retrieves all posts. Returned results contain these properties:
    - `title`: <*String*>
    - `timestamp`: <*Number*>
    - `likes`: [<*String*>] this will be the users ids who liked the post
    - `dislikes`: [<*String*>] this will be the users ids who disliked the post
    - `last_update`: <*Number*>
    - `comments`: [<*String*>] this will the comments id
  - The content of the post will not be returned for performance purposes.

- **GET specific post by title**: `/posts/:title/`
  - Returned resulting object containes:
    - `title`: <*String*>
    - `timestamp`: <*Number*>
    - `content`: <*String*> this property holds HTML format of content. The user should use markdown format when submiting a post. The markdown string will be stored as is in database and will be converted to HTML in response. Any "\n" character in the markdown will be converted to "<*br*>" tag in HTML result.
    - `likes`: [<*String*>] this will be the users ids who liked the post
    - `dislikes`: [<*String*>] this will be the users ids who disliked the post
    - `comments`: [<*Object*>] all the comments are populated. You just need to check for replies. Every comment has `in_reply_to`(contains a string of `_id` or `null`), `replies`(containes an array of `_id`s) and `_id` properties. You can use them to show replies of each comment.

- **DELETE post**: `/posts/:id/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>

- **PUT post**: `/posts/:id/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - The request body should contain these properties:
    - `title`
    - `content`

- **GET check if there's any post submitted with this title before**: `/posts/exists/:title`
  - Before you send a request for creating a post, you need to send a request to this route to check whether there's already a post with this title. This is required because you will access a specific post with it's title e.g. `/posts/:title`
  - The `title` should be lowercased and you have to replace all whitespaces with dashes `-`.
  - The response will be a boolean. `true` if it exists, otherwise `false`.

- **POST create a post**: `/posts/create/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - The request body should contain these properties:
    - `title`
    - `content`

### comments

- **GET get a comment**: `/comments/:id`

- **POST submit a comment**: `/comments/create/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - The request body must contain these properties:
    - `post`: this is the `_id` of the post which user is submitting a comment to.
    - `text`: the comment content in markdown format.
    - `replyTo`: this is the `_id` of the comment which user is submitting a reply to. This field can be `null`.

- **PUT update a comment**: `/comments/:id/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - The request body must contain these properties:
    - `text`

- **DELETE delete a comment**: `/comments/:id/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>

### users

- **GET user's profile**: `/users/:username/`
  - The response object contains: 
    - `_id`: <*ObjectId*> user's id in database.
    - `username`: <*String*>
    - `profile_pic`: <*String*> user's profile pic name in the cloud storage. Accessible by: `/img/{user.profile_pic}`.
    - `comments`: [<*Object*>]
    - `is_admin`: <*Boolean*>

- **DELETE user**: `/users/:username/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>

- **PUT user profile update**: `/users/:username/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - The request body must contain these properties:
    - `username`
    - `profile_pic`: the uploaded picture or `null` if nothing is uploaded.
  - The response object contains user's new JWT. Use it for other actions.

- **POST user login**: `/users/login/` 
  - The request body must contain these properties:
    - `username`
    - `password`
  - The response object contains user's JWT. Use it for other actions.

- **POST user signup**: `/users/signup`
  - The request body must contain these properties:
    - `username`
    - `password`
    - `passwordConfirm`
    - `profile_pic`: the uploaded picture or `null` if nothing is uploaded.
  - The response object contains user's JWT. Use it for other actions.


### images

- **GET image**: `/img/:imgName` all the images in the db have url, so you only have to take the url and send a GET request.

- **POST upload image for posts**: `/img/upload/` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>
  - You need to send a single request per uploaded image in the posts.
  - Before sending a request to this route, you should check if there's already an image with the name of what user wants to upload by sending a request to `/img/isAccessible/:imgName`. If the response is `false`, then preceed.
  - The request body must contain this property:
    - `img`: the uploaded image.

- **DELETE image**: `/img/:imgName` <span style="background-color: lightgreen; color: black; border-radius: 10px; padding: 0 3px 2px 3px;">login required</span>

- **GET determine if an image is accessible**: `/img/isAccessible/:imgName`
  - The result would be a boolean.
  - The client has to use this route to determine a name for each image that user wants to upload.

## Store images

Don't forget the `multipart/form-data`.

### store user profile's image

To store user profile you just need to send the form data to the server.

### store uploaded images in the post

When the user uploads an image, the client should ask for the name of the image. Then, it should send the name to `/img/isAccessible/:imgName` to check for an image with the same name in the cloud storage. If there was no such image, then client should store the image in the browser storage.  
When the user submits the post, the client should send a POST request to `/img/upload` for each of the uploaded images so they would be stored in the cloud storage. 

## Increase/decrease likes

### increase likes of posts

When the user likes a post, the client should send a POST request to `/ld/likes/post/:id`. The `id` belongs to post.

When the user likes a comment, the client should send a POST request to `/ld/likes/comment/:id`. The `id` belongs to comment.

When the user dislikes a post, the client should send a POST request to `/ld/dislikes/post/:id`. The `id` belongs to post.

When the user dislikes a comment, the client should send a POST request to `/ld/dislikes/comment/:id`. The `id` belongs to comment.

## Convert markdown to HTML

To convert a markdown text into HTML, you need to send a GET request to `/convertmdtohtml/`. The result would be a string of HTML code.

The body should contain this property:
  - `markdown`: the text which is supposed to be converted.

You can use this route to preview the markdown text that user has written.

## Errors

All errors are given to client in an array `errors` in the response. This array will contain the error objects. Each array object contains `message`(or `msg` for input errors generated by express-validator), `name` and `statusCode` which represents the HTTP responses status codes.

const {
  GraphQLInputObjectType, 
  GraphQLID, 
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const inputs = {
  createCommentInput: new GraphQLInputObjectType({
    name: 'createCommentInput',
    fields: {
      post: { type: new GraphQLNonNull(GraphQLID) },
      text: { type: new GraphQLNonNull(GraphQLString) },
      replyTo: { type: GraphQLID },
    }
  }),

  updateCommentInput: new GraphQLInputObjectType({
    name: 'updateCommentInput',
    fields: {
      text:{ type: new GraphQLNonNull(GraphQLString) },
    }
  }),

  createPostInput: new GraphQLInputObjectType({
    name: 'createPostInput',
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    }
  }),

  updatePostInput: new GraphQLInputObjectType({
    name: 'updatePostInput',
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    }
  }),

  createUserInput: new GraphQLInputObjectType({
    name: 'createUserInput',
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      passwordConfirm: { type: new GraphQLNonNull(GraphQLString) },
      profile_pic: { type: GraphQLString }, // base64 format of image
    }
  }),

  updateUserInput: new GraphQLInputObjectType({
    name: 'updateUserInput',
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      profile_pic: { type: GraphQLString }, 
    }
  }),  
}

module.exports = inputs;

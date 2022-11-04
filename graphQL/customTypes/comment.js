const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLInt) },
    post: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    replies: { type: new GraphQLList(GraphQLID) },
    likes: { type: new GraphQLList(GraphQLID) },
    dislikes: { type: new GraphQLList(GraphQLID) },
    is_editted: { type: GraphQLBoolean },
    in_reply_to: { type: GraphQLID },
  }
});

module.exports = CommentType;

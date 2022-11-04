const {
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    creation_time: { type: GraphQLInt },
    content: { type: new GraphQLNonNull(GraphQLString) },
    likes: { type: new GraphQLList(GraphQLID) },
    dislikes: { type: new GraphQLList(GraphQLID) },
    last_update: { type: GraphQLInt },
    comments: { type: new GraphQLList(GraphQLID) },
    url_form_of_title: { type: new GraphQLNonNull(GraphQLString) },
  }
});

module.exports = PostType;

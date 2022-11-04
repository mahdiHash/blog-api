const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLString },
    profile_pic: { type: GraphQLString },
    is_admin: { type: GraphQLBoolean },
  }
});

module.exports = UserType;

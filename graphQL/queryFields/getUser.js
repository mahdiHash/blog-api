const User = require('../../models/user');
const UserType = require('../customTypes/user');
const { GraphQLString, GraphQLError } = require('graphql');

const field = {
  type: UserType,
  args: {
    username: { type: GraphQLString },
  },
  resolve: async (_, { username }) => {
    let user = await User.findOne({ username });

    if (!user) {
      return new GraphQLError('No such user');
    }

    return user;
  }
}

module.exports = field;

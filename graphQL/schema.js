const { GraphQLSchema } = require('graphql');
const query = require('./queryFields/query');
const mutation = require('./mutationFields/mutation');

module.exports = new GraphQLSchema({
  query,
  mutation
});

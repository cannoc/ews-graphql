const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const Resolvers = require('./resolvers');
const { CompositeKey } = require('../utils');
import {PersonType, PersonSearchType} from './person';

const pws = {
    PersonSearch: {
        type: PersonSearchType,
        args: {
            UWRegID: { type: GraphQLString },
            UWNetID: { type: GraphQLString },
            EmployeeID: { type: GraphQLInt }
        },
        resolve: (root, args, {impersonate}) => Resolvers.PersonSearch(args, impersonate)
    },
    GetPerson: {
        type: PersonType,
        args: {
            ID: { type: GraphQLString, description: "Allowed IDs: UWNetID, UWRegID, EmployeeID" }
        },
        resolve: (root, args, {loaders, impersonate}) => {
          return loaders.person.load(args.ID, impersonate);
        }
    //   },
    // EntitySearch: {

    // },
    // GetEntity: {

    }
};

export default pws;
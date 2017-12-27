import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import Resolvers from './resolvers';
import {PWSPersonType, PWSPersonSearchType} from './pwsPerson';

const pws = {
    PWSPersonSearch: {
        type: PWSPersonSearchType,
        args: {
            UWRegID: { type: GraphQLString },
            UWNetID: { type: GraphQLString },
            EmployeeID: { type: GraphQLInt }
        },
        resolve: (root, args, {impersonate}) => Resolvers.PersonSearch(args, impersonate)
    },
    GetPWSPerson: {
        type: PWSPersonType,
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
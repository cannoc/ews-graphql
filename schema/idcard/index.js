import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import Resolvers from './resolvers';
import { CardSearchType, CardType } from './cards';
import { PhotoType, PhotoSearchType } from './photos';

const idcard = {
    SearchCards: {
        type: CardSearchType,
        args: {
            MagStripCode: { type: GraphQLString },
            ProxRFID: { type: GraphQLString }
        },
        resolve: (root, args, {impersonate}) => Resolvers.CardSearch(args, impersonate)
    },
    GetCard: {
        type: CardType,
        args: {
            MagStripCode: { type: GraphQLString },
            ProxRFID: { type: GraphQLString }
        },
        description: "Get Card",
        resolve: (root, args, {impersonate}) => Resolvers.GetCard(args, impersonate)
    },
    SearchPhotos: {
        type: PhotoSearchType,
        args: {
            EmployeeID: { type: GraphQLString },
            Height: { type: GraphQLInt },
            NetID: { type: GraphQLString },
            RegID: { type: GraphQLString },
            StudentNumber: { type: GraphQLString } 
        },
        resolve: (root, args, {impersonate}) => Resolvers.CardSearch(args, impersonate)
    },
    GetPhoto: {
        type: PhotoType,
        args: {
            EmployeeID: { type: GraphQLString },
            Height: { type: GraphQLInt },
            NetID: { type: GraphQLString },
            RegID: { type: GraphQLString },
            StudentNumber: { type: GraphQLString }
        },
        resolve: (root, args, {impersonate}) => Resolvers.GetPhoto(args, impersonate)
    }
};

export default idcard;
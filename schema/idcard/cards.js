import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { CompositeKey } from '../utils';

const CardType = new GraphQLObjectType({
    name: "CardType",
    description: "Card Type",
    fields: () => ({
        RegID: { type: GraphQLString },
        PWSPerson: {
            type: require('../pws/pwsPerson').PWSPersonType,
            resolve: (root, args, {loaders}) => loaders.pwsPerson.load(root.RegID)
        },
        SWSPerson: {
            type: require('../sws/swsPerson').SWSPerson,
            resolve: (root, args, {loaders}) => loaders.swsPerson.load(root.RegID)
        },
        Photo: {
            type: require('./photos').PhotoType,
            args: {
                Height: { type: GraphQLInt }
            },
            resolve: (Card, args, {impersonate}) => require('./resolvers').GetPhoto({ RegID: Card.RegID, Height: args.Height }, impersonate)
        }
    })
});

const CardSearchType = new GraphQLObjectType({
    name: "CardSearchType",
    description: "IDCard Search Type",
    fields: () => ({
        Cards: { type: new GraphQLList(CardType)}
    })
});

export { CardSearchType, CardType };
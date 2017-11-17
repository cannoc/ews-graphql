const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

const PhotoBaseType = new GraphQLObjectType({
    name: "PhotoBaseType",
    description: "Photo Base Type",
    fields: () => ({
        Href: { type: GraphQLString },
        Height: { type: GraphQLInt },
        RegId: { type: GraphQLString }
    })
});

const PhotoType = new GraphQLObjectType({
    name: "PhotoType",
    description: "Husky Card Photo Type",
    fields: () => ({
        FullName: { type: GraphQLString },
        RegId: { type: GraphQLString },
        FileExtension: { type: GraphQLString },
        Height: { type: GraphQLInt },
        Small: { type: PhotoBaseType },
        Medium: { type: PhotoBaseType },
        Large: { type: PhotoBaseType },
        CustomHeight: { type: PhotoBaseType },
        PWSPerson: {
            type: require('../pws/pwsPerson').PWSPersonType,
            resolve: (root, args, {loaders}) => loaders.pwsPerson.load(root.RegId)
        },
        SWSPerson: {
            type: require('../sws/swsPerson').SWSPerson,
            resolve: (root, args, {loaders}) => loaders.swsPerson.load(root.RegId)
        },
    })
});

const PhotoSearchType = new GraphQLObjectType({
    name: "PhotoSearchType",
    description: "Husky Card Photo Search Type",
    fields: () => ({
        Photos: { type: new GraphQLList(PhotoType) }
    })
});

export { PhotoType, PhotoSearchType };
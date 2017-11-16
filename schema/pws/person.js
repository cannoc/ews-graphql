const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

const PersonURIType = new GraphQLObjectType({
    name: "PersonURIType",
    description: "Person URI Type",
    fields: () => ({
        Href: { type: GraphQLString },
        DisplayName: { type: GraphQLString },
        RegisteredName: { type: GraphQLString },
        UWNetID: { type: GraphQLString },
        UWRegID: { type: GraphQLString }
    })
});

const BasePersonType = new GraphQLObjectType({
    name: "BasePersonType",
    description: "Base Person Type",
    fields: () => ({
        Href: {type: GraphQLString },
        PersonURI: { type: PersonURIType },
        PersonFullURI: { type: PersonURIType }
    })
});

const PersonType = new GraphQLObjectType({
    name: "PersonType",
    description: "Person Type",
    fields: () => ({
        DisplayName: {type: GraphQLString }
    })
});

const PersonSearchType = new GraphQLObjectType({
    name: "PersonSearchType",
    description: "Person Search Type",
    fields: () => ({
        Persons: { type: new GraphQLList(BasePersonType)}
    })
});

export { PersonType, PersonSearchType }
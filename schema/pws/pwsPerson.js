const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

const PersonAffiliationsType = new GraphQLObjectType({
    name: "PersonAffiliations",
    description: "Persion Affiliations",
    fields: () => ({
        PersonFullURI: {type: PWSPersonURIType}
    })
});

const PWSPersonURIType = new GraphQLObjectType({
    name: "PersonURI",
    description: "Person URI Type",
    fields: () => ({
        Href: { type: GraphQLString },
        DisplayName: { type: GraphQLString },
        RegisteredName: { type: GraphQLString },
        UWNetID: { type: GraphQLString },
        UWRegID: { type: GraphQLString }
    })
});

const BasePWSPersonType = new GraphQLObjectType({
    name: "BasePWSPerson",
    description: "Base Person Type",
    fields: () => ({
        Href: {type: GraphQLString },
        PersonURI: { type: PWSPersonURIType },
        PersonFullURI: { type: PWSPersonURIType }
    })
});

const PWSPersonType = new GraphQLObjectType({
    name: "PWSPersonType",
    description: "PWS Person Type",
    fields: () => ({
        DisplayName: {type: GraphQLString },
        EduPersonAffiliations: { type: new GraphQLList(GraphQLString)},
        IsTestEntity: { type: GraphQLBoolean },
        PreferredFirstName: { type: GraphQLString },
        PreferredMiddleName: { type: GraphQLString },
        PreferredSurname: { type: GraphQLString },
        PriorUWNetIDs: { type: new GraphQLList(GraphQLString)},
        PriorUWRegIDs: { type: new GraphQLList(GraphQLString)},
        RegisteredFirstMiddleName: { type: GraphQLString },
        RegisteredName: { type: GraphQLString },
        RegisteredSurname: { type: GraphQLString },
        RepositoryTimeStamp: { type: GraphQLString },
        UIDNumber: { type: GraphQLString },
        UWNetID: { type: GraphQLString },
        UWRegID: { type: GraphQLString },
        WhitePagesPublish: { type: GraphQLBoolean },
        PersonAffiliations: { type: PWSPersonURIType }
    })
});

const PWSPersonSearchType = new GraphQLObjectType({
    name: "PWSPersonSearchType",
    description: "PWS Person Search Type",
    fields: () => ({
        Persons: { type: new GraphQLList(BasePWSPersonType)}
    })
});

export { PWSPersonType, PWSPersonSearchType }
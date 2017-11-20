const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

const RegistrationSearchType = new GraphQLObjectType({
    name: "RegistrationSearchType",
    description: "Registration Search Type",
    fields: () => ({
        Registrations: { type: new GraphQLList(RegistrationBaseType)},
        TotalCount: { type: GraphQLInt },
        PageSize: { type: GraphQLString },
        PageStart: { type: GraphQLString }
    })
});

const RegistrationBaseType = new GraphQLObjectType({
    name: "RegistrationBaseType",
    description: "Registration Base Type",
    fields: () => ({
        AccessDateRangeEnd: { type: GraphQLString },
        AccessDateRangeStart: { type: GraphQLString },
        Auditor: { type: GraphQLBoolean },
        Credits: { type: GraphQLString },
        DuplicateCode: { type: GraphQLString },
        //EducationUnitType: 
        EndDate: { type: GraphQLString },
        FeeBaseType: { type: GraphQLString },
        Grade: { type: GraphQLString },
        GradeDate: { type: GraphQLString },
        GradeDocumentID: { type: GraphQLString },
        //GradingSystem:
        HonorsCourse: { type: GraphQLBoolean },
        Href: { type: GraphQLString },
        //Instructor:
        IsActive: { type: GraphQLBoolean },
        IsCredit: { type: GraphQLBoolean },
        IsIndependentStart: { type: GraphQLBoolean },
        Metadata: { type: GraphQLString },
        Person: { type: require('./swsPerson').RegIDUrlType },
        SWSPerson: {
            type: require('./swsPerson').SWSPerson,
            resolve: (root, args, {loaders}) => loaders.swsPerson.load(root.Person.RegID)
        },
        RepeatCourse: { type: GraphQLBoolean },
        RepositoryTimeStamp: { type: GraphQLString },
        RequestDate: { type: GraphQLString },
        RequestStatus: { type: GraphQLString },
        Section: { type: require('./section').BaseSectionType},
        StartDate: { type: GraphQLString },
        VariableCredit: { type: GraphQLBoolean },
        WritingCourse: { type: GraphQLBoolean }
    })
});

const RegistrationType = new GraphQLObjectType({
    name: "RegistrationType",
    description: "Registration Type",
    fields: () => ({
        
    })
});

export { RegistrationType, RegistrationSearchType, RegistrationBaseType }
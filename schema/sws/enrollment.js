const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } = require('graphql');
const { CompositeKey } = require('../utils');

const EnrollmentSearchType = new GraphQLObjectType({
    name: "EnrollmentSearchType",
    description: "Enrollment Search Type",
    fields: () => ({
        Enrollments: { type: new GraphQLList(EnrollmentType)},
        TotalCount: { type: GraphQLInt },
        PageSize: { type: GraphQLString },
        PageStart: { type: GraphQLString }
    })
});

const EnrollmentType = new GraphQLObjectType({
    name: "EnrollmentType",
    description: "Enrollment Type",
    fields: () => ({
        ClassCode: { type: GraphQLString },
        ClassDescription: { type: GraphQLString },
        ClassLevel: { type: GraphQLString },
        CurrentRegisteredCredits: { type: GraphQLInt },
        EnrollmentStatus: { type: GraphQLString },
        EnrollmentStatusDate: { type: GraphQLString },
        HonorsProgram: { type: GraphQLBoolean },
        LeaveEndQuarter: { type: GraphQLInt },
        LeaveEndYear: { type: GraphQLInt },
        Majors: { type: new GraphQLList(MajorMinorType)},
        Metadata: { type: GraphQLString },
        Minors: { type: new GraphQLList(MajorMinorType)},
        PendingClassChange: { type: GraphQLBoolean },
        PendingHonorsChange: { type: GraphQLBoolean },
        PendingResidentChange: { type: GraphQLBoolean },
        PendingSpecialProgramChange: { type: GraphQLBoolean },
        //QtrGradePoints:
        //QtrGradeAttmp:
        //QtrNonGrdEarned:
        RepositoryTimeStamp: { type: GraphQLString },
        Term: { type: require('./term').BaseTermType },
        FullName: { type: GraphQLString },
        Person: { type: require('./swsPerson').RegIDUrlType },
        RegID: { type: GraphQLString },
        Registrations: { type: new GraphQLList(require('./registration').RegistrationBaseType) }
    })
});

const MajorMinorType = new GraphQLObjectType({
    name: "MajorMinorType",
    description: "Major/Minor Type",
    fields: () => ({
        Abbreviation: { type: GraphQLString },
    })
});

export { EnrollmentSearchType, EnrollmentType }
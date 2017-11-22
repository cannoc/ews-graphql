const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');

const CodeDescriptionType = new GraphQLObjectType({
    name: "CodeDescription",
    description: "Code Description",
    fields: () => ({
        Code: { type: GraphQLString },
        Description: { type: GraphQLString }
    })
});

const EthnicityType = new GraphQLObjectType({
    name: "EthnicityType",
    description: "Ethnicity Type",
    fields: () => ({
        Ethnic: { type: new GraphQLList(CodeDescriptionType)},
        Hispanic: { type: new GraphQLList(CodeDescriptionType)}
    })
});

const AddressType = new GraphQLObjectType({
    name: "AddressType",
    description: "Address Type",
    fields: () => ({
        City: { type: GraphQLString },
        Country: { type: GraphQLString },
        Line1: { type: GraphQLString },
        Line2: { type: GraphQLString },
        PostalCode: { type: GraphQLString },
        State: { type: GraphQLString },
        Zip: { type: GraphQLString }
    })
});

const RegIDUrlType = new GraphQLObjectType({
    name: "RegIDUrlType",
    description: "RegID Url Type",
    fields: () => ({
        Href: { type: GraphQLString },
        RegID: { type: GraphQLString },
        SWSPerson: {
            type: SWSPerson,
            resolve: (root, args, {loaders}) => loaders.swsPerson.load(root.RegID)
        },
        PWSPerson: { 
            type: require('../pws/pwsPerson').PWSPersonType,
            resolve: (root, args, {loaders}) => loaders.pwsPerson.load(root.RegID)
        },
        Enrollments: {
            type: require("./enrollment").EnrollmentSearchType,
            resolve: (root, args, {loaders}) => loaders.enrollment.load(root.RegID)
        },
        CurrentEnrollment: {
            type: require("./enrollment").EnrollmentType,
            resolve: (root, args, {loaders, impersonate}) => {
                return loaders.term.load("current").then(term => {
                    let enrollArgs = {
                        Year: term.Year,
                        Quarter: term.Quarter,
                        RegID: root.RegID
                    };
                    return require("./resolvers").GetEnrollment(enrollArgs, impersonate);
                })
                
            }
        }
    })
});

const SWSPersonSearch = new GraphQLObjectType({
    name: "SWSPersonSearchType",
    description: "SWS Person Search",
    fields: () => ({
        Persons: { type: new GraphQLList(SWSPersonSearchPersons)},
        TotalCount: { type: GraphQLInt },
        PageSize: { type: GraphQLString },
        PageStart: { type: GraphQLString }
    })
});

const SWSPersonSearchPersons = new GraphQLObjectType({
    name: "SWSPersonSearchPersonsType",
    description: "SWS Person Search",
    fields: () => ({
        BirthDate: { type: GraphQLString },
        DirectoryRelease: { type: GraphQLBoolean },
        Email: { type: GraphQLString },
        EmployeeID: { type: GraphQLString },
        FirstName: { type: GraphQLString },
        Gender: { type: GraphQLString },
        LastEnrolled: { type: require('./term').BaseTermType },
        LastName: { type: GraphQLString },
        LocalAddress: {type: AddressType },
        LocalPhone: { type: GraphQLString },
        PermanentAddress: { type: AddressType },
        PermanentPhone: { type: GraphQLString },
        RegID: { type: GraphQLString },
        RegisteredName: { type: GraphQLString },
        Resident: { type: GraphQLString },
        StudentName: { type: GraphQLString },
        StudentNumber: { type: GraphQLString },
        StudentSystemKey: { type: GraphQLString },
        TestScore: { type: RegIDUrlType },
        UWNetID: { type: GraphQLString },
        Veteran: { type: CodeDescriptionType },
        VisaType: { type: GraphQLString },
        Href: { type: GraphQLString },
        PWSPerson: { 
            type: require('../pws/pwsPerson').PWSPersonType,
            resolve: (SWSPerson, args, {loaders}) => loaders.pwsPerson.load(SWSPerson.RegID)
        },
    })
});

const SWSPerson = new GraphQLObjectType({
    name: "Student",
    description: "Student Info",
    fields: () => ({
        BirthDate: { type: GraphQLString },
        //CurrentEnrollment: 
        DirectoryRelease: { type: GraphQLBoolean },
        Disability: { type: new GraphQLList(CodeDescriptionType) },
        Email: { type: GraphQLString },
        EmployeeID: { type: GraphQLString },
        Ethnicity: { type: EthnicityType },
        FirstName: { type: GraphQLString },
        Gender: { type: GraphQLString },
        LastEnrolled: { type: require('./term').BaseTermType },
        LastName: { type: GraphQLString },
        LocalAddress: {type: AddressType },
        LocalPhone: { type: GraphQLString },
        MetaData: { type: GraphQLString },
        Notices: { type: RegIDUrlType },
        PermanentAddress: { type: AddressType },
        PermanentPhone: { type: GraphQLString },
        PersonFinancial: { type: RegIDUrlType },
        RegID: { type: GraphQLString },
        RegisteredName: { type: GraphQLString },
        RepositoryTimeStamp: { type: GraphQLString },
        ResidencyDescription: { type: GraphQLString },
        Resident: { type: GraphQLString },
        //Sports: { type: },
        StudentName: { type: GraphQLString },
        StudentNumber: { type: GraphQLString },
        StudentSystemKey: { type: GraphQLString },
        TestScore: { type: RegIDUrlType },
        UWNetID: { type: GraphQLString },
        Veteran: { type: CodeDescriptionType },
        VisaType: { type: GraphQLString },
        PWSPerson: { 
            type: require('../pws/pwsPerson').PWSPersonType,
            resolve: (SWSPerson, args, {loaders}) => loaders.pwsPerson.load(SWSPerson.RegID)
        }
    })
  });

export { SWSPerson, SWSPersonSearch, RegIDUrlType }
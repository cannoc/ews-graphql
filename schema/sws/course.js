const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

// Course Models
const GeneralEducationRequirementsType = new GraphQLObjectType({
    name: "GeneralEducationReqs",
    description: "Course General Education Requirements",
    fields: () => ({
        Diversity: { type: GraphQLBoolean },
        EnglishComposition: { type: GraphQLBoolean },
        IndividualsAndSocieties: { type: GraphQLBoolean },
        NaturalWorld: { type: GraphQLBoolean },
        QuantitativeAndSymbolicReasoning: { type: GraphQLBoolean },
        VisualLiteraryAndPerformingArts: { type: GraphQLBoolean },
        Writing: { type: GraphQLBoolean },
    })
});
const BaseCourseType = new GraphQLObjectType({
    name: "BaseCourseType",
    description: "Base Course Type",
    fields: () => ({
        Href: { type: GraphQLString },
        Year: { type: GraphQLInt },
        Quarter: { type: GraphQLString },
        CourseTitle: { type: GraphQLString },
        CourseTitleLong: { type: GraphQLString },
        CurriculumAbbreviation: { type: GraphQLString },
        CourseNumber: { type: GraphQLString },
        Sections: {
            type: new GraphQLList(require('./section').BaseSectionType),
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt},
                SectionId: { type: GraphQLString }
            },
            resolve: (course, args, {impersonate}) => 
            { 
                return require('./resolvers').SearchSection(Object.assign({}, args, {Year: course.Year, Quarter: course.Quarter, CurriculumAbbr: course.CurriculumAbbreviation, CourseNumber: course.CourseNumber}), impersonate)
                .then(res => res.Sections)
                .then(sections => { 
                    if(args.SectionId) { 
                        return sections.filter(s => s.SectionID == args.SectionId)
                    } 
                    return sections;
                });
            }
        },
        VerboseSections: {
            type: require('./section').VerboseSectionWrapper,
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt}
            },
            resolve: (course, args, {loaders, impersonate}) => 
            { 
                let sects = [];
                return require('./resolvers').SearchSection(Object.assign({}, args, {Year: course.Year, Quarter: course.Quarter, CurriculumAbbr: course.CurriculumAbbreviation, CourseNumber: course.CourseNumber }), impersonate)
                .then(res => {
                    res.Sections.forEach((section) => {
                        sects.push(loaders.section.load(CompositeKey(section.Year, section.Quarter, section.CurriculumAbbreviation, section.CourseNumber + "/" + section.SectionID)));
                    });
                    return res;
                }).then((res) => { 
                    res.Sections = sects;
                    return res;
                 });
            }
        },
    })
});
const CourseType = new GraphQLObjectType({
    name: "CourseType",
    description: "SWS Course Model",
    fields: () => ({
        CourseCampus: { type: GraphQLString },
        CourseCollege: { type: GraphQLString },
        CourseNumber: { type: GraphQLString },
        CourseTitle: { type: GraphQLString },
        CourseDescription: { type: GraphQLString },
        Curriculum: { type: require('./curriculum').CurricType },
        FirstEffectiveTerm: {type: require('./term').BaseTermType},
        GeneralEducationRequirements: { type: GeneralEducationRequirementsType },
        GradingSystem: { type: GraphQLString },
        LastEffectiveTerm: { type: new require('./term').BaseTermType },
        MaximumCredit: { type: GraphQLFloat },
        MaximumTermCredit: { type: GraphQLFloat },
        Metadata: { type: GraphQLString },
        MinimumTermCredit: { type: GraphQLFloat },
        RepositoryTimeStamp: { type: GraphQLString },
        VerboseSections: {
            type: require('./section').VerboseSectionWrapper,
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt}
            },
            resolve: (course, args, {loaders, impersonate}) => 
            { 
                let sects = [];
                return require('./resolvers').SearchSection(Object.assign({}, args, {Year: course.Key.Year, Quarter: course.Key.Quarter, CurriculumAbbr: course.Key.Curriculum, CourseNumber: course.Key.CourseNumber }), impersonate)
                .then(res => {
                    res.sections.forEach((section) => {
                        sects.push(loaders.section.load(CompositeKey(section.Year, section.Quarter, section.CurriculumAbbreviation, section.CourseNumber + "/" + section.SectionID)));
                    });
                }).then((res) => { 
                    res.Sections = sects;
                    return res;
                 });
            }
        },
        Sections: {
            type: new GraphQLList(require('./section').BaseSectionType),
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt},
                Verbose: { type: GraphQLBoolean }
            },
            resolve: (course, args, {loaders, impersonate}) => 
            { 
                return require('./resolvers').SearchSection(Object.assign({}, args, {Year: course.Key.Year, Quarter: course.Key.Quarter, CurriculumAbbr: course.Key.Curriculum, CourseNumber: course.Key.CourseNumber, Verbose: args.Verbose}), impersonate)
                .then(res => res.Sections);
            }
        },
        Section: {
            type: require('./section').SectionSearchType,
            args: {
                SectionId: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (course, args, {loaders}) => 
                loaders.section.load(CompositeKey(course.Key.Year, course.Key.Quarter, course.Key.Curriculum, course.Key.CourseNumber + "/" + args.SectionId))
        }
    })
});

const CourseSearchType = new GraphQLObjectType({
  name: "CourseSearch",
  description: "SWS Course Search",
  fields: () => ({
    Courses: { type: new GraphQLList(BaseCourseType) },
    Current: { type: BaseCourseType },
    Next: { type: BaseCourseType },
    Previous: { type: BaseCourseType },
    TotalCount: { type: GraphQLInt },
    PageSize: { type: GraphQLString },
    PageStart: { type: GraphQLString },
  })
});

module.exports = { CourseType, CourseSearchType, BaseCourseType };
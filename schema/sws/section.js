const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

// Section Models
const SectionSearchType = new GraphQLObjectType({
  name: 'SectionSearch',
  description: 'SWS Section Search',
  fields: () => ({
    TotalCount: { type: GraphQLInt },
    PageSize: { type: GraphQLString },
    PageStart: { type: GraphQLString },
    Sections: { type: new GraphQLList(BaseSectionType)},
    
  })
});

const VerboseSectionWrapper = new GraphQLObjectType({
  name: 'VerboseSectionWrapper',
  description: 'Verbose Section List',
  fields: () => ({
    TotalCount: { type: GraphQLInt },
    PageSize: { type: GraphQLString },
    PageStart: { type: GraphQLString },
    Sections: { type: new GraphQLList(SectionType)}
  })
});

const SectionType = new GraphQLObjectType({
  name: 'SectionType',
  description: 'SWS Section Model',
  fields: () => ({
    AddCodeRequired: { type: GraphQLBoolean },
    Auditors: { type: GraphQLInt },
    ClassWebsiteUrl: { type: GraphQLString },
    Curriculum: {
      type: require('./curriculum').CurricType
    },
    Course: {
      type: require('./course').BaseCourseType,
      resolve: (section, args, {loaders}) => loaders.course.load(CompositeKey(section.Course.Year, section.Course.Quarter, section.Course.CurriculumAbbreviation, section.Course.CourseNumber))
    },
    CourseTitle: { type: GraphQLString },
    SectionID: { type: GraphQLString },
    Meetings: { type: new GraphQLList(SectionMeeting) },
    Registrations: { 
      type: require('./registration').RegistrationSearchType,
      args: {
        PageSize: { type: GraphQLInt },
        PageStart: { type: GraphQLInt }
      },
      resolve: (section, args, {impersonate}) => {
        let searchArgs = {
          Year: section.Course.Year,
          Quarter: section.Course.Quarter,
          CurriculumAbbr: section.Course.CurriculumAbbreviation,
          CourseNumber: section.Course.CourseNumber,
          SectionID: section.SectionID,
          PageSize: args.PageSize,
          PageStart: args.PageStart
        }
        return require('./resolvers').SearchRegistration(searchArgs, impersonate);
      }
  }
  })
});

const BaseSectionType = new GraphQLObjectType({
  name: 'BaseSectionType',
  description: 'SWS Section Base',
  fields: () => ({
      Href: { type: GraphQLString },
      CourseNumber: { type: GraphQLInt },
      CurriculumAbbreviation: { type: GraphQLString },
      Quarter: { type: GraphQLString },
      SectionID: { type: GraphQLString },
      Year: { type: GraphQLInt },
      Course: {
        type: require('./course').BaseCourseType,
        resolve: (section, args, {loaders}) => loaders.course.load(CompositeKey(section.Year, section.Quarter, section.CurriculumAbbreviation, section.CourseNumber))
      },
  })
});

const SectionMeeting = new GraphQLObjectType({
  name: 'SectionMeetingType',
  description: 'Section Meeting Type',
  fields: () => ({
    Building: { type: GraphQLString },
    BuildingToBeArranged: { type: GraphQLBoolean },
    DaysOfWeek: { type: DaysOfWeek },
    DaysOfWeekToBeArranged: { type: GraphQLBoolean },
    EndTime: { type: GraphQLString },
    Instructors: { type: new GraphQLList(InstructorType)},
    Meeting: { type: HrefType },
    MeetingIndex: { type: GraphQLString },
    MeetingType: { type: GraphQLString },
    RoomNumber: { type: GraphQLString },
    RoomToBeArranged: { type: GraphQLBoolean },
    StartTime: { type: GraphQLString }
  })
});

const DaysOfWeek = new GraphQLObjectType({
  name: 'DaysOfWeek',
  description: 'Days of Week Type',
  fields: () => ({
    Days: {type: new GraphQLList(DayType)},
    Text: { type: GraphQLString }
  })
});

const DayType = new GraphQLObjectType({
  name: 'DayType',
  description: 'Day Type',
  fields: () => ({
    Name: { type: GraphQLString }
  })
});

const InstructorType = new GraphQLObjectType({
  name: 'InstructorType',
  description: 'Instructor Type',
  fields: () => ({
    FacultySequenceNumber: { type: GraphQLString },
    GradeRoster: { type: HrefType },
    PercentInvolve: { type: GraphQLString },
    Person: { type: require('./swsPerson').RegIDUrlType },
    TSPrint: { type: GraphQLBoolean },
    SWSPerson: {
      type: require('../sws/swsPerson').SWSPerson,
      resolve: (root, args, {loaders}) => loaders.swsPerson.load(root.Person.RegID)
    },
    PWSPerson: {
      type: require('../pws/pwsPerson').PWSPersonType,
      resolve: (root, args, {loaders}) => loaders.pwsPerson.load(root.Person.RegID)
    },
  })
});
const HrefType = new GraphQLObjectType({
  name: 'HrefType',
  description: 'Href Type',
  fields: () => ({
    Href: { type: GraphQLString }
  })
});

module.exports = { SectionSearchType, SectionType, BaseSectionType, VerboseSectionWrapper };
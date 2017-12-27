import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';
import { CompositeKey } from '../utils';

// Curriculum Models
const CurricSearchType = new GraphQLObjectType({
  name: 'CurriculumSearch',
  fields: () => ({
    TotalCount: { type: GraphQLInt },
    PageSize: { type: GraphQLString },
    PageStart: { type: GraphQLString },
    Curricula: { type: new GraphQLList(CurricType) },
  })
});

const CurricType = new GraphQLObjectType({
  name: 'Curriculum',
  description: 'Curriculum for a Year,Quarter',
  fields: () => ({
    CurriculumAbbreviation: { type: GraphQLString },
    CurriculumFullName: { type: GraphQLString },
    CurriculumName: { type: GraphQLString },
    Year: { type: GraphQLInt },
    Quarter: { type: GraphQLString },
    Href: { 
      type: GraphQLString,
      deprecationReason: "GetCurriculum is not implemented."
    },
    Term: {
      type: require('./term').TermType,
      resolve: (curric, args, {loaders}) => loaders.term.load(CompositeKey(curric.Year, curric.Quarter))
    },
    Courses: {
      type: require('./course').CourseSearchType,
      args: {
        PageSize: {type: GraphQLInt},
        PageStart: {type: GraphQLInt},
        CourseNumber: {type: GraphQLInt},
        CurrentTerm: {type: GraphQLBoolean }
      },
      resolve: (curric, args, {loaders, impersonate}) => {
        let courseArgs = Object.assign({}, args, {Year: curric.Year, Quarter: curric.Quarter, CurriculumAbbr: curric.CurriculumAbbreviation});
        if(args.CurrentTerm) {
          let term = loaders.term.load("current");
          courseArgs = Object.assign({}, courseArgs, {Year: term.Year, Quarter: term.Quarter });
        }
        return require('./resolvers').SearchCourse(courseArgs, impersonate);
      }
    }
  })
});

module.exports = { CurricSearchType, CurricType }
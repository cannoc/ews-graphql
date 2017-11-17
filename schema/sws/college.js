const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('../utils');

const CollegeType = new GraphQLObjectType({
    name: "CollegeType",
    description: "College Type",
    fields: () => ({
        Href: { type: GraphQLString },
        CampusShortName: { type: GraphQLString },
        CollegeAbbreviation: { type: GraphQLString },
        CollegeFullName: { type: GraphQLString },
        CollegeFullNameTitleCased: { type: GraphQLString },
        CollegeName: { type: GraphQLString },
        CollegeShortName: { type: GraphQLString },
        Quarter: { type: GraphQLString },
        Year: { type: GraphQLInt },
        Curricula: {
            type: require('./curriculum').CurricSearchType,
            args: {
                Year: { type: GraphQLInt },
                Quarter: { type: GraphQLString },
                FutureTerms: { type: GraphQLInt },
                CollegeAbbreviation: { type: GraphQLString },
                DeptAbbr: { type: GraphQLString },
                PageSize: { type: GraphQLInt },
                PageStart: { type: GraphQLInt },
                CurrentTerm: { type: GraphQLBoolean }
            },
            resolve: (root, args, {loaders, impersonate}) => {
                let curricArgs = Object.assign({}, {CollegeAbbreviation: root.CollegeAbbreviation}, args)
                if(args.CurrentTerm) {
                    let term = loaders.term.load("current");
                    curricArgs = Object.assign({}, curricArgs, {Year: term.Year, Quarter: term.Quarter });
                }
                return require('./resolvers').SearchCurriculum(curricArgs, impersonate)
            }
        }
    })
});
const CollegeSearchType = new GraphQLObjectType({
    name: "CollegeSearchType",
    description: "College Search Type",
    fields: () => ({
        Colleges: { type: new GraphQLList(CollegeType) }
    })
});

export { CollegeType, CollegeSearchType }
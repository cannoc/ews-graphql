import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import sws from './sws';
import pws from './pws';

export default new GraphQLSchema({
    query: new GraphQLObjectType({ 
        name: 'UWWebServices',
        description: 'UW Web Services',
        fields: Object.assign({}, pws, sws)
    }) 
  });
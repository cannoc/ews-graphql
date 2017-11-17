import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import sws from './sws';
import pws from './pws';
import idcard from './idcard';

export default new GraphQLSchema({
    query: new GraphQLObjectType({ 
        name: 'UWWebServices',
        description: 'UW Web Services',
        fields: Object.assign({}, pws, sws, idcard)
    }) 
  });
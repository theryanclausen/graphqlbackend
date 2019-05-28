const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType
} = require("graphql");

//Belt or Stip Type
const NameIDType = new GraphQLObjectType({
  name: "NameIDCombo",
  fields: () => ({
    name: { type: GraphQLString },
    id: { type: GraphQLString }
  })
});

//Competitor Type
const CompetitorType = new GraphQLObjectType({
  name: "Competitor",
  fields: () => ({
    belt: { type: GraphQLString },
    manager: { type: GraphQLString },
    name: { type: GraphQLList(GraphQLString) }
  })
});

// Match Type
const MatchType = new GraphQLObjectType({
  name: "Match",
  fields: () => ({
    id: { type: GraphQLString },
    stipulation: { type: GraphQLString },
    competitors: { type: GraphQLList(CompetitorType) }
  })
});

const idSearch = schema =>({
    args: {
        id: { type:GraphQLString }
      },
      async resolve(parentValue, { id }) {
        const res = await axios.get(`http://localhost:3333/${schema}/` + id);
        return res.data
      }
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    match: {
      type: MatchType,
      ...idSearch('matches')
    },
    stipulation: {
        type: NameIDType,
        ...idSearch('stipulations')
    },
    belt: {
        type: NameIDType,
        ...idSearch('belts')
    },
    matches:{
        type: GraphQLList(MatchType),
        async resolve(parentValue){
            const res = await axios.get('http://localhost:3333/matches')
            return res.data
        }
    }
  }
});

const createCompetitorInputType = new GraphQLInputObjectType({
    name:"createCompetitorInput",
    fields: () => ({
        belt: { type: GraphQLString },
        manager: { type: GraphQLString },
        name: { type:new GraphQLList(GraphQLString) }
      })
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        addBelt:{
            type: NameIDType,
            args:{name:{type: new GraphQLNonNull(GraphQLString)}},
            async resolve(parentValue, args){
                const res = await axios.post('http://localhost:3333/belts', args)
                return res.data
            }
        },
        addStipulation:{
            type: NameIDType,
            args:{name:{type: new GraphQLNonNull(GraphQLString)}},
            async resolve(parentValue, args){
                const res = await axios.post('http://localhost:3333/stipulations', args)
                return res.data
            }
        },
        addMatch:{
            type: MatchType,
            args:{
                competitors: {type:new GraphQLList(createCompetitorInputType)},
                stipulation: {type:GraphQLString}
            },
            async resolve(parentValue, args){
                console.log(args)
                const res = await axios.put('http://localhost:3333/matches', args)
                return res.data
            }
        }
    }
})

module.exports = new GraphQLSchema({query: RootQuery, mutation});

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

const idSearch = schema => ({
  args: {
    id: { type: GraphQLString }
  },
  async resolve(parentValue, { id }) {
    const res = await axios.get(`http://localhost:3333/${schema}/` + id);
    return res.data;
  }
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    match: {
      type: MatchType,
      ...idSearch("matches")
    },
    stipulation: {
      type: NameIDType,
      ...idSearch("stipulations")
    },
    belt: {
      type: NameIDType,
      ...idSearch("belts")
    },
    belts: {
      type: GraphQLList(NameIDType),
      async resolve() {
        const res = await axios.get("http://localhost:3333/belts");
        return res.data;
      }
    },
    matches: {
      type: GraphQLList(MatchType),
      async resolve() {
        const res = await axios.get("http://localhost:3333/matches");
        return res.data;
      }
    }
  }
});

const createCompetitorInputType = new GraphQLInputObjectType({
  name: "createCompetitorInput",
  fields: () => ({
    belt: { type: GraphQLString },
    manager: { type: GraphQLString },
    name: { type: GraphQLList(GraphQLString) }
  })
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBelt: {
      type: NameIDType,
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
      async resolve(_, args) {
        const res = await axios.post("http://localhost:3333/belts", args);
        return res.data;
      }
    },
    addStipulation: {
      type: NameIDType,
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
      async resolve(_, args) {
        const res = await axios.post(
          "http://localhost:3333/stipulations",
          args
        );
        return res.data;
      }
    },
    addMatch: {
      type: MatchType,
      args: {
        competitors: { type: new GraphQLList(createCompetitorInputType) },
        stipulation: { type: GraphQLString }
      },
      async resolve(_, args) {
        const res = await axios.post("http://localhost:3333/matches", args);
        return res.data;
      }
    },
    deleteBelt: {
      type: NameIDType,
      args: { id: { type: GraphQLString } },
      async resolve(_, { id }) {
        const res = await axios.delete("http://localhost:3333/belts" + id);
        return res.data;
      }
    },
    deleteStipulation: {
      type: NameIDType,
      args: { id: { type: GraphQLString } },
      async resolve(_, { id }) {
        const res = await axios.delete(
          "http://localhost:3333/stipulations" + id
        );
        return res.data;
      }
    },
    deleteMatch: {
      type: MatchType,
      args: { id: { type: GraphQLString } },
      async resolve(_, { id }) {
        const res = await axios.delete("http://localhost:3333/matches" + id);
        return res.data;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });

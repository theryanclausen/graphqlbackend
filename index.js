const express = require("express");
const expressGraphQL = require("express-graphql");

const schema = require('./schema.js')
const port = 3339;
const app = express();

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log(`we hear you ${port}`);
});

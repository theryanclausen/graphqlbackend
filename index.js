const express = require("express");
const cors = require('cors')
const expressGraphQL = require("express-graphql");

const schema = require('./schema.js')
const port = 3339;
const app = express();

app.use(cors())

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

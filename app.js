const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World !');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type rootQuery {
            events: [String!]!
        }

        type rootMutation {
            createEvents(name: String): String
        }

        schema {
            query: rootQuery,
            mutation: rootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ['Coding Competitions', 'Marathon', 'Cycle Race'];
      },
      createEvents: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);

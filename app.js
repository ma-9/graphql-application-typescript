const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const eventsArray = [];

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Hello World !');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input inputType {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type rootQuery {
            events: [Event!]!
        }

        type rootMutation {
            createEvents(eventInput: inputType): Event
        }

        schema {
            query: rootQuery,
            mutation: rootMutation
        }
    `),
    rootValue: {
      events: () => {
        return eventsArray;
      },
      createEvents: (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price,
          date,
        };
        eventsArray.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);

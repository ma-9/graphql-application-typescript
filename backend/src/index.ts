import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { serverPort, MongoDB_URI } from './helpers';
import { graphQLResolvers, graphQLSchemas } from './graphql';
import { isAuthenticated } from './middlewares';

const app: Application = express();

//=======================  Handling Cross Origin Resource Sharing =======================
app.use(cors());

app.use(bodyParser.json());

app.use(isAuthenticated);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchemas,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

app.use('/', (req, res) => {
  res.json({
    msg: 'Welcome to GraphQL Backend',
    endpoint: '/graphql',
  });
});

mongoose
  .connect(`${MongoDB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(serverPort);
  })
  .catch((err) => {
    console.log(err);
  });

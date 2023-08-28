import express from 'express'
import cors from 'cors'
import errorHandler from './api/middleware/errorHandler'
import { defaultPORT } from './utils/config';

import nodeRouter from './api/routes/node-routes';
import nodesRouter from './api/routes/nodes-routes';
import rpcRouter from './api/routes/rpc-routes';
import receivingRouter from './api/routes/receiving-routes';

// app.use(bodyParser.json()) I listen :) 

const app = express()
app.use(cors({
  origin: '*',
}));

app.use(express.json())
app.use(rpcRouter)
app.use(nodeRouter)
app.use(nodesRouter)
app.use(receivingRouter)

app.all('*', (req, res, next) => {

  const err:any = new Error(
    `Couldn't find ${req.originalUrl}, did you misspell the url?`
  );
  (err.status = 'Not Found'), (err.statusCode = 404);

  next(err)
})

app.use(errorHandler)

const PORT = defaultPORT;

app.listen(
  PORT,
  () => {console.log(`Express is listening to port ${defaultPORT}`)}
);




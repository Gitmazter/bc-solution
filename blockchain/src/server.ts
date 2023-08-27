import express, { Response } from 'express'
import cors from 'cors'
import errorHandler from './api/middleware/errorHandler'
import router from './api/routes/node-routes';
import bodyParser from 'body-parser';

const app = express()
app.use(cors({
  origin: '*',
}));

app.use(bodyParser.json())
app.use(router)
// app.use(express.json())

app.all('*', (req, res, next) => {

  const err:any = new Error(
    `Couldn't find ${req.originalUrl}, did you misspell the url?`
  );
  (err.status = 'Not Found'), (err.statusCode = 404);

  next(err)
})

app.use(errorHandler)

const PORT = 8080;

app.listen(
  PORT,
  () => {console.log('Express is listening to port 8080')}
);




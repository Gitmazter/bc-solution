import express from 'express';
import cors from 'cors';

const port = 3000;

const http = express();
http.use(express.json());
http.use(cors())

http.get('/ping', (req,res) => {
  res.status(200).json('Pong')
})

http.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
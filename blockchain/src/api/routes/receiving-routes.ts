import express from 'express'
const receivingRouter = express.Router();

const {
  receiveBlock,
  receiveTransaction
} = require('../controllers/receiving-controller');

receivingRouter.route('/receive/block').post(receiveBlock);
receivingRouter.route('/receive/tx').post(receiveTransaction);

export default receivingRouter
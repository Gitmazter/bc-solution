import express from 'express';
const rpcRouter = express.Router();

const {
  ping,
  latestBlock,
  getBlockchain
} = require('../controllers/rpc-controller');

rpcRouter.route('/rpc/ping').get(ping);
rpcRouter.route('/rpc/latest-block').get(latestBlock);
rpcRouter.route('/rpc/get-blockchain').get(getBlockchain);

export default rpcRouter
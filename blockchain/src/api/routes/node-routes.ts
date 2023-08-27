const express = require('express');
const router = express.Router();

const {
  ping,
  latestBlock,
  getBlockchain,
  addTransaction,
  mineBlock,
  registerBroadcastNode,
  registerSingleNode,
  registerNodes,
  listNodes
} = require('../controllers/node-controller');

router.route('/rpc/ping').get(ping);
router.route('/rpc/latestBlock').get(latestBlock);


router.route('/node/getBlockchain').get(getBlockchain);
router.route('/node/addTransaction').post(addTransaction);
router.route('/node/mineBlock').get(mineBlock);


router.route('/nodes/register-broadcast-node').post(registerBroadcastNode);
router.route('/nodes/register-node').post(registerSingleNode);
router.route('/nodes/register-nodes').post(registerNodes);
router.route('/nodes/listNodes').get(listNodes);

export default router

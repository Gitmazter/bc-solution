const express = require('express');
const router = express.Router();

const {
  ping,
  latestBlock,
  blockchain,
  addTransaction,
  mineBlock
} = require('../controllers/node-controller');

router.route('/ping').get(ping);
router.route('/latestBlock').get(latestBlock);
router.route('/blockchain').get(blockchain)
router.route('/addTransaction').post(addTransaction)
router.route('/mineBlock').get(mineBlock)

export default router

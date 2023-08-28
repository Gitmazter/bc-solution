"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { ping, latestBlock, getBlockchain, addTransaction, mineBlock, registerBroadcastNode, registerSingleNode, registerNodes, listNodes, receiveBlock, receiveTransaction, consensus } = require('../controllers/node-controller');
router.route('/rpc/ping').get(ping);
/* \/ */
router.route('/rpc/get-pending').get(ping);
/* ^ */
router.route('/rpc/latest-block').get(latestBlock);
router.route('/node/get-blockchain').get(getBlockchain);
router.route('/node/add-transaction').post(addTransaction);
router.route('/node/mine-block').get(mineBlock);
router.route('/receive/block').post(receiveBlock);
router.route('/receive/tx').post(receiveTransaction);
router.route('/nodes/register-broadcast-node').post(registerBroadcastNode);
router.route('/nodes/register-node').post(registerSingleNode);
router.route('/nodes/register-nodes').post(registerNodes);
router.route('/nodes/consensus').get(consensus);
router.route('/nodes/list-nodes').get(listNodes);
exports.default = router;
//# sourceMappingURL=node-routes.js.map
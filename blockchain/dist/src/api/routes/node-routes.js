"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { ping, latestBlock, blockchain, addTransaction, mineBlock, registerBroadcastNode, registerSingleNode, registerNodes, listNodes } = require('../controllers/node-controller');
router.route('/ping').get(ping);
router.route('/latestBlock').get(latestBlock);
router.route('/blockchain').get(blockchain);
router.route('/addTransaction').post(addTransaction);
router.route('/mineBlock').get(mineBlock);
router.route('/nodes/register-broadcast-node').post(registerBroadcastNode);
router.route('/nodes/register-node').post(registerSingleNode);
router.route('/nodes/register-nodes').post(registerNodes);
router.route('/nodes/listNodes').get(listNodes);
exports.default = router;
//# sourceMappingURL=node-routes.js.map
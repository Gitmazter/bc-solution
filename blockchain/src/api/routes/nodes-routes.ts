import express from 'express'
const nodesRouter = express.Router();

const {
  registerBroadcastNode,
  registerSingleNode,
  registerNodes,
  consensus,
  listNodes
} = require('../controllers/nodes-controller')

nodesRouter.route('/nodes/register-broadcast-node').post(registerBroadcastNode);
nodesRouter.route('/nodes/register-node').post(registerSingleNode);
nodesRouter.route('/nodes/register-nodes').post(registerNodes);
nodesRouter.route('/nodes/consensus').get(consensus)
nodesRouter.route('/nodes/list-nodes').get(listNodes);

export default nodesRouter
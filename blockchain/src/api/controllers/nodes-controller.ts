import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import { kekChain, response } from "../../utils/config";
import axios from "axios";



// Register and broadcast node
exports.registerBroadcastNode = catchErrorAsync(async (req:Request, res:Response) => {
  const urlToAdd = req.body.nodeUrl;

  if (kekChain.networkNodes.indexOf(urlToAdd) === -1 && kekChain.nodeUrl != urlToAdd) {
    kekChain.networkNodes.push(urlToAdd);
  }

  kekChain.networkNodes.forEach(async (url) => {
    const body = { nodeUrl  : urlToAdd }
    await fetch (`${url}/nodes/register-node`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type' : 'application/json' },
    });
  });

  const body = {nodes : [...kekChain.networkNodes, kekChain.nodeUrl]}

  await fetch(`${urlToAdd}/nodes/register-nodes`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  res.status(201).json({ success: true, data: 'Ny nod tillagd' });
});

// Register node
exports.registerSingleNode = catchErrorAsync(async (req:Request, res:Response) => {
  const url = req.body.nodeUrl;
  console.log('Registering new node at: ' + url);

  if (kekChain.networkNodes.indexOf(url) === -1 && kekChain.nodeUrl !== url) {
    kekChain.networkNodes.push(url);
  }
  res.status(201).json({ success: true, data: 'Your Node Has Been Added' });
})

// Register nodes
exports.registerNodes = catchErrorAsync(async (req:Request, res:Response) => {
  const allNodes:string[] = req.body.nodes;

  allNodes.forEach((url) => {
    console.log('Registering new node at: ' + url);
    if (kekChain.networkNodes.indexOf(url) === -1 && kekChain.nodeUrl !== url) {
      kekChain.networkNodes.push(url);
    }
  })
  res.status(201).json({ success: true, data: 'New Nodes Added' });
})

// List all networkNodes urls at target node
exports.listNodes = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain.networkNodes;
  response.status = 'Success';
  response.statusCode = 201;
  response.data = data;

  res.status(response.statusCode).json(response);
});


// Query networkNodes for their blockchain,  validate and synchronize the local node with the current block-leader
exports.consensus = catchErrorAsync(async (req:Request, res:Response) => {
  console.clear();
  console.log("Searching for current block leader \n\n");

  const localLen = kekChain.chain.length;
  let blockLeader = kekChain.nodeUrl;
  let longestChainLen = localLen;
  let longestChain = null;
  let pendingList = null;
  let chainUpdated = false;

  await kekChain.networkNodes.forEach(async (url) => {
    await axios(`${url}/rpc/get-blockchain`)
    .then(async (body) => {

      const remoteChain:BlockchainTypes = body.data.data;

      if (remoteChain.chain.length > longestChainLen) {
        longestChainLen = remoteChain.chain.length;
        longestChain = remoteChain.chain;
        pendingList = remoteChain.pendingList;
        blockLeader = url;
      };
    })
    .then(() => {
      if (longestChain && kekChain.validateChain(longestChain)) {
        chainUpdated = true;
        kekChain.chain = longestChain;
        kekChain.pendingList = pendingList;
      };
    }) 
  })

  console.log('Chain synchronized');
  
  response.status = "Success";
  response.statusCode = 200;
  response.data = {"chainUpdated": chainUpdated, "blockLeader": blockLeader};
  res.status(response.statusCode).json(response);
});
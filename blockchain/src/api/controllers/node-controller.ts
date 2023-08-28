import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import { kekChain } from "../../utils/config";
import axios from "axios";
import { ResponseError } from "web3";

const response = {
  status: 'Not found',
  statusCode: 404,
  data: null,
  error: null,
};

exports.ping = catchErrorAsync(async (req:Request, res:Response) => {
  const data = 'pong';
  response.status = 'Success'
  response.statusCode = 200;
  response.data = data
  res.status(response.statusCode).json(response)
})

exports.latestBlock = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain.latestBlock();
  response.status = 'Success'
  response.statusCode = 201;
  console.log(data);
  
  response.data = data
  res.status(response.statusCode).json(response)
})

exports.getBlockchain = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain
  response.status = 'Success';
  response.statusCode = 202;
  response.data = data;

  res.status(response.statusCode).json(response)
})

exports.addTransaction = catchErrorAsync(async (req:Request, res:Response) => {
  let tx = req.body;
  const txString = JSON.stringify(req.body);
  tx.txHash = await kekChain.createHash(txString);

  const txIsValid = await kekChain.validateTransaction(tx);
  
  if (txIsValid) {
    kekChain.pendingList.push(tx);

    kekChain.networkNodes.forEach(async (url) => {
      await fetch(`${url}/api/receive-tx`, {
        method: 'POST',
        body: JSON.stringify(tx),
        headers: { 'Content-Type': 'application/json' },
      });
    });
    response.status = "Success";
    response.statusCode = 203;
    response.data = {'transaction' : tx,  'transactionValidated': true, 'txHash' : txString, 'expectedBlock': txIsValid};
    res.status(response.statusCode).json(response);
  }else {
    response.status = "Failed";
    response.statusCode = 400;
    response.data = {'transaction' : tx,  'transactionValidated': false, 'txHash' : null, 'expectedBlock': -1, 'reason':"Invalid Transaction!"};
  };
});

exports.receiveTransaction = catchErrorAsync(async (req:Request, res:Response) => {
  const tx = req.body;
  const txIsValid = await kekChain.validateTransaction(tx);
  if (txIsValid) {
    kekChain.pendingList.push(tx);

    response.statusCode = 202;
    response.status = "Success";
    response.data = {'transaction': tx, 'accepted' : txIsValid};
    res.status(response.statusCode).json(response);
  } else {
    response.statusCode = 401;
    response.status = "Failed";
    response.data = {'transaction': tx, 'accepted' : txIsValid, 'reason':'invalid transaction'};
    res.status(response.statusCode).json(response);
  }

})

exports.mineBlock = catchErrorAsync(async (req:Request, res:Response) => {
  console.clear()
  console.log("request received. Mining....");
  
  const data = await kekChain.mineBlock();
  kekChain.chain.push(data);

  kekChain.networkNodes.forEach(async (url) => {
    console.log('sending block to: ', url);
    
    await fetch(`${url}/receive/block`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  response.status = 'Success';
  response.statusCode = 200;
  response.data = data;
  console.log(response);
  
  res.status(response.statusCode).json(response);
})

exports.receiveBlock = catchErrorAsync(async (req:Request, res:Response) => {
  console.clear()
  console.log("Block received, validating.....\n\n");
  
  const block = req.body;
  const blockIsValid = await kekChain.validateBlock(block)
  console.log((`Block Valid : ${blockIsValid}\n\n`));
  
  if (blockIsValid) {
    kekChain.chain.push(block as Block)
    kekChain.pendingList = [];

    // clear only txs in block
    // for (let tx in block.data) {

    // }

    response.statusCode = 202;
    response.status = "Success";
    response.data = {'block': block, 'accepted' : blockIsValid};
    res.status(response.statusCode).json(response);
  } 
  else {
    response.statusCode = 401;
    response.status = "Failed";
    response.data = {'block': block, 'accepted' : blockIsValid, 'reason':'invalid block'};
    res.status(response.statusCode).json(response);
  }

})


/* ADMINISTRATIVE  */

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

// Request nodes
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

exports.listNodes = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain.networkNodes;
  response.status = 'Success';
  response.statusCode = 201;
  response.data = data;

  res.status(response.statusCode).json(response);
});

// Synchronize

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
    await axios(`${url}/node/get-blockchain`)
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



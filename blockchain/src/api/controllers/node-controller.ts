import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import Blockchain from "../../blockchain/Blockchain";
import { Transaction } from "../../blockchain/Transaction";
import bodyParser, { json } from "body-parser";
import { kekChain } from "../../utils/config";
import axios, { AxiosHeaders } from "axios";



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

exports.blockchain = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain
  response.status = 'Success';
  response.statusCode = 202;
  response.data = data;

  res.status(response.statusCode).json(response)
})

exports.addTransaction = catchErrorAsync(async (req:Request, res:Response) => {
  let tx = req.body

  const txString = JSON.stringify(req.body)
  
  tx.txHash = await kekChain.createHash(txString)

  const isTxValid = await kekChain.proposeTransaction(tx)
  
  response.status = isTxValid ? "Success" : "Failed";
  response.statusCode = isTxValid? 203 : 400;
  console.log(isTxValid);
  
  response.data = {
    "transactionValidated" : isTxValid ? true : false , 
    "txHash" : tx.txHash,
    "expectedBlock": isTxValid ? isTxValid : "never"}

  res.status(response.statusCode).json(response)

})

exports.mineBlock = catchErrorAsync(async (req:Request, res:Response) => {
  console.log("request received. Mining....");
  
  const data = await kekChain.mineBlock();

  response.status = 'Success';
  response.statusCode = 200;
  response.data = data;
  console.log(response);
  
  res.status(response.statusCode).json(response);


})


/* ADMINISTRATIVE  */

// Register and broadcast self
exports.registerBroadcastNode = catchErrorAsync(async (req:Request, res:Response) => {
  const urlToAdd = req.body.nodeUrl;

  if (kekChain.networkNodes.indexOf(urlToAdd) === -1) {
    kekChain.networkNodes.push(urlToAdd);
  }
  kekChain.networkNodes.forEach(async (url) => {
    const body = { nodeUrl  : urlToAdd }
    await fetch (`${url}/registerNode`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type' : 'application/json' },
    });
  });

  const body = {nodes : [...kekChain.networkNodes, kekChain.nodeUrl]}

  await fetch(`${urlToAdd}/api/register-nodes`, {
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
  response.data = data

  res.status(response.statusCode).json(response)
})

// Broadcast Transaction

// Broadcast Block

// Synchronize

// 
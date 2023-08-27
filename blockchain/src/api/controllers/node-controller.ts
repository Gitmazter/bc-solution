import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import Blockchain from "../../blockchain/Blockchain";
import { Transaction } from "../../blockchain/Transaction";
import bodyParser, { json } from "body-parser";

const chillchain = new Blockchain()

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
  const data = chillchain.latestBlock();
  response.status = 'Success'
  response.statusCode = 201;
  console.log(data);
  
  response.data = data
  res.status(response.statusCode).json(response)
})

exports.blockchain = catchErrorAsync(async (req:Request, res:Response) => {
  const data = chillchain
  response.status = 'Success';
  response.statusCode = 202;
  response.data = data;

  res.status(response.statusCode).json(response)
})

exports.addTransaction = catchErrorAsync(async (req:Request, res:Response) => {
  let tx = req.body

  const txString = JSON.stringify(req.body)
  
  tx.txHash = await chillchain.createHash(txString)

  const isTxValid = chillchain.proposeTransaction(tx)
  
  response.status = isTxValid ? 'Success' : "Failed";
  response.statusCode = isTxValid? 203 : 400;
  response.data = {
    "transaction-validated" : isTxValid ? true : false , 
    "txHash" : tx.txHash,
    "expected-block": isTxValid ? isTxValid : "never"}

  res.status(response.statusCode).json(response)

})

exports.mineBlock = catchErrorAsync(async (req:Request, res:Response) => {
  console.log("request received. Mining....");
  
  const data = await chillchain.mineBlock();

  response.status = 'Success';
  response.statusCode = 204;
  response.data = data;
  console.log(response);
  
  res.status(response.statusCode).json(response)


})
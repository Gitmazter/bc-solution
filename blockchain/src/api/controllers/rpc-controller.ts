import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import { kekChain, response } from "../../utils/config";

// Returns "pong"
exports.ping = catchErrorAsync(async (req:Request, res:Response) => {
  const data = 'pong';
  response.status = 'Success'
  response.statusCode = 200;
  response.data = data
  res.status(response.statusCode).json(response)
})

// Returns latest block in chain
exports.latestBlock = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain.latestBlock();
  response.status = 'Success'
  response.statusCode = 201;
  console.log(data);
  
  response.data = data
  res.status(response.statusCode).json(response)
})

// Returns entire blockchain object. (Unreliable method for longer chains) Will need to be paid service or
// limited to a slice of the blockchain due to bandwidth/processing demands. 
exports.getBlockchain = catchErrorAsync(async (req:Request, res:Response) => {
  const data = kekChain
  response.status = 'Success';
  response.statusCode = 202;
  response.data = data;

  res.status(response.statusCode).json(response)
})

import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import { kekChain, response } from "../../utils/config";



// Receive, validate and accept block if it is valid
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

// Receive, validate and accept transaction if it is valid
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
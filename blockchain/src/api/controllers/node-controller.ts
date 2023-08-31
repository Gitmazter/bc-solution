import { Request, Response} from "express";
import catchErrorAsync from "../utils/catchErrorAsync";
import { kekChain, response } from "../../utils/config";


// Validate and add transaction to pendinglist then broadcast to network nodes
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


// mine blockhash and broadcast to network nodes
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

exports.getOwnerVehicles = catchErrorAsync(async (req:Request, res:Response) => {
  // Note for Michael
  // leaving request as recipient here to make testing for you easier so that you dont have to 
  // rewrite Postman bodies too much between transactions/queries ** Should be req.body.owner or similar
  const owner = req.body.recipient;
  const vehicles = kekChain.findOwnerVehicles(owner);

  response.status = 'Success';
  response.statusCode = 200;
  response.data = vehicles;
  console.log(response);
  
  res.status(response.statusCode).json(response);
});




exports.newVehicle = catchErrorAsync(async (req:Request, res:Response) => {
  const vehicleData = req.body;

  const tx = await kekChain.firstRegistration(vehicleData.recipient, vehicleData.year, vehicleData.make, vehicleData.model) 
  kekChain.pendingList.push(tx)

  kekChain.networkNodes.forEach(async (url) => {
    console.log('sending block to: ', url);
    
    await fetch(`${url}/receive/tx`, {
      method: 'POST',
      body: JSON.stringify(tx),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  response.status = 'Success';
  response.statusCode = 200;
  response.data = tx;
  console.log(response);
  
  res.status(response.statusCode).json(response);
});




exports.vehicleTransfer = catchErrorAsync(async (req:Request, res:Response) => {
  const vehicleData = req.body;
  
  const tx = await kekChain.vehicleTransfer(
    vehicleData.sender, 
    vehicleData.recipient, 
    vehicleData.vehicle, 
    vehicleData.year, 
    vehicleData.make, 
    vehicleData.model
  )
  kekChain.pendingList.push(tx);
  kekChain.networkNodes.forEach(async (url) => {
    console.log('sending block to: ', url);
    
    await fetch(`${url}/receive/tx`, {
      method: 'POST',
      body: JSON.stringify(tx),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  response.status = 'Success';
  response.statusCode = 200;
  response.data = tx;
  console.log(response);
  
  res.status(response.statusCode).json(response);
})








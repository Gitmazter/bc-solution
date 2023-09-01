import { Transaction } from 'mongodb';
import Block from './Block'
import { VehicleTransaction } from './Transaction';

class Blockchain implements BlockchainTypes {
  chain: Block[];
  pendingList: VehicleTransaction[];
  nodeUrl: string;
  networkNodes: string[];

  constructor() {
    this.chain = [];
    this.pendingList = [];
    this.nodeUrl = process.argv[3];
    this.networkNodes = [];

    this.createGenesisBlock(1, 'genesis', 'genesis');
  };

  createGenesisBlock (nonce:number, previousHash:string, hash:string ) { //Cant have hash before block is created 
    const block:Block = {
     index: this.chain.length + 1,
     timestamp: 0,
     uiTimestamp: "",
     data: this.pendingList,
     nonce: nonce,
     hash: hash,
     previousHash: previousHash,
    };
    
    this.pendingList = [];
    this.chain.push(block);
    return block;
    
  };

  createBlock (nonce:number, previousHash:string) { //Cant have hash before block is created
    const now = new Date()
    const block:Block = new Block(
      this.chain.length + 1,
      this.pendingList,
      nonce,
      previousHash,
      now
    );
    return block;
  };

  latestBlock () {
    return this.chain.at(-1)
  };
  
  async validateTransaction(transaction:VehicleTransaction) {
    const origTx = transaction;
    let tempTx = transaction;

    tempTx.hash = '';
    tempTx.hash = await this.createHash(JSON.stringify(tempTx));

    console.log(origTx.sender);
    
    const senderVehicles = this.findOwnerVehicles(origTx.sender);
    console.log(senderVehicles);
        
    if (tempTx.hash == origTx.hash && senderVehicles.map(e => e.vehicle).indexOf(origTx.vehicle)) {
      console.log('Transaction Valid');
      
      this.pendingList.push(origTx);

      const nextBlock = this.latestBlock().index + 1
      console.log(nextBlock);
      
      return nextBlock;
    }
    
    else if (tempTx.hash == origTx.hash && origTx.sender == '00') {
      console.log('Transaction Valid');
      
      this.pendingList.push(transaction);

      const nextBlock = this.latestBlock().index + 1
      console.log(nextBlock);
      
      return nextBlock;
    }
    else {
      console.log('Transaction Invalid');
      return null
    }
  };

  async findVehicleTransactions (vehicle:string) {
    let transactions = []
    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        // console.log(transaction, vehicle);
        if (transaction.vehicle == vehicle) {
          transactions.push(transaction)
        }
      })
    })
    return transactions;
  }

  async firstRegistration(recipient:string, year:number, make: string, model:string) {
    const govSender = '00'
    let newCar = new VehicleTransaction(govSender, recipient, undefined, year, make, model)
    newCar.hash = await this.createHash(JSON.stringify(newCar));
    return newCar
  }

  async vehicleTransfer(sender:string, recipient:string, vehicle:string, year:number, make: string, model:string) {
    const latestTransfer = this.searchPlate(vehicle);
    console.log(latestTransfer)

    if (latestTransfer.recipient = sender) {
      let updatedState = new VehicleTransaction(sender, recipient, vehicle, year, make, model);
      updatedState.hash = await this.createHash(JSON.stringify(updatedState));
      return updatedState;
    }
  }

  searchPlate (vehicle:string) {
    let foundVehicle = null;
    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.vehicle = vehicle) {
          foundVehicle = transaction;
        }
      });
    });
    return foundVehicle;
  };

  findOwnerVehicles (sender:string) {
    let vehicles = []
    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {

        if (transaction.recipient == sender) {
          vehicles.push(transaction)
        };

        if (transaction.sender == sender) {
          var index = vehicles.findIndex((vehicle) => {
            return vehicle.recipient == sender
          });
          vehicles.splice(index, 1)
        };
      });
    });
    return vehicles
  };
 
  async createHash(input:string) {
    const inputBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", inputBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("")
    return hash
  };

  async mineBlock() {
    const previousHash = this.chain.at(-1).hash;
    const newBlock = await this.POW(previousHash);

    this.pendingList = [] 
    return newBlock;
  };

  async POW (previousHash:string) {
    let nonce = 0;
    let tempBlock:Block = this.createBlock(nonce, previousHash);
    let nonceFound = false;
    
    while (nonceFound === false) {
      tempBlock = this.createBlock(nonce, previousHash);
      const tempHash = await this.createHash(JSON.stringify(tempBlock));
      // console.log(tempHash.slice(0,4));
      if (tempHash.slice(0,4) === "0000") {      
        tempBlock.hash = tempHash;
        nonceFound = true;
      }; 
      nonce++;
    };

    return tempBlock;
  };


  async validateBlock (block:Block) {
    /* 
      NOTE: Changes to temp block affect block in chain later despite never being pushed
      Perhaps it has to do with memory pointers and setting tempblock = block allowing changes
      to the original block? 

      Question for Michael:: Confirmed by Michael, ok solution since we don't have to think about memory management 
    */

    let tempBlock = block;
    let previousHash = this.chain.at(-1).hash;
    
    let blockIsValid = true;

    if (block.previousHash !== previousHash) {
      blockIsValid = false;
    }

    const origHash = tempBlock.hash
    tempBlock.hash = ""
    const testHash = await this.createHash(JSON.stringify(tempBlock));
    tempBlock.hash = testHash;

    
    if (origHash !== testHash) {
      blockIsValid = false
    }

    return blockIsValid;
  }

  async validateChain (chain:Block[]) {
    let chainIsValid = true;
    chain.map((block) => {
      if (block.index !== 1 && block.hash !== 'genesis') {
        const blockIsValid = this.validateBlock(block);
        if (!blockIsValid) { chainIsValid = false }
      }
    })
    return chainIsValid;
  }


};

export default Blockchain
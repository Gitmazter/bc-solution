import Block from './Block'

// TODO: Validate chain on startup if chain is !== []

class Blockchain implements BlockchainTypes {
  chain: Block[];
  pendingList: Transaction[];
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

  async validateTransaction(transaction:any) {
    // validate tx before pushing
    this.pendingList.push(transaction);

    const nextBlock = this.latestBlock().index + 1
    console.log(nextBlock);
    
    return nextBlock;
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
    // this.chain.push(newBlock);
    // Broadcast new block 
    // somefunctobroadcast()

    this.pendingList = [] // Ensure new additions during mining period to pending list are not removed
    // Remove all pending list entries up to and including last tx hash in pending list
    // somealgotoclearpending()
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

      Question for Michael
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
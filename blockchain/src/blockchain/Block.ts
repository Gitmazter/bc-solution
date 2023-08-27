class Block implements Block {
  index: number;
  timestamp: number;
  uiTimestamp: string;
  data: Transaction[];
  nonce: number;
  hash: string;
  previousHash: string;

  constructor(
    index: number, 
    data: Transaction[]|undefined, 
    nonce: number, 
    previousHash: string,   
    now:Date,
    ) {
    this.index = index,
    this.timestamp = now.valueOf(),
    this.uiTimestamp = now.toUTCString(),
    this.data = data,
    this.nonce = nonce,
    this.hash = "",
    this.previousHash = previousHash
  };
};

export default Block
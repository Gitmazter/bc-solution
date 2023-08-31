interface User {
  privateKey: string,
  publicKey:string
};

interface Transaction {
  vehicle: string,
  sender: string,
  recipient: string,
  year: number,
  make: string,
  model: string,
  hash: string
};

interface Block {
  index:number,
  timestamp: number,
  uiTimestamp: string,
  data: Transaction[],
  nonce: number,
  hash: string,
  previousHash: string
};

interface BlockchainTypes {
  chain: Block[],
  pendingList : Transaction[],
  nodeUrl: string,
  networkNodes: string[]
};

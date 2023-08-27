interface User {
  privateKey: string,
  publicKey:string
};

interface Transaction {
  amount: number,
  sender: string,
  recipient: string,
  transactionId: string,
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

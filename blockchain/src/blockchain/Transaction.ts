import { randomUUID } from "crypto";

export class Transaction implements Transaction {
  product:string;
  amount: number;
  sender: string;
  recipient: string;
  transactionId: string;
  signature: string;
  hash: string;

  constructor (product: string, amount: number, sender:string, recipient:string, signature: any) {
    this.product = product;
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.transactionId = randomUUID()
    this.signature = signature
    this.hash = ''
  }
}
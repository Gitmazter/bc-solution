"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const crypto_1 = require("crypto");
class Transaction {
    constructor(product, amount, sender, recipient, signature) {
        this.product = product;
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.transactionId = (0, crypto_1.randomUUID)();
        this.signature = signature;
        this.hash = '';
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map
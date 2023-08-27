"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __importDefault(require("./Block"));
// TODO: Validate chain on startup if chain is !== []
class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingList = [];
        this.nodeUrl = process.argv[3];
        this.networkNodes = [];
        this.createGenesisBlock(1, 'genesis', 'genesis');
    }
    ;
    createGenesisBlock(nonce, previousHash, hash) {
        const now = new Date();
        const block = {
            index: this.chain.length + 1,
            timestamp: now.valueOf(),
            uiTimestamp: now.toUTCString(),
            data: this.pendingList,
            nonce: nonce,
            hash: hash,
            previousHash: previousHash,
        };
        this.pendingList = [];
        this.chain.push(block);
        return block;
    }
    createBlock(nonce, previousHash) {
        const now = new Date();
        const block = new Block_1.default(this.chain.length + 1, this.pendingList, nonce, previousHash, now);
        return block;
    }
    latestBlock() {
        return this.chain.at(-1);
    }
    proposeTransaction(transaction) {
        this.pendingList.push(transaction);
        // validate tx and broadcast to all nodes
        return this.latestBlock().index;
    }
    createHash(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputBuffer = new TextEncoder().encode(input);
            const hashBuffer = yield crypto.subtle.digest("SHA-256", inputBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");
            return hash;
        });
    }
    mineBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const previousHash = this.chain.at(-1).hash;
            const newBlock = yield this.POW(previousHash);
            this.chain.push(newBlock);
            // Broadcast new block 
            // somefunctobroadcast()
            this.pendingList = []; // Ensure new additions during mining period to pending list are not removed
            // Remove all pending list entries up to and including last tx hash in pending list
            // somealgotoclearpending()
            return newBlock;
        });
    }
    POW(previousHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let nonce = 0;
            let tempBlock = this.createBlock(nonce, previousHash);
            let nonceFound = false;
            while (nonceFound === false) {
                tempBlock = this.createBlock(nonce, previousHash);
                const tempHash = yield this.createHash(JSON.stringify(tempBlock));
                // console.log(tempHash.slice(0,4));
                if (tempHash.slice(0, 4) === "0000") {
                    tempBlock.hash = tempHash;
                    nonceFound = true;
                }
                nonce++;
            }
            return tempBlock;
        });
    }
}
;
exports.default = Blockchain;
//# sourceMappingURL=Blockchain.js.map
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
        const block = {
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
    }
    ;
    createBlock(nonce, previousHash) {
        const now = new Date();
        const block = new Block_1.default(this.chain.length + 1, this.pendingList, nonce, previousHash, now);
        return block;
    }
    ;
    latestBlock() {
        return this.chain.at(-1);
    }
    ;
    validateTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate tx before pushing
            this.pendingList.push(transaction);
            const nextBlock = this.latestBlock().index + 1;
            console.log(nextBlock);
            return nextBlock;
        });
    }
    ;
    createHash(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputBuffer = new TextEncoder().encode(input);
            const hashBuffer = yield crypto.subtle.digest("SHA-256", inputBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");
            return hash;
        });
    }
    ;
    mineBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const previousHash = this.chain.at(-1).hash;
            const newBlock = yield this.POW(previousHash);
            // this.chain.push(newBlock);
            // Broadcast new block 
            // somefunctobroadcast()
            this.pendingList = []; // Ensure new additions during mining period to pending list are not removed
            // Remove all pending list entries up to and including last tx hash in pending list
            // somealgotoclearpending()
            return newBlock;
        });
    }
    ;
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
                ;
                nonce++;
            }
            ;
            return tempBlock;
        });
    }
    ;
    validateBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const origHash = tempBlock.hash;
            tempBlock.hash = "";
            const testHash = yield this.createHash(JSON.stringify(tempBlock));
            tempBlock.hash = testHash;
            if (origHash !== testHash) {
                blockIsValid = false;
            }
            return blockIsValid;
        });
    }
    validateChain(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            let chainIsValid = true;
            chain.map((block) => {
                if (block.index !== 1 && block.hash !== 'genesis') {
                    const blockIsValid = this.validateBlock(block);
                    if (!blockIsValid) {
                        chainIsValid = false;
                    }
                }
            });
            return chainIsValid;
        });
    }
}
;
exports.default = Blockchain;
//# sourceMappingURL=Blockchain.js.map
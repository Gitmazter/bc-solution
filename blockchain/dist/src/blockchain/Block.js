"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Block {
    constructor(index, data, nonce, previousHash, now) {
        this.index = index,
            this.timestamp = now.valueOf(),
            this.uiTimestamp = now.toUTCString(),
            this.data = data,
            this.nonce = nonce,
            this.hash = "",
            this.previousHash = previousHash;
    }
    ;
}
;
exports.default = Block;
//# sourceMappingURL=Block.js.map
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
const catchErrorAsync_1 = __importDefault(require("../utils/catchErrorAsync"));
const config_1 = require("../../utils/config");
exports.receiveBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log("Block received, validating.....\n\n");
    const block = req.body;
    const blockIsValid = yield config_1.kekChain.validateBlock(block);
    console.log((`Block Valid : ${blockIsValid}\n\n`));
    if (blockIsValid) {
        config_1.kekChain.chain.push(block);
        config_1.kekChain.pendingList = [];
        // clear only txs in block
        // for (let tx in block.data) {
        // }
        config_1.response.statusCode = 202;
        config_1.response.status = "Success";
        config_1.response.data = { 'block': block, 'accepted': blockIsValid };
        res.status(config_1.response.statusCode).json(config_1.response);
    }
    else {
        config_1.response.statusCode = 401;
        config_1.response.status = "Failed";
        config_1.response.data = { 'block': block, 'accepted': blockIsValid, 'reason': 'invalid block' };
        res.status(config_1.response.statusCode).json(config_1.response);
    }
}));
exports.receiveTransaction = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tx = req.body;
    const txIsValid = yield config_1.kekChain.validateTransaction(tx);
    if (txIsValid) {
        config_1.kekChain.pendingList.push(tx);
        config_1.response.statusCode = 202;
        config_1.response.status = "Success";
        config_1.response.data = { 'transaction': tx, 'accepted': txIsValid };
        res.status(config_1.response.statusCode).json(config_1.response);
    }
    else {
        config_1.response.statusCode = 401;
        config_1.response.status = "Failed";
        config_1.response.data = { 'transaction': tx, 'accepted': txIsValid, 'reason': 'invalid transaction' };
        res.status(config_1.response.statusCode).json(config_1.response);
    }
}));
//# sourceMappingURL=receiving-controller.js.map
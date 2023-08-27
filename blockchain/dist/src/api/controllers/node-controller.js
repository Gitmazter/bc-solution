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
const Blockchain_1 = __importDefault(require("../../blockchain/Blockchain"));
const chillchain = new Blockchain_1.default();
const response = {
    status: 'Not found',
    statusCode: 404,
    data: null,
    error: null,
};
exports.ping = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = 'pong';
    response.status = 'Success';
    response.statusCode = 200;
    response.data = data;
    res.status(response.statusCode).json(response);
}));
exports.latestBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = chillchain.latestBlock();
    response.status = 'Success';
    response.statusCode = 201;
    console.log(data);
    response.data = data;
    res.status(response.statusCode).json(response);
}));
exports.blockchain = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = chillchain;
    response.status = 'Success';
    response.statusCode = 202;
    response.data = data;
    res.status(response.statusCode).json(response);
}));
exports.addTransaction = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tx = req.body;
    const txString = JSON.stringify(req.body);
    tx.txHash = yield chillchain.createHash(txString);
    const isTxValid = chillchain.proposeTransaction(tx);
    response.status = isTxValid ? 'Success' : "Failed";
    response.statusCode = isTxValid ? 203 : 400;
    response.data = {
        "transaction-validated": isTxValid ? true : false,
        "txHash": tx.txHash,
        "expected-block": isTxValid ? isTxValid : "never"
    };
    res.status(response.statusCode).json(response);
}));
exports.mineBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request received. Mining....");
    const data = yield chillchain.mineBlock();
    response.status = 'Success';
    response.statusCode = 204;
    response.data = data;
    console.log(response);
    res.status(response.statusCode).json(response);
}));
//# sourceMappingURL=node-controller.js.map
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
    const data = config_1.kekChain.latestBlock();
    response.status = 'Success';
    response.statusCode = 201;
    console.log(data);
    response.data = data;
    res.status(response.statusCode).json(response);
}));
exports.blockchain = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = config_1.kekChain;
    response.status = 'Success';
    response.statusCode = 202;
    response.data = data;
    res.status(response.statusCode).json(response);
}));
exports.addTransaction = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tx = req.body;
    const txString = JSON.stringify(req.body);
    tx.txHash = yield config_1.kekChain.createHash(txString);
    const isTxValid = yield config_1.kekChain.proposeTransaction(tx);
    response.status = isTxValid ? "Success" : "Failed";
    response.statusCode = isTxValid ? 203 : 400;
    console.log(isTxValid);
    response.data = {
        "transactionValidated": isTxValid ? true : false,
        "txHash": tx.txHash,
        "expectedBlock": isTxValid ? isTxValid : "never"
    };
    res.status(response.statusCode).json(response);
}));
exports.mineBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request received. Mining....");
    const data = yield config_1.kekChain.mineBlock();
    response.status = 'Success';
    response.statusCode = 200;
    response.data = data;
    console.log(response);
    res.status(response.statusCode).json(response);
}));
/* ADMINISTRATIVE  */
// Register and broadcast self
exports.registerBroadcastNode = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlToAdd = req.body.nodeUrl;
    if (config_1.kekChain.networkNodes.indexOf(urlToAdd) === -1) {
        config_1.kekChain.networkNodes.push(urlToAdd);
    }
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        const body = { nodeUrl: urlToAdd };
        yield fetch(`${url}/registerNode`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    const body = { nodes: [...config_1.kekChain.networkNodes, config_1.kekChain.nodeUrl] };
    yield fetch(`${urlToAdd}/api/register-nodes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    res.status(201).json({ success: true, data: 'Ny nod tillagd' });
}));
// Register node
exports.registerSingleNode = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.body.nodeUrl;
    console.log('Registering new node at: ' + url);
    if (config_1.kekChain.networkNodes.indexOf(url) === -1 && config_1.kekChain.nodeUrl !== url) {
        config_1.kekChain.networkNodes.push(url);
    }
    res.status(201).json({ success: true, data: 'Your Node Has Been Added' });
}));
// Request nodes
exports.registerNodes = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allNodes = req.body.nodes;
    allNodes.forEach((url) => {
        console.log('Registering new node at: ' + url);
        if (config_1.kekChain.networkNodes.indexOf(url) === -1 && config_1.kekChain.nodeUrl !== url) {
            config_1.kekChain.networkNodes.push(url);
        }
    });
    res.status(201).json({ success: true, data: 'New Nodes Added' });
}));
exports.listNodes = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = config_1.kekChain.networkNodes;
    response.status = 'Success';
    response.statusCode = 201;
    response.data = data;
    res.status(response.statusCode).json(response);
}));
// Broadcast Transaction
// Broadcast Block
// Synchronize
// 
//# sourceMappingURL=node-controller.js.map
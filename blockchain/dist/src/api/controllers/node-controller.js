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
const axios_1 = __importDefault(require("axios"));
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
exports.getBlockchain = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const txIsValid = yield config_1.kekChain.validateTransaction(tx);
    if (txIsValid) {
        config_1.kekChain.pendingList.push(tx);
        config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
            yield fetch(`${url}/api/receive-tx`, {
                method: 'POST',
                body: JSON.stringify(tx),
                headers: { 'Content-Type': 'application/json' },
            });
        }));
        response.status = "Success";
        response.statusCode = 203;
        response.data = { 'transaction': tx, 'transactionValidated': true, 'txHash': txString, 'expectedBlock': txIsValid };
        res.status(response.statusCode).json(response);
    }
    else {
        response.status = "Failed";
        response.statusCode = 400;
        response.data = { 'transaction': tx, 'transactionValidated': false, 'txHash': null, 'expectedBlock': -1, 'reason': "Invalid Transaction!" };
    }
    ;
}));
exports.receiveTransaction = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tx = req.body;
    const txIsValid = yield config_1.kekChain.validateTransaction(tx);
    if (txIsValid) {
        config_1.kekChain.pendingList.push(tx);
        response.statusCode = 202;
        response.status = "Success";
        response.data = { 'transaction': tx, 'accepted': txIsValid };
        res.status(response.statusCode).json(response);
    }
    else {
        response.statusCode = 401;
        response.status = "Failed";
        response.data = { 'transaction': tx, 'accepted': txIsValid, 'reason': 'invalid transaction' };
        res.status(response.statusCode).json(response);
    }
}));
exports.mineBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log("request received. Mining....");
    const data = yield config_1.kekChain.mineBlock();
    config_1.kekChain.chain.push(data);
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('sending block to: ', url);
        yield fetch(`${url}/receive/block`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    response.status = 'Success';
    response.statusCode = 200;
    response.data = data;
    console.log(response);
    res.status(response.statusCode).json(response);
}));
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
        response.statusCode = 202;
        response.status = "Success";
        response.data = { 'block': block, 'accepted': blockIsValid };
        res.status(response.statusCode).json(response);
    }
    else {
        response.statusCode = 401;
        response.status = "Failed";
        response.data = { 'block': block, 'accepted': blockIsValid, 'reason': 'invalid block' };
        res.status(response.statusCode).json(response);
    }
}));
/* ADMINISTRATIVE  */
// Register and broadcast node
exports.registerBroadcastNode = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlToAdd = req.body.nodeUrl;
    if (config_1.kekChain.networkNodes.indexOf(urlToAdd) === -1 && config_1.kekChain.nodeUrl != urlToAdd) {
        config_1.kekChain.networkNodes.push(urlToAdd);
    }
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        const body = { nodeUrl: urlToAdd };
        yield fetch(`${url}/nodes/register-node`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    const body = { nodes: [...config_1.kekChain.networkNodes, config_1.kekChain.nodeUrl] };
    yield fetch(`${urlToAdd}/nodes/register-nodes`, {
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
// Synchronize
exports.consensus = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log("Searching for current block leader \n\n");
    const localLen = config_1.kekChain.chain.length;
    let blockLeader = config_1.kekChain.nodeUrl;
    let longestChainLen = localLen;
    let longestChain = null;
    let pendingList = null;
    let chainUpdated = false;
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, axios_1.default)(`${url}/node/get-blockchain`)
            .then((body) => __awaiter(void 0, void 0, void 0, function* () {
            const remoteChain = body.data.data;
            if (remoteChain.chain.length > longestChainLen) {
                longestChainLen = remoteChain.chain.length;
                longestChain = remoteChain.chain;
                pendingList = remoteChain.pendingList;
                blockLeader = url;
            }
            ;
        }))
            .then(() => {
            if (longestChain && config_1.kekChain.validateChain(longestChain)) {
                config_1.kekChain.chain = longestChain;
                config_1.kekChain.pendingList = pendingList;
            }
            ;
        });
    }));
    response.status = "Success";
    response.statusCode = 200;
    response.data = { "chainUpdated": chainUpdated, "blockLeader": blockLeader };
    res.status(response.statusCode).json(response);
}));
//# sourceMappingURL=node-controller.js.map
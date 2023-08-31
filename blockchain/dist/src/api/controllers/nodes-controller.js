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
    res.status(201).json({ success: true, data: 'Node Added' });
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
// Register nodes
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
// List all networkNodes urls at target node
exports.listNodes = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = config_1.kekChain.networkNodes;
    config_1.response.status = 'Success';
    config_1.response.statusCode = 201;
    config_1.response.data = data;
    res.status(config_1.response.statusCode).json(config_1.response);
}));
// Query networkNodes for their blockchain,  validate and synchronize the local node with the current block-leader
exports.consensus = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log("Searching for current block leader \n\n");
    const localLen = config_1.kekChain.chain.length;
    let blockLeader = config_1.kekChain.nodeUrl;
    let longestChainLen = localLen;
    let longestChain = null;
    let pendingList = null;
    let chainUpdated = false;
    yield config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, axios_1.default)(`${url}/rpc/get-blockchain`)
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
                chainUpdated = true;
                config_1.kekChain.chain = longestChain;
                config_1.kekChain.pendingList = pendingList;
            }
            ;
        });
    }));
    console.log('Chain synchronized');
    config_1.response.status = "Success";
    config_1.response.statusCode = 200;
    config_1.response.data = { "chainUpdated": chainUpdated, "blockLeader": blockLeader };
    res.status(config_1.response.statusCode).json(config_1.response);
}));
//# sourceMappingURL=nodes-controller.js.map
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
// Validate and add transaction to pendinglist then broadcast to network nodes
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
        config_1.response.status = "Success";
        config_1.response.statusCode = 203;
        config_1.response.data = { 'transaction': tx, 'transactionValidated': true, 'txHash': txString, 'expectedBlock': txIsValid };
        res.status(config_1.response.statusCode).json(config_1.response);
    }
    else {
        config_1.response.status = "Failed";
        config_1.response.statusCode = 400;
        config_1.response.data = { 'transaction': tx, 'transactionValidated': false, 'txHash': null, 'expectedBlock': -1, 'reason': "Invalid Transaction!" };
    }
    ;
}));
// mine blockhash and broadcast to network nodes
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
    config_1.response.status = 'Success';
    config_1.response.statusCode = 200;
    config_1.response.data = data;
    console.log(config_1.response);
    res.status(config_1.response.statusCode).json(config_1.response);
}));
exports.getOwnerVehicles = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Note for Michael
    // leaving request as recipient here to make testing for you easier so that you dont have to 
    // rewrite Postman bodies too much between transactions/queries ** Should be req.body.owner or similar
    const owner = req.body.recipient;
    const vehicles = config_1.kekChain.findOwnerVehicles(owner);
    config_1.response.status = 'Success';
    config_1.response.statusCode = 200;
    config_1.response.data = vehicles;
    console.log(config_1.response);
    res.status(config_1.response.statusCode).json(config_1.response);
}));
exports.newVehicle = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleData = req.body;
    const tx = yield config_1.kekChain.firstRegistration(vehicleData.recipient, vehicleData.year, vehicleData.make, vehicleData.model);
    config_1.kekChain.pendingList.push(tx);
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('sending block to: ', url);
        yield fetch(`${url}/receive/tx`, {
            method: 'POST',
            body: JSON.stringify(tx),
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    config_1.response.status = 'Success';
    config_1.response.statusCode = 200;
    config_1.response.data = tx;
    console.log(config_1.response);
    res.status(config_1.response.statusCode).json(config_1.response);
}));
exports.vehicleTransfer = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleData = req.body;
    const tx = yield config_1.kekChain.vehicleTransfer(vehicleData.sender, vehicleData.recipient, vehicleData.vehicle, vehicleData.year, vehicleData.make, vehicleData.model);
    config_1.kekChain.pendingList.push(tx);
    config_1.kekChain.networkNodes.forEach((url) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('sending block to: ', url);
        yield fetch(`${url}/receive/tx`, {
            method: 'POST',
            body: JSON.stringify(tx),
            headers: { 'Content-Type': 'application/json' },
        });
    }));
    config_1.response.status = 'Success';
    config_1.response.statusCode = 200;
    config_1.response.data = tx;
    console.log(config_1.response);
    res.status(config_1.response.statusCode).json(config_1.response);
}));
//# sourceMappingURL=node-controller.js.map
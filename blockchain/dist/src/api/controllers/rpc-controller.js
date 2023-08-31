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
// Returns "pong"
exports.ping = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = 'pong';
    config_1.response.status = 'Success';
    config_1.response.statusCode = 200;
    config_1.response.data = data;
    res.status(config_1.response.statusCode).json(config_1.response);
}));
// Returns latest block in chain
exports.latestBlock = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = config_1.kekChain.latestBlock();
    config_1.response.status = 'Success';
    config_1.response.statusCode = 201;
    console.log(data);
    config_1.response.data = data;
    res.status(config_1.response.statusCode).json(config_1.response);
}));
// Returns entire blockchain object. (Unreliable method for longer chains) Will need to be paid service or
// limited to a slice of the blockchain due to bandwidth/processing demands. 
exports.getBlockchain = (0, catchErrorAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = config_1.kekChain;
    config_1.response.status = 'Success';
    config_1.response.statusCode = 202;
    config_1.response.data = data;
    res.status(config_1.response.statusCode).json(config_1.response);
}));
//# sourceMappingURL=rpc-controller.js.map
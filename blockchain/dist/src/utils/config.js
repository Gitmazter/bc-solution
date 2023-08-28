"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.nodeAddress = exports.kekChain = exports.defaultPORT = void 0;
const Blockchain_1 = __importDefault(require("../blockchain/Blockchain"));
const uuid_1 = require("uuid");
exports.defaultPORT = process.argv[2];
exports.kekChain = new Blockchain_1.default(); // Possible breakpoint if chain does not follow between files
exports.nodeAddress = (0, uuid_1.v4)().split('-').join('');
exports.response = {
    status: 'Not found',
    statusCode: 404,
    data: null,
    error: null,
};
//# sourceMappingURL=config.js.map
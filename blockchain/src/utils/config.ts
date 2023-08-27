import Blockchain from "../blockchain/Blockchain";
import  {v4}  from "uuid";

export const defaultPORT = process.argv[2];
export const kekChain = new Blockchain() // Possible breakpoint if chain does not follow between files
export const nodeAddress = v4().split('-').join('')
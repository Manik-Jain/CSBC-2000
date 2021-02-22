import {
    writeData,
    readData
} from '../dao/dao.js'

const fileName = 'data/chain.json';

/**
 * Helper class to store the blockchain in the local node
 * 
 * @author - Manik Jain
 */
export default class Helper {

    /**
     * 
     * Append a new block to the local copy of the blockchain
     * 
     * @param {*} block 
     */
    static async addBlock(block) {
        let chain = await readData(fileName);
        if (chain != undefined && Array.isArray(chain)) {
            chain.push(block);
        } else {
            chain = [block];
        }
        return await writeData(fileName, chain);
    }

    /**
     * Returns the JSON representation of the local blockchain
     */
    static async readChain() {
        return await readData(fileName);
    }
}
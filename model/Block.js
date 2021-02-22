/**
 * Block represents a block in the blockchain. It has the
 * following params:
 * @index        - represents its position in the blockchain
 * @transactions - represents the data about transactions
 *                 added to the chain
 * @prevHash     - hash of the previous block
 * @hash         - represents the hash of the previous block
 * @difficulty   - represent how difficult it was to mine the current block
 * @merkleTree   - recursive approach to construct a hash tree, 
 *                 taking into consideration all the transactions in the block
 * 
 * @author - Manik Jain
 */
export default class Block {

    constructor(index, transactions, prevHash, nonce, difficulty, hash, merkleTree) {
        this.index = index;
        this.timeStamp = Math.floor(Date.now() / 1000);
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.merkleRoot = merkleTree.root;
        this.merkleTree = merkleTree;
        this.miner = 'Manik Jain';
        this.fees = this.transactions.reduce((acc, value) => acc+= 0.000000001 * value.fees, 0) * this.transactions.length;
    }

    static getBlock(block) {
        return {
            height : block.index,
            previousHash : block.prevHash,
            hash : block.hash,
            merkleRoot : block.merkleRoot,
            timeStamp : block.timeStamp,
            miner : block.miner,
            transactions : block.transactions,
            nonce : block.nonce,
            difficulty : block.difficulty,
            fees : block.fees
        }
    }
}
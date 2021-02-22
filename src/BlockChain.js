import MerkleMTree from './Merkle.js'
import sha256 from 'js-sha256';
import Transaction from '../model/Transaction.js';
import Block from '../model/Block.js';
import Helper from './Helper.js'

/**
 * Blockchain represents the entire blockchain with the
 * ability to create transactions, mine and validate
 * all blocks.
 * 
 * @author - Manik Jain
 */
export default class Blockchain {

    constructor() {
        return (async() => {
            this.chain = await Helper.readChain();
            this.pendingTransactions = [];
            this.nonce = 0;
            this.height = 0;
            this.difficulty = await this.getDifficulty();
            this.isGenesisMined = false;
            return this;
        })();
    }

    /**
     * Mine the Genesis block for the blockchain
     * This shoud be done just once and thereafter 
     * the copies if the chain should be distributed 
     * and worked upon to mine new blocks
     * 
     */
    async mineGenesisBlock() {
        if (this.chain.length > 1 || this.isGenesisMined === true) {
            console.error('Genesis Block can only be mined once.')
            return;
        }
        await this.addBlock({
            nonce: 0,
            difficulty: 0,
            hash: sha256('0'),
            merkleRoot: new MerkleMTree().createMerkleTree([])
        });
        this.isGenesisMined = true;
        console.log('Genesis Block created..!')
    }

    /**
     * method that automatically returns the number 
     * of leading 0's depending upon the length 
     * of blockchain
     * 
     * For example : 
     * ------------------------
     * Length     |  Difficulty
     * ------------------------
     * 0-9        |     1       
     * 10-99      |     2
     * 100-999    |     3    
     */
    async getDifficulty() {
        let chain = await Helper.readChain();
        return chain.length === 0 ? 1 : chain.length.toString().length;
    }

    /**
     * Creates a transaction on the blockchain
     */
    createTransaction(amount, addressPair) {
        this.pendingTransactions.push(
            new Transaction(amount, addressPair));
    }

    /**
     * 
     * Retuns a string of leading 0's that 
     * define the protocol requirement for a 
     * successful block mining
     * 
     * For example,
     * ------------------------
     * Difficulty |  Param
     * ------------------------
     * 1          |     0      
     * 2          |     00
     * 3          |     000  
     */
    difficultyParam() {
        return new Array(this.difficulty).fill(0).reduce((acc) => acc += '0', '');
    }

    /**
     * Find nonce that satisfies our proof of work.
     * 
     * The method uses two local variables to meet the 
     * difficulty defined by the protocol 
     *  - Nonce : a decimal number which is incremented 
     *            by 1 each time the method does not 
     *            meet the difficulty
     *  - difficulty : the leading  number of 0's in the hash
     * 
     * @return : an object contatining the following attrubutes
     *  - Nonce :      hexadecimal representatiion of nonce number
     *  - Difficulty : Nonce used to achieve the hash 
     *                 with desired number of leading  0's
     *  - hash :       block hash that satisfies with desired 
     *                 number of leading  0's 
     */
    async proofOfWork() {
        this.nonce = 0;
        let prevHash = await this.getPreviousHash();
        let merkleTree = new MerkleMTree().createMerkleTree(this.pendingTransactions);
        let merkleRoot = merkleTree.root;

        let hash = sha256(prevHash + merkleRoot + this.nonce);
        let difficultyParam = this.difficultyParam();

        while (hash.toString().substring(0, this.difficulty) != difficultyParam) {
            ++this.nonce;
            hash = sha256(prevHash + merkleRoot + this.nonce);
        }

        this.timestamp = Math.floor(Date.now() / 1000);
        console.log(`Block mined with nonce : ${this.nonce} and hash : ${hash}`);
        return {
            nonce: (this.nonce >>> 0).toString(16).toUpperCase(),
            difficulty: this.nonce,
            hash: hash,
            merkleRoot: merkleTree
        }
    }

    /**
     * Mine a block and add it to the chain. 
     * 
     * Operations performed:
     * 
     * 1. Check if the current blockchain is valid or not
     * 2. generate the Proof-of-work to provide concensus
     * 3. add the newly mined block to the blockchain
     */
    async mine() {
        if (!await this.chainIsValid()) {
            return;
        }
        let pow = await this.proofOfWork();
        let block = await this.addBlock(pow);
        console.log(`Block mined, and added to the chain at index : ${block.index}`)
    }

    /**
     * Gets the hash of a block.
     */
    getHash(prevHash, merkleRoot, nonce) {
        if (prevHash === '0' && merkleRoot === sha256(sha256('0'))) {
            return sha256('0')
        } else {
            return sha256(prevHash + merkleRoot + nonce);
        }
    }

    /**
     * Check if the chain is valid by going through 
     * all blocks and comparing their stored
     * hash with the computed hash. 
     * 
     * Operation performed : 
     * 
     * 1. Genesis block verification
     * 2. merkle root value for current block can be 
     *    obtained by the given set of transactions
     * 3. current block hash can be obtained with the 
     *    provided merkle root, nonce, and difficulty
     * 4. hash of previous block is equal to current 
     *    block's previousHash value
     */
    async chainIsValid() {
        let chain = await Helper.readChain();
        for (let i = 0; i < chain.length; i++) {
            //verify Genesis block hash is valid
            if (i == 0 && chain[i].hash !== this.getHash('0', new MerkleMTree().createMerkleTree([]).root, '0')) {
                console.log('Genesis block hash is wrong!!')
                return false;
            } else if (i > 0) {
                //verify if merkle root value for current block can be obtained by the given set of transactions
                let blockTxnHashes = [];
                chain[i].transactions.forEach(entry => blockTxnHashes.push(entry.txnHash));
                if (chain[i].merkleRoot !== new MerkleMTree().createMerkleTree(blockTxnHashes, false).root) {
                    console.log(`Merkle root value at block ${i+1} does not verify..!!`)
                    return false;
                }

                //verify current block hash can be obtained with the provided merkle root, nonce, and difficulty
                 if (chain[i].hash !== this.getHash(chain[i].prevHash, chain[i].merkleRoot, chain[i].difficulty)) {
                    console.log(`Block hash for block ${i+1} does not match with previous block..!!`);
                    return false;
                }

                //verify that hash of previous block is equal to current block's previousHash value
                if (chain[i].prevHash !== chain[i - 1].hash) {
                    console.log(`Block Previous hash value mismatch at block index [${i} and ${i+1}]..!`)
                    return false;
                }
            }
        }
        console.log('Blockchain is valid. Further blocks can be added..!')
        return true;
    }

    async getPreviousHash() {
        let chain = await Helper.readChain();
        return chain.length !== 0 ? chain[chain.length - 1].hash : '0';
    }

    /**
     * Add a block to the blockchain. 
     * This method performs the following functions :
     * 
     * 1. Check if the blockchain is valid for hash 
     *    and previous hash, otherwise return
     * 2. Push new block to the chain
     * 3. Update blockchain height 
     * 4. Reset pending transactions so as to cater new blocks
     * 5. Store the blockchain in the local node 
     *    that is ready to be published in the network
     */
    async addBlock(pow) {
        let index = this.chain.length;
        this.height = index;
        let prevHash = await this.getPreviousHash();
        let block = new Block(index + 1,
            this.pendingTransactions,
            prevHash,
            pow.nonce,
            pow.difficulty,
            pow.hash,
            pow.merkleRoot);

        // reset pending txs
        this.pendingTransactions = [];
        this.chain.push(block);
        await Helper.addBlock(block);
        return block;
    }

    /**
     * returns the average block hash rate for the blockchain
     */
    async getAverageHashRate() {
        let totalTime = 0;
        await Helper.readChain().forEach(entry => totalTime += entry.timeStamp);
        return (((totalTime / this.chain.length) / 10000) % 60).toFixed(0) + 'ms';
    }

    /**
     * 
     * Returns the blockchain holding all the current blocks
     * 
     */
    async getBlockchain() {
        return await Helper.readChain().map(block => Block.getBlock(block));
    }

    /**
     * verify a transaction is valid part of the given blockchain
     * Also, check if the given set of transactions form up 
     * the merkle root as stored in the blockchain
     * 
     * @param {} blockIndex - the block index in the chain
     * @param {*} transactionHash - the input hash to validate
     */
    async verifyTransactionHash(blockIndex, transactionHash) {
        let chain = await Helper.readChain();
        if (chain.length < blockIndex) {
            console.error(`Input blockIndex : ${blockIndex} does not fit in the blockchain.`)
            return;
        }
        let block = chain[blockIndex - 1];
        return new MerkleMTree().verify(transactionHash, block.merkleTree.leaves['1'], block.merkleRoot);
    }
}
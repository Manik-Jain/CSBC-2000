import {MerkleTree} from 'merkletreejs';
import sha256 from 'js-sha256';
import Transaction from '../model/Transaction.js';
import Block from '../model/Block.js';

/**
 * Blockchain represents the entire blockchain with the
 * ability to create transactions, mine and validate
 * all blocks.
 */
 export default class Blockchain {

    constructor(isBlockRequired = false) {
        this.chain = [];
        this.pendingTransactions = [];
        this.nonce = 0;
        this.height = 0;
        this.difficulty = this.getDifficulty();
        if(isBlockRequired)  {
            this.addBlock({nonce : 0, difficulty : 0, hash : sha256('0')});
        }
    }

    /**
     * method that automatically returns the number of leading 0's depending upon the length of blockchain
     * 
     * For example : 
     * ------------------------
     * Length     |  Difficulty
     * ------------------------
     * 0-9        |     1       
     * 10-99      |     2
     * 100-999    |     3    
     */
    getDifficulty() {
        return this.chain.length === 0 ? 1 : this.chain.length.toString().length;
    }

    /**
     * Creates a transaction on the blockchain
     */
    createTransaction(amount, sender, recipient) {
        this.pendingTransactions.push(new Transaction(amount, sender, recipient));
    }

    /**
     * 
     * Retuns a string of leading 0's that define the protocol requirement for a 
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
        return new Array(this.difficulty).fill(0).reduce((acc) => acc += '0', '')
    }

    /**
     * Find nonce that satisfies our proof of work.
     * 
     * The method uses two local variables to meet the difficulty defined by the protocol 
     *  - Nonce : a decimal number which is incremented by 1 each time the method does not meet the difficulty
     *  - difficulty : the leading  number of 0's in the hash
     * 
     * @return : an object contatining the following attrubutes
     *  - Nonce : hexadecimal representatiion of nonce number
     *  - Difficulty : Nonce used to achieve the hash with desired number of leading  0's
     *  - hash : block hash that satisfies with desired number of leading  0's 
     */
    proofOfWork() {
        this.nonce = 0;
        let prevHash = this.getPreviousHash();
        let txnHash = sha256(this.pendingTransactions.reduce((acc, value) => acc += sha256(acc + value), ''));
        let hash = sha256(prevHash + txnHash +this.nonce)
        let difficultyParam = this.difficultyParam();

        while(hash.toString().substring(0, this.difficulty) != difficultyParam) {
            ++this.nonce;
            hash = sha256(prevHash + txnHash + this.nonce);
        }

        this.timestamp = Math.floor(Date.now() / 1000);
        console.log(`Block mined with nonce : ${this.nonce} and hash : ${hash}`)
        return {
            nonce : (this.nonce>>>0).toString(16).toUpperCase(),
            difficulty : this.nonce, 
            hash : hash
        }
    }

    /**
     * Mine a block and add it to the chain.
     */
    mine() {
        let pow = this.proofOfWork();
        let block = this.addBlock(pow);
        console.log(`Block mined and added to the chain at index : ${block.index}`)
    }

    /**
     * Gets the hash of a block.
     */
    getHash(prevHash, txs, nonce) {
        if(prevHash === '0' && txs.length === 0 && nonce === '0') {
            return sha256('0')
        } else {
            let txnHash = sha256(txs.reduce((acc, value) => acc += sha256(acc + value), ''));
            return sha256(prevHash + txnHash + nonce);
        }
    }

    /**
     * Check if the chain is valid by going through all blocks and comparing their stored
     * hash with the computed hash.
     */
    chainIsValid(){
        for(var i=0;i<this.chain.length;i++){
            let tx_id_list = [];
            
            this.chain[i].transactions.forEach((tx) => tx_id_list.push(tx.tx_id));

            if(i == 0 && this.chain[i].hash !== this.getHash('0',[],'0')){
                console.log('Genesis block hash is wrong!!')
                return false;
            }
            if(i > 0 && this.chain[i].hash !== this.getHash(this.chain[i-1].hash, this.chain[i].transactions, this.chain[i].difficulty)){
                console.log('Transaction hash does not match..!!')
                return false;
            }
            if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash){
                console.log('Block Hash is wrong..!')
                return false;
            }
        }
        console.log('Blockchain is valid. Further blocks can be added..!')
        return true;
    }

    getPreviousHash() {
        return this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : '0';
    }

    /**
     * Add a block to the blockchain. This method performs the following functions :
     * 
     * 1. Check if the blockchain is valid for hash and previous hash, otherwise return
     * 2. Push new block to the chain
     * 3. Update blockchain height 
     * 4. Reset pending transactions so as to cater new blocks
     */
    addBlock(pow) {
        if(!this.chainIsValid()) {
            return;
        }
        let index = this.chain.length;
        this.height = index;
        let prevHash = this.getPreviousHash();
        let merkleRoot = this.getMerkleRoot(pow.hash.toString());
        let block = new Block(index, this.pendingTransactions, prevHash, pow.nonce, pow.difficulty, pow.hash, merkleRoot);

        // reset pending txs
        this.pendingTransactions = [];
        this.chain.push(block);
        return block;
    }

    getMerkleRoot(leaf) {
        return new MerkleTree([leaf].map(x => sha256(x)), sha256).getHexRoot();
    }

    getAverageHashRate() {
        let totalTime = 0;
        this.chain.forEach(entry => totalTime += entry.timestamp)
        return (((totalTime/this.chain.length) / 10000)%60).toFixed(0) + 'ms';
    }
}
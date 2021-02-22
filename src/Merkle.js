import sha256 from 'js-sha256';

/**
 * Merkle Tree Respresentation for the Blockchain
 * 
 * @author - Manik Jain
 */
export default class MerkleMTree {

    constructor() {
        this.layers = 0;
        this.leaves = [];
        this.leaveHash = [];
        this.root = '';
        this.subTree = {};
    }

    /**
     * create and return a merkle tree object with 
     * recursively hasing the transactions
     * 
     * @param {} transactions - input list of 
     *                          transaction/leaves 
     *                          that will form child of tree
     * @param {*} isHashRequired - optional param, 
     *                          by defualt true -> to signify 
     *                          the hashing is required
     * 
     * @returns - a merkle tree with its root
     */
    createMerkleTree(transactions, isHashRequired = true) {
        if (!Array.isArray(transactions) || transactions.length < 1) {
            return this.merkleTree(sha256(sha256('0')))
        }
        ++this.layers;
        let combined = [];
        this.subTree[this.layers] = [];

        for (let i = 0; i < transactions.length; i += 2) {
            let left = transactions[i];
            let right = i + 1 === transactions.length ? left : transactions[i + 1];

            if (isHashRequired) {

                left = typeof left === 'object' ? sha256(JSON.stringify(left)) : sha256(left);
                right = typeof right === 'object' ? sha256(JSON.stringify(right)) : sha256(right);
            }

            this.leaves.push([...new Set([left, right])])
            this.subTree[this.layers].push([...new Set([left, right])]);
            combined.push(sha256(left.concat(right)))
            this.leaveHash.push(sha256(left.concat(right)))
        }

        return combined.length === 1 ? this.root = this.merkleTree(combined[0]) : this.createMerkleTree(combined);
    }

    /**
     * returns the root for the Merkle tree
     */
    getRoot() {
        return this.root;
    }

    /**
     * Given an input array of leaves, this method 
     * will buid and return the Merkle tree 
     * 
     * @param {} leaves 
     * 
     * @returns - Merkle tree object for the given array of leaves
     */
    createTreeFrom(leaves) {
        if (!Array.isArray(leaves) || leaves.length < 0) {
            return
        }
        this.init();
        return this.createMerkleTree(leaves, false)
    }

    init() {
        this.layers = 0;
        this.leaves = [];
    }

    /**
     * verifies that a given transaction forms 
     * the Merkle tree with the given root
     * 
     * @param {} transaction - the input hashed 
     *                          value of the transaction 
     * @param {*} root       - the input hashed 
     *                          value of the root node
     * 
     * @returns - true if Merkle root with the given root hash can be formed, false otherwise
     */
    verify(transaction, leaves, root) {
        if(transaction === undefined || transaction.length === 0 || root === undefined || root.length === 0)  {
            console.log('input transaction is invalid')
            return;
        }

        let txnList = leaves.reduce((acc, value) => acc.concat(value),[]);
        return txnList.includes(transaction) && this.createTreeFrom(txnList).root === root ? true : false;
    }

    /**
     * Returns a string represntation of the Merkle Tree
     * 
     */
    getTree() {
        return '[Merkle Tree] '.concat(this.merkleTree(this.root));
    }

    merkleTree(rootHash) {
        return {
            root : rootHash,
            layers : this.layers,
            leaves : this.subTree
        }
    }
}
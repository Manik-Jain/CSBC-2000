import BlockChain from './BlockChain.js';
import sha256 from 'js-sha256';
import Wallet from '../model/Wallet.js';

export default class Mine {

    static async mine() {
        console.log('Blockchain Mining...!')
        const blockChain = await new BlockChain();
        const wallet = new Wallet();

        //generate a Genesis block if one doesn't exist
        await blockChain.mineGenesisBlock();

        //creating transactions on blockchain
        blockChain.createTransaction(1, wallet.getAddressPair());
        blockChain.createTransaction(2, wallet.getAddressPair());

        //Mine block
        await blockChain.mine();
        
        //verify using Merkle Tree, if a transaction is part of a block
        console.log('Verifying if a given hash : [139f3d0268b27eba357b7e258cba4e653132ff76264deb8f7ace8fcff5df0f3b] is part of block 2.')
        let isValidTransaction = await blockChain.verifyTransactionHash(2, '139f3d0268b27eba357b7e258cba4e653132ff76264deb8f7ace8fcff5df0f3b');
        console.log(isValidTransaction);
    }
}
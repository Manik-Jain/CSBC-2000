import BlockChain from './BlockChain.js';
import sha256 from 'js-sha256';
import Wallet from '../model/Wallet.js';

export default class Mine {

    static async mine() {
        console.log('Blockchain Mining...!')
        const blockChain = await new BlockChain();
        const wallet = new Wallet();

        // await blockChain.mineGenesisBlock();
        
        // blockChain.createTransaction(210, wallet.getAddressPair());
        // blockChain.createTransaction(220, wallet.getAddressPair());
        // blockChain.createTransaction(230, wallet.getAddressPair());
        // blockChain.createTransaction(240, wallet.getAddressPair());
        // blockChain.createTransaction(250, wallet.getAddressPair());

        // await blockChain.mine();

        // blockChain.createTransaction(211, wallet.getAddressPair());
        // blockChain.createTransaction(221, wallet.getAddressPair());
        // blockChain.createTransaction(241, wallet.getAddressPair());
        // blockChain.createTransaction(251, wallet.getAddressPair());
        
        // await blockChain.mine();

        // blockChain.createTransaction(2211, wallet.getAddressPair());
        // blockChain.createTransaction(2221, wallet.getAddressPair());
        // blockChain.createTransaction(2321, wallet.getAddressPair());
        // blockChain.createTransaction(2421, wallet.getAddressPair());
        // blockChain.createTransaction(2521, wallet.getAddressPair());
        
        // await blockChain.mine();

        // blockChain.createTransaction(1, wallet.getAddressPair());
        // await blockChain.mine();

        // blockChain.createTransaction(2, wallet.getAddressPair());
        // await blockChain.mine();

        // blockChain.createTransaction(3, wallet.getAddressPair());
        // await blockChain.mine();

        // blockChain.createTransaction(4, wallet.getAddressPair());
        // await blockChain.mine();

        blockChain.createTransaction(5, wallet.getAddressPair());
        await blockChain.mine();
        
        // let isValidTransaction = await blockChain.verifyTransactionHash(9, '5d2ee5bdcb0bb1ed4bb3c5cb772d17dcc2d498608a29439aa79807ac75f630b2');
        // console.log(isValidTransaction);
    
    }
}
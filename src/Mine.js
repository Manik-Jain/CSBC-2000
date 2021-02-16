import BlockChain from './BlockChain.js';

export default class Mine {

    static mine() {
        console.log('Blockchain Mining...!')

        const blockChain = new BlockChain(true);

        blockChain.createTransaction(21, 'manik', 'jain')
        blockChain.createTransaction(22, 'manik', 'jain')
        blockChain.createTransaction(23, 'manik', 'jain')
        blockChain.createTransaction(24, 'manik', 'jain')
        blockChain.createTransaction(25, 'manik', 'jain')

        blockChain.mine();

        console.log(blockChain.chain);
        console.log(blockChain.getAverageHashRate());
    }
}
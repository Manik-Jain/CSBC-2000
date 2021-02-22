import sha256 from 'js-sha256';
import uuid from 'uuid';

export default class MyWallet {

    constructor() {
        this.senderAddress = '';
        this.recipientAddress = '';
    }

    generateAddress() {
        return '0x'.concat(sha256(sha256(uuid())).substring(0,40));  
    }

    getAddressPair() {
        return {
            sender : this.generateAddress(),
            recipient : this.generateAddress()
        }
    }
}

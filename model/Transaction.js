import uuid from 'uuid';
import sha256 from 'js-sha256';

/**
 * A blockchain transaction. Has an amount, sender and a
 * recipient (not UTXO).
 * 
 * @author - Manik Jain
 */
export default class Transaction {

    constructor(amount, address, fees = 20000) {
        this.amount = amount;
        this.sender = address.sender;
        this.recipient = address.recipient;
        this.tx_id = uuid();
        this.fees = fees <= 20000 ? 20000 : fees;
        this.txnHash = '';
    }
}
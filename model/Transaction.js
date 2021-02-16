import uuid from 'uuid';

/**
 * A blockchain transaction. Has an amount, sender and a
 * recipient (not UTXO).
 */
export default class Transaction {

    constructor(amount, sender, recipient) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.tx_id = uuid().split('-').join();
    }
}
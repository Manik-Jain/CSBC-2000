# CSBC-2000 - Blockchain with Merkle Tree 

This project aims at exposing a Merkle Tree inspired Blockchain.

#Features
1. Genesis Block Creation
2. Creating transaction on Blockchain
3. Dynamic block hash difficulty parameter
4. Proof-of-Work Consensus driven mining block to the blockchain by creating a Merkle Tree, and finding a Nonce as to how difficult was it to achieve the desired block hash
5. Verification, using Merkle Tree if a transaction was part of a block or not
6. Average Hash rate of the blockchain
7. Maintaining a Merkle Tree for each block's transactions
8. Maintinaing a local copy of blokchain that can be distributed to other nodes in the peer-to-peer network
9. Wallet based key storage

#Usage
In order to run the code, please git clone the repository, and in your terminal type the following command

npm run start

This will install all the necessary packages to your machine, and add a (dummy) freshly mined block to the chain.
In order to try all the features provided, please navigate to src/Mine.js, and make the necessary changes.

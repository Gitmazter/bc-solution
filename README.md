<h1>PLEASE READ IN TEXT EDITOR</h1>


This blockchain handles Vehicle Registrations though a Rest-API connected to a Proop Of Work Blockchain. 

The chain is currently decentralized, permissionless, unsigned and local only, it also only checks whether a vehicle has already been registered and is non-persistent between restarts. 

The chain uses transaction and chain validation to maintain accuracy of information. 

To use the blockchain open 2-4 nodes using the commands:
 - npm run start0 //Uses port 8080
 - npm run start2 //Uses port 8082
 - npm run start3 //Uses port 8083
 - npm run start4 //Uses port 8084

NOTE: Skipped 8081 as it interfered with another REST api I have running
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
USAGE: 
Before sending transactions, ensure nodes are connected by calling a known node with a POST request to:

 - {NODEURL}/nodes/register-broadcast-node
 containing a body with this information:
 {
  "nodeUrl":'http://localhost:YOURPORT'
 }

This will register the node at the target RPC which will broadcast it to other nodes in the network and return all network URL to the node that sent the request.
!!!!  Do this as many times as necessary to connect all nodes !!!!!
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________

If a node has fallen behind or is started later, please use the above command followed by a GET request to
 - {NODEURL}/nodes/consensus

This will fetch all chains update the local one to the longest VALID chain. If the longest one is INVALID this will break. // NOTE TO SELF ::: ADD TODO

After this your node will be part of the network and ready to submit transactions and mine blocks.

_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________

Routes:  + Example JSON bodies
_____________________________________________________________________________________________________

rpc/
  ping (GET) 
  // returns "pong" if the target node is active

  latest-block (GET)
  // returns latest block

  get-blockchain (GET)
  // returns entire blockchain object
_____________________________________________________________________________________________________

node/
  add-transaction (POST)
  // Unused

  mine-block (GET)
  // Mines the next block with current pending transactions

  new-vehicle (POST)
  // Adds a new vehicle to the pool from 00 sender, license plate # will be auto-generated
  example JSON:
  {
    "recipient" : "Gucci Mayne",
    "year": 2003,
    "make": "Fiat",
    "model": "500"
  }

  transfer-vehicle (POST)
  // Transfers Vehicles Between Owners, sender has to be latest recipient.
  // note: license plate can be found with owner search
  example JSON:
  {
    "sender" : "Gucci Mayne",
    "recipient" : "John Wick",
    "vehicle": "EJZ-215" 
    "year": 2003,
    "make": "Fiat",
    "model": "500"
  }

  owner-search (POST)
  // Returns all vehicles held by owner
  example JSON:
  {
    "recipient":"Gucci Mayne"
  }

  Vehicle Search??? 
_____________________________________________________________________________________________________

nodes/ 
  register-broadcast-node (POST)
  // registers node with the network
  example JSON call to known node:
  POST TO: http://localhost:8080/register-broadcast-node FROM: http://localhost:8082
  {
    "nodeUrl":"http://localhost:8082"
  }
  
  register-node (POST)
  // Called automatically during register-broadcast-node to register single node 
  // with rest of network.
  example JSON: 
  {
    "nodeUrl": "http://localhost:8082"
  }

  register-nodes (POST)
  // Registers an array of nodes, called automatically by registrar to registree during
  // register-broadcast-node to update the node with all URLS connected to the network
  Example JSON
  {
    "nodes": [
      "http://localhost:8080",
      "http://localhost:8082",
      "http://localhost:8083"
    ]
  }
  consensus (GET)
  // The node will fetch all chains from registered nodes and compare with the local chain to
     find the longest valid chain and if a longer VALID chain is found, replace its own chain

  list-nodes (GET)
  // Returns all registered nodes as JSON
_____________________________________________________________________________________________________

receive/
  block (POST)
  // Node expects a block type object to arrive and will validate it, if valid with local chain,
     the node will push it to the end of the chain

  transaction (POST)
  // The block will expect a VehicleTransaction object and validate it, if valid the object will be pushed to pendingList
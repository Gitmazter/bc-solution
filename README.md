<h1>PLEASE READ IN TEXT EDITOR</h1>


TESTING JSON for POSTMAN:::<br>
{ <br>
&nbsp;&nbsp;&nbsp;&nbsp;    "nodeUrl":"http://localhost:8082",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "sender" : "alice",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "recipient" : "bob",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    //"sender" : "bob",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    //"recipient" : "alice",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "vehicle": "AGL-265", /* (REPLACE WHEN REGISTERING NEW VEHICLE) */<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "year": 2003,<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "make": "Fiat",<br>
&nbsp;&nbsp;&nbsp;&nbsp;    "model": "500"<br>
}<br>
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________

<h2> Description </h2>
This blockchain handles Vehicle Registrations though a Rest-API connected to a Proop Of Work Blockchain. 

The chain is currently decentralized, permissionless, unsigned and local only, it also only checks whether a vehicle has already been registered and is non-persistent between restarts. 

The chain uses transaction and chain validation to maintain accuracy of information. 

To use the blockchain open 2-4 nodes using the commands:
 - npm run start0 //Uses port 8080
 - npm run start2 //Uses port 8082
 - npm run start3 //Uses port 8083
 - npm run start4 //Uses port 8084

#NOTE: Skipped 8081 as it interfered with another REST api I have running
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________

<h2>Usage Notes</h2>
Before sending transactions, ensure nodes are connected by calling a known node with a POST request to:

 - {NODEURL}/nodes/register-broadcast-node
 containing a body with this information:

 {
 &nbsp;&nbsp;&nbsp;&nbsp; "nodeUrl":'http://localhost:YOURPORT'
 }

This will register the node at the target RPC which will broadcast it to other nodes in the network and return all network URL to the node that sent the request.
!!!!  Do this as many times as necessary to connect all nodes !!!!!
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________

If a node has fallen behind or is started later, please use the above command followed by a GET request to
 - {NODEURL}/nodes/consensus

This will fetch all chains update the local one to the longest VALID chain.

After this your node will be part of the network and ready to submit transactions and mine blocks.

_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
_____________________________________________________________________________________________________
<h2>Routes:  + Example JSON bodies</h2>
_____________________________________________________________________________________________________

## rpc/ <br><br>
  ### ping (GET)  <br>
  // returns "pong" if the target node is active <br>
  <br>

  ### latest-block (GET) <br>
  // returns latest block <br>
  <br>

  ### get-blockchain (GET) <br>
  // returns entire blockchain object <br><br>
_____________________________________________________________________________________________________

## node/ <br><br>
  ### add-transaction (POST)
  // Unused

  ### mine-block (GET)
  // Mines the next block with current pending transactions

  ### new-vehicle (POST)
  // Adds a new vehicle to the pool from 00 sender, license plate # will be auto-generated
  example JSON:<br>
  {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "recipient" : "Gucci Mayne",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "year": 2003,<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "make": "Fiat",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "model": "500"<br>
  }<br>

  ### transfer-vehicle (POST)
  // Transfers Vehicles Between Owners, sender has to be latest recipient.
  // note: license plate can be found with owner search
  example JSON:<br>
  {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "sender" : "Gucci Mayne",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "recipient" : "John Wick",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "vehicle": "EJZ-215" <br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "year": 2003,<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "make": "Fiat",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "model": "500"<br>
  }<br>

  ### owner-search (POST)
  // Returns all vehicles held by owner
  example JSON: <br>
  {<br>
    "recipient":"Gucci Mayne"<br>
  }<br>
_____________________________________________________________________________________________________

## nodes/ <br><br>
  ### register-broadcast-node (POST)
  // registers node with the network<br>
  example JSON call to known node:<br>
  POST TO: http://localhost:8080/register-broadcast-node FROM: http://localhost:8082<br>
  {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "nodeUrl":"http://localhost:8082"<br>
  }<br>
  
  ### register-node (POST)
  // Called automatically during register-broadcast-node to register single node <br>
  // with rest of network.<br>
  example JSON: <br>
  {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "nodeUrl": "http://localhost:8082"<br>
  }<br>

  ### register-nodes (POST)
  // Registers an array of nodes, called automatically by registrar to registree during<br>
  // register-broadcast-node to update the node with all URLS connected to the network<br>
  Example JSON<br>
  {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;  "nodes": [<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    "http://localhost:8080",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    "http://localhost:8082",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    "http://localhost:8083"<br>
  &nbsp;&nbsp;&nbsp;&nbsp; ]<br>
  }<br>
  ### consensus (GET)
  // The node will fetch all chains from registered nodes and compare with the local chain to<br>
     find the longest valid chain and if a longer VALID chain is found, replace its own chain<br>

  list-nodes (GET)<br>
  // Returns all registered nodes as JSON<br>
_____________________________________________________________________________________________________

## receive/ <br><br>
  ### block (POST)
  // Node expects a block type object to arrive and will validate it, if valid with local chain,<br>
     the node will push it to the end of the chain<br>

  ### transaction (POST)
  // The block will expect a VehicleTransaction object and validate it, if valid the object will be pushed to pendingList<br>
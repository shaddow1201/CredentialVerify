# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round of of probably 3 before completed.

# Development Decisions

1. My first concern was to become familiar with solidity coding and coding to a blockchain.
2. Due to the fact that i work at an educational institution, i coded something of which i could see future use.
3. I wanted my first app to use the environment, spending ether to pay for gas, but not transfering it around. 
    (safer.  did i mention that i'm a dba by trade, so paranoia... is part of the job.)

# Design Pattern Decisions

1. This app only creates data, and has no ether value transfer, other than gas.  This alone makes is less interesting to attack
because you can only spend.

2. The app is designed around the idea that you only act on your data (msg.sender), and can't act on anothers data.  
This makes most attacks irrelevant, because you can't change anothers data, just your own.  solidity is harder to test
modifiers in, so modifiers are set for version 2, where testing will be moved to functional testing in Javascript.

3. OpenZeppelins-solidity Ownable was implimented to allow ownership transfer pattern. If i leave my current employement the objects may
need transfered to a new owned address.
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol

4. OpenZeppelins-solidity lifecycle contract: Pausable.sol was implimented as an emergency stop pattern.
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol

5. SafeMath32 library - copied from cryptozombies details from when i went through the demo.
http://cryptozombies.io

6. Version 2 will include modifiers that will exploit the isCredentialOrg and only limit access to 
CredentialFactory, and ProcessApplicants, and WriteCredential and Javascript functional tesing will have to be implimented.

7. Creating and Assigning non-transferable tokens are being looked at for future implimentation in WriteCredential.
# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round one of probably 3 before completed.

# Development Decisions

1. My first concern was to become familiar with solidity coding and coding to a blockchain.
2. I work at an educational institution, so I coded something of which I could see future use.
3. I wanted my first app to use the environment, spending ether to pay for gas, but not transfering it around. 
    (safer.  did i mention that i'm a dba by day, so paranoia... is part of the job)

# Design Pattern Decisions

1. This app only creates data, and has no ether value transfer, other than gas.  This alone makes is less interesting to attack because you can only spend, and only act on your own data (there are a few functions that will allow the owner to act on behalf of a Credentialling Org)

2. The app is designed around the idea that you only act on your data (msg.sender), and can't act on anothers data.  
This makes most attacks irrelevant, because you can't change anothers data, just your own.  solidity is harder to test
modifiers in, so modifiers other than "onlyOwner" are set for version 2, where testing will be moved to functional testing in Javascript.  

3. OpenZeppelins-solidity Ownable was implimented to allow ownership transfer pattern. If i leave my current employement the objects may need transfered to a new owned address.  
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol

4. OpenZeppelins-solidity lifecycle contract: Pausable.sol was implimented as an emergency stop pattern.  
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol  

5. SafeMath32 library - copied from cryptozombies details from when i went through the demo.  
http://cryptozombies.io  

6. Unit Testing was chosen over Functional Testing, due to primary goal of learning the basic environment.  Version 2 will include functional testing, and further use of modifiers that will exploit the isCredentialOrg and and further limit access to CredentialFactory, and ProcessApplicants, and WriteCredential.

7. Creating and Assigning non-transferable tokens is being looked at for future implimentation in WriteCredential, but were left out of this implimentation due to being beyond what i was attempting to accomplish in this project.
# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round one of probably 3 before completed.

# Development Decisions

1. My first concern was to become familiar with solidity coding and coding to a blockchain.
2. I work at an educational institution, so I coded something of which I could see future use.
3. I wanted my first app to use the environment, spending ether to pay for gas, but not transfering it around. 
    (safer.  did i mention that i'm a dba by day, so paranoia... is part of the job)

# Design Pattern Decisions

1. This app only creates data, and has no ether value transfer, other than gas.  This alone makes is less interesting to attack because you can only spend, and only act on your own data (there are a few functions that will allow the owner to act on behalf of a Credentialling Org)

2. OpenZeppelins-solidity Ownable was implimented to allow ownership transfer pattern.  There could very well be a need to transfer ownership.
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol

3. OpenZeppelins-solidity lifecycle contract: Pausable.sol was implimented as an emergency stop pattern.  
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol  

4. SafeMath32 library - copied from cryptozombies details from when i went through the demo.  This app uses uint32 in most cases, and as such this library made sense.
http://cryptozombies.io  

5. Unit Testing was chosen over Functional Testing, due to primary goal of learning the basic environment.  Version 2 will include functional testing, and further use of modifiers that will exploit the isCredentialOrg and and further limit access to CredentialFactory, and ProcessApplicants, and WriteCredential.

6. Creating and Assigning non-transferable tokens is being looked at for future implimentation in WriteCredential, but were left out of this implimentation due to being beyond what i was attempting to accomplish in this project.

7. Mortal - Not Used.  No Ether was involved so a mortal contract wasn't necessary. 

8. Admin - Not used access isn't really a thing as Credential Orgs can only act on their own data.

9. Autodepreciation - not used, not really relevant.

10. State Machine - isn't really applicable, as the segmentation of data doesn't really have 'stages'.

11. Speed Bump was considered, to limit Credential creation, but was deemed uncessary as credential orgs only act on their own data.
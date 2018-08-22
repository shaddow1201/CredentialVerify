# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round of of probably 3 before completed.

## What it does
It satisfies the following:
A. There are Orgs that provide various credentials
B. Allows these orgs to create their own credentials or have the owner do it for them.
C. Retrieves applicants that have applied for credentials for that credentialling org.

It is mainly a proof of concept, that doesn't use ether except for gas, and focuses on 

1. CredentialOrgFactory.sol - allows the creation of CredentialOrgs.
2. CredentialFactory.sol - allows creation of credentials.
3. ApplicantFactory.sol - allows Applicants to apply to CredentialOrgs for Awarded Credentials
4. ***ProcessApplicants.sol - allows Gathering of info from CredentialOrgFactory, CredentialFactory, and Applicant Factory. 
    This has been coded and hand tested, but will need advanced functional testing in Javascript. I am considering a different route on this, and Write Credentials may be all that is needed.
5. ***WriteCredential.sol - allows credentials to be written and Applicant updated.   
    Considering many ideas such as tolkens that can be assigned but not transfered, once assigned.  Maybe a signed PDF or another type of document is being considered.

*** future implimentation


## Getting Started

These instructions should allow a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Truffle install - https://github.com/trufflesuite/truffle

Truffle should be installed properly on your machine.   See the above link for how to do this.

2. ganache-cli install - https://github.com/trufflesuite/ganache-cli

Ganache-cli should be installed properly on your machine.  See the above link for how to do this.  The GUI Ganache can also be used.

3. project files (this git collection) in a local directory.  (if you are reading this you should have access.)

Unzip/Clone the Repository to a local directory

4. MetaMask install - https://metamask.io/

Install MetaMask.  See above link for how to do this.

### Installing

1. Copy files to CredentialVerify Directory
2. run ganache-cli with following mnemonic "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"

```
ganache-cli -port 8545 -m "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"
```

3. Set Up MetaMask for project -
    import with seed phrase "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"
    1. change the network to Private Network, set port to: 8545
    2. This will set account[0] for you. (original credentialOrg added to contract)
    3. copy the secret key for account[1] from the ganache-cli window, and add into MetaMask, (will be added in testing)
    4. copy the secret key for account[2] from the ganache-cli window, and add into MetaMask (will be used to show applicant variation)

4. Compile truffle
Compile the project in standard manner from the directory where the files are located.

```
truffle compile
```

5. Migrate
Migrate the project to the blockchain.
```
truffle migrate
```

6. Tests
A series of solidity tests for the contract files, testing basic contract functionality.

```
truffle test
```

5. Run Development Web Server for project.
Run the following command in the directory where you compiled the package from.

```
npm run start
```


## Tests
There are 22 tests with these contracts, and are as follows
###CredentialOrgFactory Tests
1. testCheckContractOwner - Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
2. testSelectCredentialOrgCount -Tests to see if INIT records were created upon deploy.  Data existence check.
3. testSelectCredentialOrgTestRecord -Tests to see if INIT record values were set correctly.  Data Value correctness checking.
4. testInsertCredentialOrg - Test to see if credentialling Org can be created.  A Local instance invoked to allow onlyOwner modifer to work.
5. testSelectCredentialOrgDataOnNewInsert - Test to see newly inserted credentialing ord data was set correctly.  A Local instance invoked to allow onlyOwner modifer to work.
6. testSelectCredentialOrgCountAfterInsert - Tests to see if count increased after insert.  A local instance invoked to allow onlyOwner modifer to work.
7. testSelectCredentialOrgInvalidPosition - Test to see credentialing ord data from wrong bad position returns blanks and zeros.
8. testIsCredentialOrgInValid - Test to see if invalid credentialling org address IS a credentialling org (should return false)
9. testSelectValidCredentialOrgByAddress - Test to see if credentialling org can be looked up by valid credentialling org address
10. testSelectInvalidCredentialOrgByAddress -Test to see if invalid credentialling org can be looked up by address (blank means no return values)

###CredentialFactory Tests
1. testCheckContractOwner - Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
2. testSelectValidOrgCredentialCount - Checks Valid CredentialOrg Credential Count, checks if inital conditions are correct from migration
3. testSelectInvalidOrgCredentialCount - Checks Invalid CredentialOrg Credential Count, checks to see if return from invalid Org returns 0.
4. testSelectCredentialInitRecord -Checks Init Record Data value correctness, data validation of inital state.
5. testInsertCredentialRecordTests to see if Credential Records can be inserted. limited to Owner atm).  A Local instance invoked to allow onlyOwner modifer to work.
6. testSelectCredentialInsertedRecord - Tests to see if Credential Record just inserted's value was correct.   A Local instance invoked to allow onlyOwner modifer to work.

###ApplicantFactory Tests
1. testCheckContractOwner - Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
2. testCreateApplicant - Checks to see if an Applicant can be created.
3. testSelectValidApplicantByOrgAndPosition - Checks a Valid applicant by org and position (previous test created)
4. testSelectInValidApplicantByOrgAndPosition - Checks to see that InvalidApplicant Lookup returns 0 for the student Address
5. testSelectValidOrgApplicantCount - Checks the Valid Applicant Count by passed in Org.
6. testSelectInvalidOrgApplicantCount - Checks a call to Applicant Count by a non credential org.


I can think of many more tests beyond Unit this basic unit testing and into Functional Testing, however, my Javascript needs further work (as it was stretched for the ReactBox), before i can add some functional tests.  Round 2 will also include functional testing (Javascript), and access control tightening through the use of modifiers beyond onlyOwner. Note: this is round one of likely three, before i'll be 'satisfied' with the final output.


## Built With

* [Truffle Suite](https://truffleframework.com) - Truffle Suite Framework.
* [ganache-cli](https://github.com/trufflesuite/ganache-cli) - Ganache-cli (command line)
* [truffle react box]() - used as web app base.
* [OpenZeppelin-Solidity](https://github.com/OpenZeppelin/openzeppelin-solidity) (Pausable.sol, Ownable.sol)
* [CryptoZombies](http://cryptozombies.io) (SafeMath32.sol, was pared from.)

## Author
Richard Noordam


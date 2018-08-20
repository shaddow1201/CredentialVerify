# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round of of probably 3 before completed.

## What it does
*** future implimentation

1. CredentialOrgFactory.sol - allows the creation of CredentialOrgs.
2. CredentialFactory.sol - allows creation of credentials.
3. ApplicantFactory.sol - allows Applicants to apply to CredentialOrgs for Awarded Credentials
4. ProcessApplicants.sol - allows Gathering of info from CredentialOrgFactory, CredentialFactory, and Applicant Factory.
5. ***CredentialWriteOrDenyApplicant.sol - to be impliments in future

## Getting Started

These instructions should allow a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Truffle install - https://github.com/trufflesuite/truffle
2. ganache-cli install - https://github.com/trufflesuite/ganache-cli
3. project files (this git collection)
4. MetaMask install - https://metamask.io/

### Installing

1. Copy files to CredentialVerify Directory
2. run ganache-cli with following mnemonic "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"

```
ganache-cli -port 8545 -m "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"
```

3. Set Up MetaMask for project -
    import with seed phrase "delay film punch stool adult expect bulb grab clinic lawsuit clown amused"
    (set your own password, this is a throw away for testing)

    change the network to Private Network, set port to: 8545

3. Compile truffle
Compile the project in standard manner from where the file was unzipped.

```
truffle compile
```

3. Migrate
Migrate the project to the blockchain.
```
truffle migrate
```

4. Tests
A series of solidity tests for the contract files, testing basic contract functionality.

There are 22 tests with these contracts, and are as follows
##CredentialOrgFactory Tests
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

## CredentialFactory Tests
1. testCheckContractOwner - Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
2. testSelectValidOrgCredentialCount - Checks Valid CredentialOrg Credential Count, checks if inital conditions are correct from migration
3. testSelectInvalidOrgCredentialCount - Checks Invalid CredentialOrg Credential Count, checks to see if return from invalid Org returns 0.
4. testSelectCredentialInitRecord -Checks Init Record Data value correctness, data validation of inital state.
5. testInsertCredentialRecordTests to see if Credential Records can be inserted. limited to Owner atm).  A Local instance invoked to allow onlyOwner modifer to work.
6. testSelectCredentialInsertedRecord - Tests to see if Credential Record just inserted's value was correct.   A Local instance invoked to allow onlyOwner modifer to work.

## ApplicantFactory Tests
1. testCheckContractOwner - Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
2. testCreateApplicant - Checks to see if an Applicant can be created.
3. testSelectValidApplicantByOrgAndPosition - Checks a Valid applicant by org and position (previous test created)
4. testSelectInValidApplicantByOrgAndPosition - Checks to see that InvalidApplicant Lookup returns 0 for the student Address
5. testSelectValidOrgApplicantCount - Checks the Valid Applicant Count by passed in Org.
6. testSelectInvalidOrgApplicantCount - Checks a call to Applicant Count by a non credential org.


Round 2 will include access control tightening through the use of modifiers, and javascript testing.

```
truffle test
```

## Built With

* [Truffle Suite](https://truffleframework.com) - Truffle Suite Framework.
* [ganache-cli](https://github.com/trufflesuite/ganache-cli) - Ganache-cli (command line)
* [truffle react box]() - used as web app base.
* [OpenZeppelin-Solidity](https://github.com/OpenZeppelin/openzeppelin-solidity) (Pausable.sol, Ownable.sol)
* [CryptoZombies](http://cryptozombies.io) (SafeMath32.sol)

## Author
Richard Noordam


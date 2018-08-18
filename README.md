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


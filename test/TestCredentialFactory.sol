pragma solidity ^0.4.21;
/**
 * @title TestCredentialFactory
 * @dev The TestCredentialFactory contracts allows for CredentialFactory to be tested.
 */

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CredentialFactory.sol";

contract TestCredentialFactory {
    CredentialFactory credentialFactory = CredentialFactory(DeployedAddresses.CredentialFactory());

    address account0 = 0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB;

    /**
    * @dev Checks Owner address vs expected.   Makes sure that the contract was deployed properly.
    */
    function testCheckContractOwner() public {

        address contractOwner = credentialFactory.getOwner();
        address expected = account0;

        Assert.equal(contractOwner, expected, "Check Owner");
    }

    /**
    * @dev Checks Valid CredentialOrg Credential Count, checks if inital conditions are correct from migration.
    */
    function testSelectValidOrgCredentialCount() public {
        address contractOwner = credentialFactory.getOwner();
        uint256 testVal = uint256(credentialFactory.selectOrgCredentialCount(contractOwner));
        uint256 expected = 1;
        Assert.equal(testVal, expected, "Expected Credential Count (1)");
    }

    /**
    * @dev Checks Invalid CredentialOrg Credential Count, checks to see if return from invalid Org returns 0.
    */
    function testSelectInvalidOrgCredentialCount() public {
        uint256 testVal = uint256(credentialFactory.selectOrgCredentialCount(0x839c18df17236382f8832d9Ab5ef3FaCAFBAC891));
        uint256 expected = 0;
        Assert.equal(testVal, expected, "Expected Credential Count (0)");
    }

    /**
    * @dev Checks Init Record Data value correctness, data validation of inital state.
    */
    function testSelectCredentialInitRecord() public {
        address owner = credentialFactory.getOwner();
        string memory credentialLevel;

        (credentialLevel, , ) = credentialFactory.selectCredential(owner, 0);
        string memory expected = "TESTREC";

        Assert.equal(credentialLevel,expected,"Credential Division Matches Expected (TESTREC)");
    }

    /**
    * @dev Tests to see if Credential Records can be inserted. (anyone can insert, but you can only create records for YOU.)
    */
    function testInsertCredentialRecord() public {
        bool insertSuccess = credentialFactory.createCredential("ANOTHERREC", "AAAA", "AAAAAA");

        Assert.isTrue(insertSuccess, "Credential Record Creation Test Expected (True)");
    }

    /**
    * @dev Tests to see if Credential Record just inserted's value was correct.
    */
    function testSelectCredentialInsertedRecord() public {
        string memory credentialLevel;

        (credentialLevel, , ) = credentialFactory.selectCredential(address(this), 0);
        string memory expected = "ANOTHERREC";

        Assert.equal(credentialLevel,expected,"Credential Division Matches Expected (ANOTHERREC)");
    }

}
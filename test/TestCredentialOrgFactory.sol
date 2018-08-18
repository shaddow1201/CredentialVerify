pragma solidity ^0.4.21;
/**
 * @title TestCredentialOrgFactory
 * @dev The TestCredentialOrgFactory contracts allows for CredentialOrgFactory  to be tested.
 */
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CredentialOrgFactory.sol";

contract TestCredentialOrgFactory {
    // deployed instance for all non onlyOwner testing.
    CredentialOrgFactory credentialOrgFactoryA = CredentialOrgFactory(DeployedAddresses.CredentialOrgFactory());
    // local instance for onlyOwner testing.
    CredentialOrgFactory credentialOrgFactoryB = new CredentialOrgFactory();

    /**
    * @dev Checks Owner address vs expected, Makes sure that the contract was deployed to the correct owner.
    */
    function testCheckContractOwner() public {

        address contractOwner = credentialOrgFactoryA.getOwner();
        address expected = 0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB;

        Assert.equal(contractOwner, expected, "Check Owner");
    }

    /**
    * @dev Tests to see if INIT record was created upon deploy.  Data existence check.
    */
    function testSelectCredentialOrgCount() public {

        uint256 orgCount = uint256(credentialOrgFactoryA.selectOrgCount());
        uint256 expected = 5;

        Assert.equal(orgCount, expected, "Select of CredentialOrg Count.");
    }

    /**
    * @dev Tests to see if INIT record values were set correctly.  Data Value correctness checking.
    */
    function testSelectCredentialOrgTestRecord() public {

        string memory shortName;
        (shortName, , ) = credentialOrgFactoryA.selectCredentialOrgByPosition(0);
        string memory expected = "INITRECORD";

        Assert.equal(shortName, expected, "Retreival of CredentialOrg shortName.");
    }

    /*
    * @dev Test to see if credentialling Org can be created.
    */
    function testInsertCredentialOrg() public {

        bool testVal = false;
        string memory shortName = "TESTREC";
        string memory officialSchoolName = "TESTREC";
        address schoolAddress = 0x459c758575A93727fbfE16C4B8A9934Cd8Ab092C;
        testVal = credentialOrgFactoryB.createCredentialOrg(shortName, officialSchoolName, schoolAddress);
        
        Assert.isTrue(testVal, "Insert of CredentialOrg Test Successful");
    }

    /*
    * @dev Test to see newly inserted credentialing ord data was set correctly.
    *  local instance invoked to allow onlyOwner modifer to work.
    */
    function testSelectCredentialOrgDataOnNewInsert() public {

        string memory shortName;
        (shortName, , ) = credentialOrgFactoryB.selectCredentialOrgByPosition(0);
        string memory expected = "TESTREC";

        Assert.equal(shortName, expected, "Retreival of CredentialOrg shortName.");
    }

    /**
    * @dev Tests to see if count increased after insert.
    *  local instance invoked to allow onlyOwner modifer to work.
    */
    function testSelectCredentialOrgCountAfterInsert() public {

        uint256 orgCount = uint256(credentialOrgFactoryB.selectOrgCount());
        // local instance so original should be zero before the insert.
        uint256 expected = 1;

        Assert.equal(orgCount, expected, "Select of CredentialOrg Count.");
    }


    /*
    * @dev Test to see credentialing ord data from wrong bad position returns blanks and zeros.
    */
    function testSelectCredentialOrgInvalidPosition() public {

        string memory shortName;
        (shortName, , ) = credentialOrgFactoryA.selectCredentialOrgByPosition(10);
        string memory expected = "";

        Assert.equal(shortName, expected, "Retreival of CredentialOrg shortName.");
    }


    /*
    * @dev Test to see if invalid credentialling org address IS a credentialling org (should return false)
    */
    function testIsCredentialOrgInValid() public {

        bool testVal = credentialOrgFactoryA.isCredentialOrg(0x1eC2c24e0110a0c0C4e0E03e694dBC95cd825162);
        Assert.isFalse(testVal, "Base Inserted Test Org Valid");
    }

    /*
    * @dev Test to see if credentialling org can be looked up by valid credentialling org address
    */
    function testSelectValidCredentialOrgByAddress() public {

        string memory shortName;
        (shortName , , ) = credentialOrgFactoryB.selectCredentialOrgByAddress(0x459c758575A93727fbfE16C4B8A9934Cd8Ab092C);
        string memory expected = "TESTREC";

        Assert.equal(shortName, expected, "Retreival of CredentialOrg shortName.");
    }

    /*
    * @dev Test to see if invalid credentialling org can be looked up by address (blank means no return values)
    */
    function testSelectInvalidCredentialOrgByAddress() public {

        string memory shortName;
        (shortName , , ) = credentialOrgFactoryB.selectCredentialOrgByAddress(0xdCE6985d5C79B1B9AE30D748C1834Ab18AbE0C56);
        string memory expected = "";

        Assert.equal(shortName, expected, "Retreival of CredentialOrg shortName. (blank)");
    }

}
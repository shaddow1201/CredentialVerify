pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ApplicantFactory.sol";

contract TestApplicantFactory {
    ApplicantFactory applicantFactory = ApplicantFactory(DeployedAddresses.ApplicantFactory());

    address account0 = 0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB;

    /**
    * @dev Checks Owner address vs expected.   Makes sure that the contract was deployed properly.
    */
    function testCheckContractOwner() public {

        address contractOwner = applicantFactory.getOwner();
        address expected = account0;

        Assert.equal(contractOwner, expected, "Check Owner");
    }

    /**
    * @dev Checks to see if an Applicant can be created.
    */
    function testCreateApplicant() public {
        address contractOwner = applicantFactory.getOwner();
        bool insertSuccess = applicantFactory.createApplicant(contractOwner, "987654321", "222222222", "Richard", "Noordam");

        Assert.isTrue(insertSuccess, "Test Insert Successful (True)");
    }

    /**
    * @dev Checks a Valid applicant by org and position (previous test created)
    */
    function testSelectValidApplicantByOrgAndPosition() public {
        string memory SSN;                 // Applicant SSN
        (, SSN, , , ) = applicantFactory.selectApplicantByOrgAndPosition(account0, 0);
        string memory expected = "123456781";

        Assert.equal(SSN, expected, "Valid Applicant Lookup Successful.");
    }

    /**
    * @dev Checks to see that InvalidApplicant Lookup returns 0 for the student Address
    */
    function testSelectInValidApplicantByOrgAndPosition() public {
        address studentAddress;     // address of student requesting credential
        (studentAddress, , , , ) = applicantFactory.selectApplicantByOrgAndPosition(account0, 9);
        address expected = 0;

        Assert.equal(studentAddress, expected, "InValid Applicant Lookup failed appropriately. (returned 0)");
    }

    /**
    * @dev Checks the Valid Applicant Count by passed in Org.
    */
    function testSelectValidOrgApplicantCount() public {
        address contractOwner = applicantFactory.getOwner();
        uint256 applicantCount = uint256(applicantFactory.selectOrgApplicantCount(contractOwner));
        uint256 expected = 6;

        Assert.equal(applicantCount, expected, "Applicant Count 6 expected (5 initial, 1 added during test)");
    }

    /**
    * Checks a call to Applicant Count by a non credential org.
    */
    function testSelectInvalidOrgApplicantCount() public {
        uint256 applicantCount = uint256(applicantFactory.selectOrgApplicantCount(0xdCE6985d5C79B1B9AE30D748C1834Ab18AbE0C56));
        uint256 expected = 0;

        Assert.equal(applicantCount, expected, "Applicant Count (0 expected)");
        
    }

}

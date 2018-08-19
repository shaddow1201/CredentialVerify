pragma solidity ^0.4.21;
/**
 * @title ProcessCredentials
 * @dev The ProcessCredentials contracts allows gathering of all the information between 
 *      CredentialOrgFactory, CredentialFactory, ApplicantFactory.
 */
import "./Pausable.sol";
import "./SafeMath32.sol";

// Allows interface between Process Credentials and CredentialOrgFactory.
// not used at this time, will be when testing moves to Javascript.
interface CredentialOrgFactory{
    function isCredentialOrg(address _credentialOrgAddress) external view returns (bool IsOrgAddress);
}

// Allows interface between Process Credentials and CredentialFactory.
interface CredentialFactory{
    function selectCredential(address _credentialOrgAddress, uint32 _position) 
    external view 
    returns (string credentialLevel, string credentialTitle, string credentialDivision, uint32 credentialInsertDate, bool isActive);
}

// Allows interface between Process Credentials and ApplicantFactory.
interface ApplicantFactory{
    function selectApplicantByOrgAndPosition(address _orgAddress, uint32 _position) 
    external view 
    returns (address studentAddress, string SSN, string collegeStudentID, string firstName,  string lastName);
    function selectOrgApplicantCount(address _orgAddress) external view returns (uint32 appCount);
}

contract ProcessApplicants is Pausable {
    // SafeMath32 Library
    using SafeMath32 for uint32;

    // mappings
    mapping (address => uint32) credentailOrgToApplicantPosition;

    // events
    event ProcessCredentialApplicant(address orgAddress, address ApplicantAddress, uint32 position, string detail);
    event ProcessCredentialDetail(address orgAddress,string detail);

    // variables
    address private credentialOrgFactoryAddress;
    address private credentialFactoryAddress;
    address private applicantFatoryAddress;

    // modifiers
    /**
    * @dev Modifer onlyBy for Access Control
    */
    modifier onlyBy(address _credentialOrgAddress){
        uint32 foundAccount = 0;
        if (cof.isCredentialOrg(msg.sender)){
            foundAccount = 1;
        }
        if (foundAccount == 0) revert("Not Authorized CredentialOrg");
        _;
    }
    // References for the other contracts
    ApplicantFactory af;
    CredentialFactory cf;
    CredentialOrgFactory cof;


    // constructor
    constructor () public {
    }

    // functions
    /**
    * @dev Gets Owner Address of Contract
    * @return returnedOwner returns owner of contract address.
    */
    function getOwner()
    public view
    returns (address returnedOwner)
    {
        returnedOwner = owner;
    }

    /**
    * @dev Allows owner to set addresses needed for ProcessCredentials contract.
    * @param _credentialOrgContractAddress address of CredentialOrgFactory (set on deploy).
    * @param _credentialContractAddress address of CredentialFactory (set on deploy).
    * @param _applicantContractAddress address of ApplicantFactory (set on deploy).
    */
    function setAddress(address _credentialOrgContractAddress, address _credentialContractAddress, address _applicantContractAddress) 
    public onlyOwner 
    {
        if (msg.sender == owner){
            credentialOrgFactoryAddress = _credentialOrgContractAddress;
            credentialFactoryAddress = _credentialContractAddress;
            applicantFatoryAddress = _applicantContractAddress;
        }
        af = ApplicantFactory(applicantFatoryAddress);
        cf = CredentialFactory(credentialFactoryAddress);
        cof = CredentialOrgFactory(credentialOrgFactoryAddress);

    }    

    /**
    * @dev Allows resetting of Applicant Position lookup.
    * @param _position positon at which to start processing.
    */
    function updateApplicantProcessingPosition(uint32 _position)
    public whenNotPaused
    {
        // since we only work on own data, reprocessing isn't an issue.  
        // Do want to relook at this. will probably want to limit this
        // to just a few backwards.   maybe just minus 1.
        require(_position >= 0, "updateApplicantProcessingPosition: (FAIL) position has to be 0 or greater");
        credentailOrgToApplicantPosition[msg.sender] = _position;
    }

    /**
    * @dev Allows credentialOrg to select next Applicant (or sends back blank of not available/error)
    */
    function selectCredentialOrgNextApplicant()
    public
    returns (address studentAddress, string SSN, string collegeStudentID, string firstName,  string lastName, uint32 insertDate)
    {
        if (af.selectOrgApplicantCount(msg.sender) >= credentailOrgToApplicantPosition[msg.sender]){
            (studentAddress, SSN, collegeStudentID, firstName, lastName) = af.selectApplicantByOrgAndPosition(msg.sender, credentailOrgToApplicantPosition[msg.sender]);
            credentailOrgToApplicantPosition[msg.sender] = credentailOrgToApplicantPosition[msg.sender].add(1);
        } else {
            studentAddress = 0;
            SSN = "";
            collegeStudentID = "";
            firstName = "";
            lastName = "";
            emit ProcessCredentialDetail (msg.sender, "selectCredentialOrgNextApplicant (FAIL) No Applicants to Process.");
        }
        return (studentAddress, SSN, collegeStudentID, firstName, lastName, insertDate);
    }

    /**
    * @dev allows the selection of an applicantCredential
    * @param _credentialOrg credentialOrg address
    * @param _credentialPosition position of credential in CredentialOrgs Credentials
    * @return credentialLevel the credential level 
    * @return credentialTitle the credential title
    * @return credentialDivision the credential Division
    */
    function selectCredentialbyOrgAndPosition(address _credentialOrg, uint32 _credentialPosition)
    public view
    returns (string credentialLevel, string credentialTitle, string credentialDivision)
    {
        (credentialLevel, credentialTitle, credentialDivision, , ) = cf.selectCredential(_credentialOrg, _credentialPosition);

        return (credentialLevel, credentialTitle, credentialDivision);
    }

    /**
    * @dev allows the selection of an applicantCredential
    * @param _credentialOrg credentialOrg address
    * @return applicant the applicant address
    * @return firstName the applicant First Name
    * @return lastName the applicant lastName
    */
    function selectApplicantbyOrg(address _credentialOrg)
    public view
    returns (address applicant, string SSN, string collegeStudentID, string firstName, string lastName)
    {
        (applicant, SSN, collegeStudentID, firstName, lastName) = af.selectApplicantByOrgAndPosition(_credentialOrg, credentailOrgToApplicantPosition[_credentialOrg]);
        return (applicant, SSN, collegeStudentID, firstName, lastName);
    }




}
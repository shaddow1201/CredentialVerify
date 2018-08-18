var SafeMath32 = artifacts.require("./SafeMath32.sol");
var CredentialOrgFactory = artifacts.require("CredentialOrgFactory");  
var CredentialFactory = artifacts.require("CredentialFactory");        
var ApplicantFactory = artifacts.require("ApplicantFactory");          
var ProcessApplicants = artifacts.require("ProcessApplicants");

module.exports = async function(deployer) {
  let safeMathInst, aInst, bInst, cInst, dInst;

  await Promise.all([
    deployer.deploy(SafeMath32),
    deployer.deploy(CredentialOrgFactory),
    deployer.deploy(CredentialFactory),
    deployer.deploy(ApplicantFactory),
    deployer.deploy(ProcessApplicants),
    deployer.link(SafeMath32,[CredentialOrgFactory,CredentialFactory,ApplicantFactory])
  ]);

  instances = await Promise.all([
    SafeMath32.deployed(),
    CredentialOrgFactory.deployed(),
    CredentialFactory.deployed(),
    ApplicantFactory.deployed(),
    ProcessApplicants.deployed(),
  ])

  aInst = instances[1];
  bInst = instances[2];
  cInst = instances[3];
  dInst = instances[4];

  results = await Promise.all([
    // Generate a base record
    aInst.createCredentialOrg("INITRECORD", "BASE INIT RECORD", 0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB),
    // Grant access to all contracts (for isCredentialOrg)  
    // this doesn't quite acomplish what i'm trying to get done... as modifer onlyBy(msg.sender) still fails..
    aInst.createCredentialOrg("CREDENTIALORG", "CREDENTIALORGFACTORY", aInst.address),
    aInst.createCredentialOrg("CREDENTIAL", "CREDENTIALFACTORY", bInst.address),
    aInst.createCredentialOrg("APPLICANT", "APPLICANTFACTORY", cInst.address),
    aInst.createCredentialOrg("PROCESS", "PROCESSAPPLICANTS", dInst.address),
    
    // Set Address of bInst so it can point at aInst
    bInst.setAddress(aInst.address),
    bInst.createCredential("TESTREC", "AAAA", "AAAAAA"),
    
    // Set Address of cInst so it can point at aInst
    cInst.setAddress(aInst.address),
    cInst.createApplicant(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB, "123456789", "987654321", "TESTAPPLICANT", "TESTAPPLICANT"),
    
    // Set Address of dInst so it can point at aInst, bInst, and cInst
    dInst.setAddress(aInst.address, bInst.address, cInst.address)
  ]);

};
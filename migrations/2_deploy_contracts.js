var SafeMath32 = artifacts.require("./SafeMath32.sol");
var CredentialOrgFactory = artifacts.require("CredentialOrgFactory");  
var CredentialFactory = artifacts.require("CredentialFactory");        
var ApplicantFactory = artifacts.require("ApplicantFactory");          
//var ProcessApplicants = artifacts.require("ProcessApplicants");

module.exports = async function(deployer, accounts) {
  let safeMathInst, aInst, bInst, cInst;

  await Promise.all([
    deployer.deploy(SafeMath32),
    deployer.deploy(CredentialOrgFactory),
    deployer.deploy(CredentialFactory),
    deployer.deploy(ApplicantFactory),
    //deployer.deploy(ProcessApplicants),
    deployer.link(SafeMath32,[CredentialOrgFactory,CredentialFactory,ApplicantFactory])
  ]);

  instances = await Promise.all([
    SafeMath32.deployed(),
    CredentialOrgFactory.deployed(),
    CredentialFactory.deployed(),
    ApplicantFactory.deployed(),
    //ProcessApplicants.deployed(),
  ])

  safeMathInst = instances[0];
  aInst = instances[1];
  bInst = instances[2];
  cInst = instances[3];
  //dInst = instances[4];

  results = await Promise.all([
    // Generate a base record
    console.log("SafeMath32 Address: " + safeMathInst.address),
    console.log("CredentialOrgFactory Address: " + aInst.address),
    console.log("CredentialFactory Address: " + bInst.address),
    console.log("ApplicantFactory Address: " + cInst.address),
    console.log("Set Contract Needed Addresses"),
    bInst.setAddress(aInst.address),
    cInst.setAddress(aInst.address),

    console.log("StartRec Creation"),
    console.log("CredentialOrg Recs, owner, address of CredentialFactory, ApplicantFactory, and ProcessApplicants"),
    aInst.createCredentialOrg("INITRECORD", "BASE INIT RECORD", "0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB"),
    // Grant access to contracts (for isCredentialOrg)  
    aInst.createCredentialOrg("CREDENTIAL", "CREDENTIALFACTORY", bInst.address),
    aInst.createCredentialOrg("APPLICANT", "APPLICANTFACTORY", cInst.address),
    //aInst.createCredentialOrg("PROCESS", "PROCESSAPPLICANTS", dInst.address),
    

    console.log("create a base set of credentials for testing"),
    bInst.createCredential("Credential1", "AAAA", "AAAAAA", "0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB"),
    bInst.createCredential("Credential2", "BBBB", "BBBBBB", "0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB"),
    bInst.createCredential("Credential3", "CCCC", "CCCCCC", "0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB"),
    bInst.createCredential("Credential4", "DDDD", "DDDDDD", "0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB"),
    
    console.log("insert 5 Applicant Records, for testing."),
    cInst.createApplicant("0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB", "123456781", "987654321", "TESTAPPLICANT1", "TESTAPPLICANT1"),
    cInst.createApplicant("0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB", "123456782", "987654322", "TESTAPPLICANT2", "TESTAPPLICANT2"),
    cInst.createApplicant("0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB", "123456783", "987654323", "TESTAPPLICANT3", "TESTAPPLICANT3"),
    cInst.createApplicant("0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB", "123456784", "987654324", "TESTAPPLICANT4", "TESTAPPLICANT4"),
    cInst.createApplicant("0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB", "123456785", "987654325", "TESTAPPLICANT5", "TESTAPPLICANT5"),
    
    // Set Address of dInst so it can point at aInst, bInst, and cInst
    //dInst.setAddress(aInst.address, bInst.address, cInst.address)
  ]);

};
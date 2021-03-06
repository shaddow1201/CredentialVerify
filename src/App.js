import React, { Component } from 'react'
import CredentialOrgFactoryContract from '../build/contracts/CredentialOrgFactory.json'
import CredentialFactoryContract from '../build/contracts/CredentialFactory.json'
import ApplicantFactoryContract from '../build/contracts/ApplicantFactory.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      account: null,

      credentialOrgFactoryContract: null,
      credentialFactoryContract: null,
      applicantFactoryContract: null,
      // current account details
      isCredentialOrg: null,
      schoolShortName: null,
      officialSchoolName: null,
      schoolAddress: 0,
      // counters
      credentialOrgCount: null,
      credentialCount: null,
      applicantCount: null,
      detail: null,
      // owner checks
      ownerAddress: "",
      isOwner: "false",
      isApplicant: "true",
      // Create Credential Org Variables
      createCredentialOrgShortName: "",
      createCredentialOrgOfficialSchoolName: "",
      createCredentialOrgSchoolAddress: "",
      // Select Credential Org Variables
      selectCredentialOrgShortName: "",
      selectCredentialOrgOfficialSchoolName: "",
      selectCredentialOrgSchoolAddress: "",
      selectCredentialOrgPosition: 0,
      // create Credential Variables
      createCredentialLevel: "",
      createCredentialTitle: "",
      createCredentialDivision: "",
      createcredentialOrgAddress: "",
      // select Credential Variables
      selectCredentialLevel: "",
      selectCredentialTitle: "",
      selectCredentialDivision: "",
      selectcredentialOrgAddress: "",
      selectCredentialPosition: 0,
      // select Applicant Variables
      selectApplicantAddress: "",
      selectApplicantSSN: "",
      selectApplicantCID: "",
      selectApplicantFName: "",
      selectApplicantLName: "",
      selectApplicantPosition: 0
    };

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContracts()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContracts() {

    const contract = require('truffle-contract')
    const credentialOrgFactory = contract(CredentialOrgFactoryContract);
    const credentialFactory = contract(CredentialFactoryContract);
    const applicantFactory = contract(ApplicantFactoryContract);
    credentialOrgFactory.setProvider(this.state.web3.currentProvider);
    credentialFactory.setProvider(this.state.web3.currentProvider);
    applicantFactory.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on CredentialOrgFactory.
    var credentialOrgFactoryInstance
    var credentialFactoryInstance
    var applicantFactoryInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.web3.eth.defaultAccount = accounts[0];
      credentialOrgFactory.deployed().then((instance) => {
        // set contract instance for CredentialOrgFactory and set state
        credentialOrgFactoryInstance = instance;
        this.setState({ credentialOrgFactoryContract: credentialOrgFactoryInstance }, this.credentialOrgFactoryDetail);
        //CredentialOrgFactory Watcher
        var credentialOrgFactoryEvent = credentialOrgFactoryInstance.CredentialOrgEvent();
        credentialOrgFactoryEvent.watch(function (err, result) {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log(result);
          }
          // do a CredentialOrg count update if event is captured 
          return credentialOrgFactoryInstance.selectOrgCount()
          .then ((result) => {
            return this.setState({ credentialOrgCount: result.c[0] })
          })
        }.bind(this));
      }).then((result) => {
        credentialFactory.deployed().then((instance) => {
          // set contract instance for CredentialFactory
          credentialFactoryInstance = instance;
          // Event watcher for CredentialFactory contract.
          var credentialFactoryEvent = credentialFactoryInstance.CredentialEvent();
          credentialFactoryEvent.watch(function (err, result) {
            if (err) {
              console.log(err);
              return;
            } else {
              console.log(result);
            }
            // do an Org CredentialCount update on event capture
            return credentialFactoryInstance.selectOrgCredentialCount(this.state.account)
            .then ((result) => {
              return this.setState({ credentialCount: result.c[0] })
            })
          }.bind(this));
          // set the state of the contract
          return this.setState({ credentialFactoryContract: credentialFactoryInstance, account: accounts[0] }, this.credentialFactoryDetail);
        }).then((result) => {
          applicantFactory.deployed().then((instance) => {
            // assign contract instance.
            applicantFactoryInstance = instance;
            // ApplicantFactory Event Watcher.
            var applicantFactoryEvent = applicantFactoryInstance.ApplicantEvent();
            applicantFactoryEvent.watch(function (err, result) {
              if (err) {
                console.log(err);
                return;
              } else {
                console.log(result);
              }
              // do an Org CredentialCount update on event capture
              return applicantFactoryInstance.selectOrgApplicantCount(this.state.account)
              .then ((result) => {
                return this.setState({ credentialCount: result.c[0] })
              })
            }.bind(this));
            // Set state variables.
            this.setState({ applicantFactoryContract: applicantFactoryInstance, account: accounts[0] }, this.applicantFactoryDetail);
            return credentialOrgFactoryInstance.getOwner()
          }).then((result) => {
            this.setState({ ownerAddress: result })
            if (this.state.ownerAddress === this.state.account) {
              this.setState({ isOwner: "true" })
            }
            return credentialOrgFactoryInstance.isCredentialOrg(this.state.account);
          }).then((result) => {
            // Update state with the result. (display for now, but future update visible states.)
            if (result) {
              this.setState({ isCredentialOrg: "true", isApplicant: "false" })
            } else {
              // hide all but applicant.
              this.setState({ isCredentialOrg: "false", isApplicant: "true" })
            }
            return credentialFactoryInstance.selectOrgCredentialCount(this.state.account)
          }).then((result) => {
            this.setState({ credentialCount: result.c[0] })
          }).then((result) => {
            return applicantFactoryInstance.selectOrgApplicantCount(this.state.account)
          }).then((result) => {
            this.setState({ applicantCount: result.c[0] })
            return credentialOrgFactoryInstance.selectCredentialOrgByAddress(this.state.account)
          }).then((result) => {
            var testVal = result.toString().split(",");
            this.setState({ schoolShortName: testVal[0], officialSchoolName: testVal[1], schoolAddress: testVal[2] })
            return credentialOrgFactoryInstance.selectOrgCount()
          }).then((result) => {
            this.setState({ credentialOrgCount: result.c[0] })
          })
        })
      })
    })
  }

  credentialOrgOwnerShow(event) {
    // TODO  visibility items for owner
    //account = this.state.account
    if(this.state.isOwner === "true"){
      // show create Credential Org
    } else {
      // hide create Credential Org
    }
  }

  credentialOrgShow(event) {
    if(this.state.isCredentialOrg === "true"){
      // show credentialCreate
      // hide applicantcreate
      // show applicant Lookup
    } else {
      // hide credential Create
      // hide applicant lookup.
    }
  }

  credentialOrgFactoryDetail(event) {
    console.log("Log Event: set CredentialOrgFactory Contract State");
  }
  credentialFactoryDetail(event) {
    console.log("Log Event: set CredentialFactory Contract State");
  }
  applicantFactoryDetail(event) {
    console.log("Log Event: set ApplicantFactory Contract State");
  }

  //*************************** */
  //*  Create Credential Area   */
  //*************************** */
  createCredentialOrg(event) {
    //alert("Attempting Create Credential Org");
    const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract

    if (this.state.web3.isAddress(this.state.createCredentialOrgSchoolAddress)) {
      //console.log(JSON.stringify(this.state.createCredentialOrgSchoolAddress))
      return credentialOrgFactoryContract.createCredentialOrg(this.state.createCredentialOrgShortName, this.state.createCredentialOrgOfficialSchoolName, this.state.createCredentialOrgSchoolAddress)
        .then((result) => {
          console.log(result.args)
          if (typeof result === 'undefined') {
            alert("insert failure")
          }
        })
    } else {
      console.log("Invalid accounts[0]/account address attempted.  No attempt.");
    }
  }

  //*************************** */
  //*  Select CredentialOrg Area*/
  //*************************** */
  selectCredentialOrg(event) {
    const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract
    var checkVal;
    try{
      checkVal = parseInt(this.state.selectCredentialOrgPosition,10);
    } catch (e) {
      console.log(e)
      checkVal = "";
    }
    if (Number.isInteger(checkVal)){
      return credentialOrgFactoryContract.selectCredentialOrgByPosition(this.state.selectCredentialOrgPosition)
      .then((result) => {
        console.log(result);
        var testVal = result.toString().split(",");
        this.setState({ selectCredentialOrgShortName: testVal[0], selectCredentialOrgOfficialSchoolName: testVal[1], selectCredentialOrgSchoolAddress: testVal[2] })
      })
    } else {
      alert("Please enter an Integer value for the CredentialOrg Lookup Position.  No lookup attempted.");
    }
  }
  //*************************** */
  //*  Create Credential Area   */
  //*************************** */
  createCredential(event) {
    const credentialFactoryContract = this.state.credentialFactoryContract
    const account = this.state.account
    if (this.state.web3.isAddress(account)){
      //console.log(JSON.stringify(account)
      return credentialFactoryContract.createCredential(this.state.createCredentialLevel, this.state.createCredentialTitle, this.state.createCredentialDivision, account)
      .then((result) => {
        console.log(result.args)
        //alert(result.c[0])
        console.log(result);
      })
    } else {
      alert("accounts[0]/account is not a valid address.  No create attempted.");
    }
  }
  //*************************** */
  //*  Select Credential Area   */
  //*************************** */
  selectCredential(event) {
    const credentialFactoryContract = this.state.credentialFactoryContract
    const account = this.state.account
    var checkVal;
    try{
      checkVal = parseInt(this.state.selectCredentialPosition,10);
    } catch (e) {
      console.log(e)
      checkVal = "";
    }
    if (Number.isInteger(checkVal)){
      return credentialFactoryContract.selectCredential(account, this.state.selectCredentialPosition)
      .then((result) => {
        console.log(result);
        var testVal = result.toString().split(",");
        this.setState({ selectCredentialLevel: testVal[0], selectCredentialTitle: testVal[1], selectCredentialDivision: testVal[2] })
      })
    } else {
      alert("Please enter an Integer value for Credential Lookup Position.  No lookup attempted.");
    }
  }
  //*************************** */
  //*  Select Applicant Area   */
  //*************************** */
  selectApplicant(event) {
    const applicantFactoryContract = this.state.applicantFactoryContract
    const account = this.state.account
    var checkVal;
    try{
      checkVal = parseInt(this.state.selectCredentialPosition,10);
    } catch (e) {
      console.log(e)
      checkVal = "";
    }
    if(Number.isInteger(checkVal)){
    return applicantFactoryContract.selectApplicantByOrgAndPosition(account, this.state.selectApplicantPosition)
      .then((result) => {
        console.log(result);
        var testVal = result.toString().split(",");
        this.setState({ selectApplicantAddress: testVal[0], selectApplicantSSN: testVal[1], selectApplicantCID: testVal[2], selectApplicantFName: testVal[3], selectApplicantLName: testVal[4] })
      })
    } else {
      alert("Please enter an Integer value for Applicant Lookup Position.  No lookup attempted.");
    }
  }


  //*************************** */
  //*  Helper onChange functions*/
  //*************************** */

  createCredentialLevelChange(event) {
    this.setState({ createCredentialLevel: event.target.value });
  }
  createCredentialTitleChange(event) {
    this.setState({ createCredentialTitle: event.target.value });
  }
  createCredentialDivisionChange(event) {
    this.setState({ createCredentialDivision: event.target.value });
  }
  createcredentialAddressChange(event) {
    this.setState({ createcredentialOrgAddress: event.target.value });
  }
  selectApplicantLocationChange(event) {
    this.setState({ selectApplicantPosition: event.target.value });
  }
  selectCredentialLocationChange(event) {
    this.setState({ selectCredentialPosition: event.target.value });
  }
  selectOrgLocationChange(event) {
    this.setState({ selectCredentialOrgPosition: event.target.value });
  }
  createOrgShortNameChange(event) {
    this.setState({ createCredentialOrgShortName: event.target.value });
  }
  createOrgOfficialNameChange(event) {
    this.setState({ createCredentialOrgOfficialSchoolName: event.target.value });
  }
  createOrgSchoolAddressChange(event) {
    this.setState({ createCredentialOrgSchoolAddress: event.target.value });
  }

  render() {

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="https://github.com/truffle-box/react-box" className="pure-menu-heading pure-menu-link">Based on Truffle React Box</a>
          <a href="https://github.com/shaddow1201/CredentialVerify" className="pure-menu-heading pure-menu-link">GitHub Repository</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <div>
                <table width="800">
                  <tbody>
                    <tr><td><h1>Welcome to Credential Verify!</h1>
                      <section width="100%">
                        <b>Base Lookup</b><br />
                        <font size="2">This is the current accounts details in relation to the blockchain.</font><br/>
                        <font color="blue">CurrentAccount isOwner: {this.state.isOwner}</font><br />
                        <font color="blue">CurrentAccount isCredentialOrg: {this.state.isCredentialOrg}</font><br />
                        <font color="blue">CurrentAccount isApplicant: {this.state.isApplicant}</font><br />
                        <font color="blue">School ShortName: {this.state.schoolShortName}</font><br />
                        <font color="blue">School Official Name: {this.state.officialSchoolName}</font><br />
                        <font color="blue">SchoolAddress: {this.state.schoolAddress}</font><br />
                      </section>
                    </td><td><b>Legend</b><br /><font color="blue">CredentialOrgFactory Contract</font><br /><font color="red">CredentialFactory Contract</font><br /><font color="green">ApplicantFactory Contract</font></td></tr>
                  </tbody>
                </table><br />
              </div>
              <hr />
              <section>
                <h2>Credential Org Interaction Section</h2>
                <font color="blue">Total Credential Orgs: {this.state.credentialOrgCount}</font><br />
                <h3>Select CredentialOrg</h3>
                <font size="2">The CredentialOrgFactory is prepopulated with 3 Accounts, (see the 2_deploy_contracts.js).<br/>Zero is prepopulated, so you can just click the Select Credential Org Button.<br/>  The array starts at zero, so the first array position is 0, then 1, and 2 for a total of 3 positions.<br/>  This number limit increases as you insert records.</font><br/>
                <section>
                  <table>
                    <tbody>
                      <tr><td><font color="blue">Select Credential Org</font></td><td><font color="blue">Position:</font> <input type="text" maxLength="5" size="5" value={this.state.selectCredentialOrgPosition} onChange={this.selectOrgLocationChange.bind(this)} /></td></tr>
                      <tr><td><font color="blue">School Short Name</font></td><td><input type="text" maxLength="30" size="32" value={this.state.selectCredentialOrgShortName} /></td></tr>
                      <tr><td><font color="blue">School Official Name</font></td><td><input type="text" maxLength="70" size="72" value={this.state.selectCredentialOrgOfficialSchoolName} /></td></tr>
                      <tr><td><font color="blue">School Address</font></td><td><input type="text" maxLength="42" size="50" value={this.state.selectCredentialOrgSchoolAddress} /></td></tr>
                    </tbody>
                  </table>
                  <button onClick={this.selectCredentialOrg.bind(this)}>Select CredentialOrg</button>
                </section>
                <section>
                <h3>Create Credential Org</h3>
                <font size="2">You can create credentialOrgs as the owner.  Only the contract owner can acomplish this function.<br/>Fill out form with valid data (form should limit max), and submit!</font>
                <table>
                  <tbody>
                    <tr><td><font color="blue">School Short Name</font></td><td><input type="text" maxLength="30" size="32" value={this.state.createCredentialOrgShortName} onChange={this.createOrgShortNameChange.bind(this)} /></td></tr>
                    <tr><td><font color="blue">School Official Name</font></td><td><input type="text" maxLength="70" size="72" value={this.state.createCredentialOrgOfficialSchoolName} onChange={this.createOrgOfficialNameChange.bind(this)} /></td></tr>
                    <tr><td><font color="blue">School Address</font></td><td><input type="text" maxLength="42" size="50" value={this.state.createCredentialOrgSchoolAddress} onChange={this.createOrgSchoolAddressChange.bind(this)} /></td></tr>
                  </tbody>
                </table>
                <button onClick={this.createCredentialOrg.bind(this)} disabled={!this.state.isCredentialOrg}>Create Credential Org</button>
                </section>
              </section>
              <hr />
              <h2>Credential Interaction Section</h2>
              <section>
                <font color="red">Credential Count: {this.state.credentialCount}</font><br />
                <h3>Select Credential by Position</h3>
                <font size="2">The CredentialFactory is prepopulated with 4 Credentials, (see the 2_deploy_contracts.js).<br/> Zero is prepopulated, so you can just click the Select Credential Button.</font>
                <table>
                  <tbody>
                    <tr><td><font color="red">Select Credential</font></td><td> <font color="red">Position:</font> <input type="text" maxLength="5" size="5" value={this.state.selectCredentialPosition} onChange={this.selectCredentialLocationChange.bind(this)} /></td></tr>
                    <tr><td><font color="red">Credential Level</font></td><td><input type="text" maxLength="50" size="32" value={this.state.selectCredentialLevel} /></td></tr>
                    <tr><td><font color="red">Credential Title</font></td><td><input type="text" maxLength="70" size="72" value={this.state.selectCredentialTitle} /></td></tr>
                    <tr><td><font color="red">CredentialDivision</font></td><td><input type="text" maxLength="50" size="55" value={this.state.selectCredentialDivision} /></td></tr>
                  </tbody>
                </table>
                <button onClick={this.selectCredential.bind(this)} >Select Credential</button>
              </section>
              <section>
                <h3>Insert Credential</h3>
                <font size="2">You can create your own credential as the owner or the credentialOrg.  The owner can add to any,<br/>the credentialOrg can only act on/add to their records.  The owner access is intended to be a helper function<br/> for the CredentialOrgs.   Fill out form with valid data (form should limit max), and submit!</font>
                <table>
                  <tbody>
                    <tr><td><font color="red">Credential Level</font></td><td><input type="text" maxLength="50" size="32" value={this.state.createCredentialLevel} onChange={this.createCredentialLevelChange.bind(this)} /></td></tr>
                    <tr><td><font color="red">Credential Title</font></td><td><input type="text" maxLength="70" size="72" value={this.state.createCredentialTitle} onChange={this.createCredentialTitleChange.bind(this)} /></td></tr>
                    <tr><td><font color="red">CredentialDivision</font></td><td><input type="text" maxLength="50" size="55" value={this.state.createCredentialDivision} onChange={this.createCredentialDivisionChange.bind(this)} /></td></tr>
                    <tr><td><font color="red">OrgAddress</font></td><td><input type="text" maxLength="42" size="50" value={this.state.createcredentialOrgAddress} onChange={this.createcredentialAddressChange.bind(this)} /></td></tr>
                  </tbody>
                </table>
                <button onClick={this.createCredential.bind(this)} disabled={!this.state.isCredentialOrg}>Create Credential</button>
              </section>
              <hr />
              <div>
                <h2>Applicant Interaction Section</h2>
                <font color="green">CredentialOrg Applicant Count: {this.state.applicantCount}</font>
              </div>
              <div>
                <h3>Select Applicant By Position</h3>
                <font size="2">The ApplicantFactory is prepopulated with 5 Applicants, all applying to the owner CredentialOrg.<br/> (see the 2_deploy_contracts.js). Zero is prepopulated, so you can just click the Select Applicant Button.</font>
                <table>
                  <tbody>
                    <tr><td><font color="green">Select Applicant</font></td><td>&nbsp;<font color="green">&nbsp;Position:</font> <input type="text" maxLength="5" size="5" value={this.state.selectApplicantPosition} onChange={this.selectApplicantLocationChange.bind(this)} /></td></tr>
                    <tr><td><font color="green">OrgAddress</font></td><td><input type="text" maxLength="42" size="50" value={this.state.selectApplicantAddress} /></td></tr>
                    <tr><td><font color="green">SSN</font></td><td><input type="text" maxLength="50" size="32" value={this.state.selectApplicantSSN} /></td></tr>
                    <tr><td><font color="green">CollegeID</font></td><td><input type="text" maxLength="50" size="32" value={this.state.selectApplicantCID} /></td></tr>
                    <tr><td><font color="green">First Name</font></td><td><input type="text" maxLength="50" size="32" value={this.state.selectApplicantFName} /></td></tr>
                    <tr><td><font color="green">Last Name</font></td><td><input type="text" maxLength="50" size="32" value={this.state.selectApplicantLName} /></td></tr>
                  </tbody>
                </table>
                <button onClick={this.selectApplicant.bind(this)} disabled={!this.state.isCredentialOrg}>Select Applicant</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App

import React, { Component } from 'react'
import CredentialOrgFactoryContract from '../build/contracts/CredentialOrgFactory.json'
import CredentialFactoryContract from '../build/contracts/CredentialFactory.json'
import ApplicantFactoryContract from '../build/contracts/ApplicantFactory.json'
import ProcessApplicantsContract from '../build/contracts/ProcessApplicants.json'
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
      processApplicantContract: null,
      isCredentialOrg : null,
      credentialOrgCount: null,
      schoolShortName : null,
      officialSchoolName: null,
      schoolAddress : 0,
      credentialCount: null,
      applicantCount: null,
      detail : null,
      createCredentialOrgShortName: "",
      createCredentialOrgOfficialSchoolName: "",
      createCredentialOrgSchoolAddress: "",
      createdSchoolAddress: null,
      selectCredentialOrgShortName: "",
      selectCredentialOrgOfficialSchoolName: "",
      selectCredentialOrgSchoolAddress: "",
      selectCredentialOrgPosition: "0",
      createCredentialLevel: "",
      createCredentialTitle: "",
      createCredentialDivision: "",
      createcredentialOrgAddress: "",
      selectCredentialLevel: "",
      selectCredentialTitle: "",
      selectCredentialDivision: "",
      selectcredentialOrgAddress: "",
      selectCredentialPosition: 0,
      selectApplicantAddress: "",
      selectApplicantSSN: "",
      selectApplicantCID: "",
      selectApplicantFName: "",
      selectApplicantLName: "",
      selectApplicantPosition: 0,
      emitDetail: ""
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
    const processApplicants = contract(ProcessApplicantsContract);
    credentialOrgFactory.setProvider(this.state.web3.currentProvider);
    credentialFactory.setProvider(this.state.web3.currentProvider);
    applicantFactory.setProvider(this.state.web3.currentProvider);
    processApplicants.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on CredentialOrgFactory.
    var credentialOrgFactoryInstance
    var credentialFactoryInstance
    var applicantFactoryInstance
    var processApplicantsInstance
    
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.web3.eth.defaultAccount = accounts[0];
      credentialOrgFactory.deployed().then((instance) => {
        //this.state.web3.eth.defaultAccount = this.state.web3.eth.accounts[0];
        credentialOrgFactoryInstance = instance;
        // set the state of the contract
        this.setState({ credentialOrgFactoryContract: credentialOrgFactoryInstance}, this.credentialOrgFactoryDetail);
        var credentialOrgFactoryEvent = credentialOrgFactoryInstance.CredentialOrgEvent();
        credentialOrgFactoryEvent.watch(function(err, result) {
          //alert("OMG, GOT A CREDENTIALORGFACTORY EVENT!!!");
          console.log("result.args");
          console.log (result.args);
          if (err) {
            console.log(err);
            return;
          }
          //this.credentialOrgFactoryDetail(result.args.schoooAddress.c[0]);
          //console.log("SchoolAddress is: " + result.args.schoolAddress.c[0])
          return this.setState({ emitDetail: ""});
        }.bind(this));

      }).then((result) => {
        // Update state with the result.
        credentialFactory.deployed().then((instance) => {
          credentialFactoryInstance = instance;
          var credentialFactoryEvent = credentialFactoryInstance.CredentialEvent();
          credentialFactoryEvent.watch(function(err, result) {
            //alert("OMG, GOT A CREDENTIALFACTORY EVENT!!!");
            console.log("result.args");
            console.log (result.args);
            if (err) {
              console.log(err);
              return;
            }
            //alert(result.args.schoolAddress.c[0]);
            return this.setState({ emitDetail: ""});
  
          }.bind(this));
    
          // set the state of the contract
          return this.setState({ credentialFactoryContract: credentialFactoryInstance, account: accounts[0]}, this.credentialFactoryDetail);
        }).then((result) => {
          //console.log(result);
          applicantFactory.deployed().then((instance) => {
            applicantFactoryInstance = instance;
            var applicantFactoryEvent = applicantFactoryInstance.ApplicantEvent();
            applicantFactoryEvent.watch(function(err, result) {
              //alert("OMG, GOT A APPLICANTFACTORY EVENT!!!");
              console.log("result.args");
              console.log (result.args);
              if (err) {
                console.log(err);
                return;
              }
              // set the state of the contract
              //alert(result.args.schoolAddress.c[0]);
              return this.setState({ emitDetail: ""})
            }.bind(this));
    
            return this.setState({ applicantFactoryContract: applicantFactoryInstance, account: accounts[0]}, this.applicantFactoryDetail);
          }).then((result) =>{
            //console.log(result);
            processApplicants.deployed().then((instance) => {
              processApplicantsInstance = instance; 
              // set the state of the contract
              this.setState({ processApplicantsContract: processApplicantsInstance}, this.processApplicantsDetail);
              return credentialOrgFactoryInstance.isCredentialOrg(this.state.account);
            }).then((result) => {
              // Update state with the result.
              if (result){ 
                if (this.state.account === accounts[0])
                {
                  // show all
                } else {
                  // hide create areas.
                }
                this.setState({ isCredentialOrg: "true" })
              } else {
                // hide all but applicant.
                this.setState({ isCredentialOrg: "false"})
              }
              return credentialFactoryInstance.selectOrgCredentialCount(this.state.account) 
            }).then ((result) => {
              this.setState({ credentialCount: result.c[0]})
            }).then ((result) => {
              return applicantFactoryInstance.selectOrgApplicantCount(this.state.account)
            }).then ((result) => {
              this.setState({applicantCount: result.c[0]})
              return credentialOrgFactoryInstance.selectCredentialOrgByAddress(this.state.account)
            }).then ((result) => {
              var testVal = result.toString().split(",");                
              this.setState({schoolShortName: testVal[0], officialSchoolName: testVal[1], schoolAddress: testVal[2]})   
              return credentialOrgFactoryInstance.selectOrgCount()
            }).then ((result) => {
              this.setState({credentialOrgCount: result.c[0]})
            })
          })
        })
      })
    })
  }

  credentialOrgOwnerShow(event){

  }

  credentialOrgShow(event){

  }

  applicantShow(event){

  }

  credentialOrgFactoryDetail(event){
    console.log("Log Event: set CredentialOrgFactory Contract State");
  }
  credentialFactoryDetail(event){
    console.log("Log Event: set CredentialFactory Contract State");
  }
  applicantFactoryDetail(event){
    console.log("Log Event: set ApplicantFactory Contract State");
  }
  processApplicantsDetail(event){
    console.log("Log Event: set ProcessApplicants Contract State");
  }
  //*************************** */
  //*  Create Credential Area   */
  //*************************** */
  createCredentialOrg(event){
    //alert("Attempting Create Credential Org");
    const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract
    var checkBool = this.state.web3.isAddress(this.state.createCredentialOrgSchoolAddress)
    
    if (checkBool){
      //console.log(JSON.stringify(this.state.createCredentialOrgSchoolAddress))
      return credentialOrgFactoryContract.createCredentialOrg(this.state.createCredentialOrgShortName, this.state.createCredentialOrgOfficialSchoolName, this.state.createCredentialOrgSchoolAddress)
      .then((result) => {
        console.log(result.event)
        if (typeof result === 'undefined'){
          alert("insert failure")
        }
        return credentialOrgFactoryContract.selectOrgCount()
      }).then ((result) => {
        //alert(result.c[0])
        this.setState({credentialOrgCount: result.c[0]})
      })
    } else {
      console.log("Invalid address attempted.  No attempt.");
    }
  }

  //*************************** */
  //*  Select CredentialOrg Area*/
  //*************************** */
  selectCredentialOrg(event){
    const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract
    //const account = this.state.account
    //alert("looking up position: " + this.state.selectCredentialOrgPosition + " :credentialOrgCount: " + this.state.credentialOrgCount)
    //console.log(this.state.selectCredentialOrgPosition)
    //return credentialOrgFactoryContract.selectCredentialOrgByPosition(this.state.selectCredentialOrgPosition)
    return credentialOrgFactoryContract.selectCredentialOrgByPosition(this.state.selectCredentialOrgPosition)
    .then((result) => {
      console.log(result);
      var testVal = result.toString().split(",");
      this.setState({selectCredentialOrgShortName: testVal[0], selectCredentialOrgOfficialSchoolName: testVal[1], selectCredentialOrgSchoolAddress: testVal[2]})
    })
  }
  //*************************** */
  //*  Create Credential Area   */
  //*************************** */
  createCredential(event){
    const credentialFactoryContract = this.state.credentialFactoryContract
    const account = this.state.account
    return credentialFactoryContract.createCredential(this.state.createCredentialLevel, this.state.createCredentialTitle, this.state.createCredentialDivision, account) 
    .then((result) => {
      console.log(result.event)
      if (typeof result === 'undefined'){
          alert("insert failure")
        }
      return credentialFactoryContract.selectOrgCredentialCount()
    }).then ((result) => {
        //alert(result.c[0])
        this.setState({credentialCount: result.c[0]})
    })
  }
  //*************************** */
  //*  Select Credential Area   */
  //*************************** */
  selectCredential(event){
    const credentialFactoryContract = this.state.credentialFactoryContract
    const account = this.state.account
    return credentialFactoryContract.selectCredential(account, this.state.selectCredentialPosition)
    .then((result) => {
      console.log(result);
      var testVal = result.toString().split(",");
      this.setState({selectCredentialLevel: testVal[0], selectCredentialTitle: testVal[1], selectCredentialDivision: testVal[2]})
    })

  }
  //*************************** */
  //*  Select Applicant Area   */
  //*************************** */
  selectApplicant(event){
    const applicantFactoryContract = this.state.applicantFactoryContract
    const account = this.state.account
    return applicantFactoryContract.selectApplicantByOrgAndPosition(account, this.state.selectApplicantPosition)
    .then((result) => {
      console.log(result);
      var testVal = result.toString().split(",");
      this.setState({selectApplicantAddress: testVal[0], selectApplicantSSN: testVal[1], selectApplicantCID: testVal[2], selectApplicantFName: testVal[3], selectApplicantLName: testVal[4]})
    })
  }


  //*************************** */
  //*  Helper onChange functions*/
  //*************************** */

  createCredentialLeveChange(event){
    this.setState({createCredentialLevel: event.target.value});
  }
  createCredentialTitleChange(event){
    this.setState({createCredentialTitle: event.target.value});
  }
  createCredentialDivisionChange(event){
    this.setState({createCredentialDivision: event.target.value});
  }
  createcredentialAddressChange(event){
    this.setState({createcredentialOrgAddress: event.target.value});
  }
  selectApplicantLocation(event){
    this.setState({selectApplicantPosition: event.target.value});
  }
  selectCredentialLocation(event){
    this.setState({selectCredentialPosition: event.target.value});
  }
  selectOrgLocation(event){
    this.setState({selectCredentialOrgPosition: event.target.value});
  }
  createOrgShortNameChange(event){
    this.setState({createCredentialOrgShortName: event.target.value});
  }
  createOrgOfficialNameChange(event){
    this.setState({createCredentialOrgOfficialSchoolName: event.target.value});
  }
  createOrgSchoolAddress(event){
    this.setState({createCredentialOrgSchoolAddress: event.target.value});
  }



  render() {

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Based on React's Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
            
              <div>
              <table width="800">
                <tbody>
                <tr><td><h1>Welcome to Credential Verify!</h1></td><td><h4>Legend</h4><font color="blue">CredentialOrgFactory Contract</font><br/><font color="red">CredentialFactory Contract</font><br/><font color="green">ApplicantFactory Contract</font></td></tr>
                </tbody>
              </table><br/>
              </div>
              <hr/>
              <div>
                <h3>Base Lookup</h3>
                <font color="blue">CurrentAccount isCredentialOrg: {this.state.isCredentialOrg}</font><br/>
                <font color="blue">School ShortName: {this.state.schoolShortName}</font><br/>
                <font color="blue">School Official Name: {this.state.officialSchoolName}</font><br/>
                <font color="blue">SchoolAddress: {this.state.schoolAddress}</font><br/>
              </div>
              <hr/>
              <div>
                <h2>Credential Org Interaction Section</h2>
                <font color="blue">Total Credential Orgs: {this.state.credentialOrgCount}</font><br/>
                <div>
                <h3>Select CredentialOrg</h3>
                <table>
                  <tbody>
                  <tr><td><font color="blue">Select Credential Org</font></td><td>&nbsp;&nbsp; Position: <input type="text" maxLength="5"  size="5" value={this.state.selectCredentialOrgPosition} onChange={this.selectOrgLocation.bind(this)}/></td></tr>
                  <tr><td><font color="blue">School Short Name</font></td><td><input type="text" maxLength="30"  size="32" value={this.state.selectCredentialOrgShortName}/></td></tr>
                  <tr><td><font color="blue">School Official Name</font></td><td><input type="text" maxLength="70"  size="72" value={this.state.selectCredentialOrgOfficialSchoolName} /></td></tr>
                  <tr><td><font color="blue">School Address</font></td><td><input type="text" maxLength="42"  size="50" value={this.state.selectCredentialOrgSchoolAddress}/></td></tr>
                  </tbody>
                </table>
                <button onClick={this.selectCredentialOrg.bind(this)}>Select CredentialOrg</button>
                </div>  
                <div>
                <table>
                  <tbody>
                  <tr><td><h3>Create Credential Org</h3></td><td></td></tr>
                  <tr><td><font color="blue">School Short Name</font></td><td><input type="text" maxLength="30"  size="32" value={this.state.createCredentialOrgShortName} onChange={this.createOrgShortNameChange.bind(this)} /></td></tr>
                  <tr><td><font color="blue">School Official Name</font></td><td><input type="text" maxLength="70"  size="72" value={this.state.createCredentialOrgOfficialSchoolName} onChange={this.createOrgOfficialNameChange.bind(this)} /></td></tr>
                  <tr><td><font color="blue">School Address</font></td><td><input type="text" maxLength="42"  size="50" value={this.state.createCredentialOrgSchoolAddress} onChange={this.createOrgSchoolAddress.bind(this)} /></td></tr>
                  </tbody>
                </table>
                <button onClick={this.createCredentialOrg.bind(this)}>Create Credential Org</button>
                </div>
              </div>
              <hr/>
              <h2>Credential Interaction Section</h2>
              <font color="red">Credential Count: {this.state.credentialCount}</font><br/>
              <div><h3>Select Credential by Position</h3>
                <table>
                  <tbody>
                  <tr><td><font color="red">Select Credential</font></td><td>&nbsp;&nbsp; Position: <input type="text" maxLength="5"  size="5" value={this.state.selectCredentialPosition} onChange={this.selectCredentialLocation.bind(this)}/></td></tr>
                  <tr><td><font color="red">Credential Level</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.selectCredentialLevel}/></td></tr>
                  <tr><td><font color="red">Credential Title</font></td><td><input type="text" maxLength="70"  size="72" value={this.state.selectCredentialTitle} /></td></tr>
                  <tr><td><font color="red">CredentialDivision</font></td><td><input type="text" maxLength="50"  size="55" value={this.state.selectCredentialDivision}/></td></tr>
                  </tbody>
                </table>
                <button onClick={this.selectCredential.bind(this)}>Select Credential</button>
              </div>
              <div><h3>Insert Credential</h3>
                <table>
                  <tbody>
                  <tr><td><font color="red">Credential Level</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.createCredentialLevel} onChange={this.createCredentialLeveChange.bind(this)}/></td></tr>
                  <tr><td><font color="red">Credential Title</font></td><td><input type="text" maxLength="70"  size="72" value={this.state.createCredentialTitle} onChange={this.createCredentialTitleChange.bind(this)}/></td></tr>
                  <tr><td><font color="red">CredentialDivision</font></td><td><input type="text" maxLength="50"  size="55" value={this.state.createCredentialDivision} onChange={this.createCredentialDivisionChange.bind(this)}/></td></tr>
                  <tr><td><font color="red">OrgAddress</font></td><td><input type="text" maxLength="42"  size="50" value={this.state.createcredentialOrgAddress} onChange={this.createcredentialAddressChange.bind(this)}/></td></tr>
                  </tbody>
                </table>
                <button onClick={this.createCredential.bind(this)}>Create Credential</button>
              </div>
              <hr/>
              <div>
                <h2>Applicant Interaction Section</h2>
                <font color="green">CredentialOrg Applicant Count: {this.state.applicantCount}</font>
              </div>
              <div>
                <h3>Select Applicant By Position</h3>
                <table>
                  <tbody>
                  <tr><td><font color="green">Select Applicant</font></td><td>&nbsp;&nbsp; Position: <input type="text" maxLength="5"  size="5" value={this.state.selectApplicantPosition} onChange={this.selectApplicantLocation.bind(this)}/></td></tr>
                  <tr><td><font color="green">OrgAddress</font></td><td><input type="text" maxLength="42"  size="50" value={this.state.selectApplicantAddress}/></td></tr>
                  <tr><td><font color="green">SSN</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.selectApplicantSSN}/></td></tr>
                  <tr><td><font color="green">CollegeID</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.selectApplicantCID}/></td></tr>
                  <tr><td><font color="green">First Name</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.selectApplicantFName}/></td></tr>
                  <tr><td><font color="green">Last Name</font></td><td><input type="text" maxLength="50"  size="32" value={this.state.selectApplicantLName}/></td></tr>
                  </tbody>
                </table>
                <button onClick={this.selectApplicant.bind(this)}>Select Credential</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App

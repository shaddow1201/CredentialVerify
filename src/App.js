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
      credentialOrgCount: null,
      credentialCount: null,
      isCredentialOrg : null,
      schoolShortName : null,
      officialSchoolName: null,
      schoolAddress : 0,
      detail : null,
      applicantZCount: null,
      credentialOrgFactoryContract: null,
      credentialFactoryContract: null,
      applicantFactoryContract: null,
      processApplicantContract: null,
      createCredentialOrgShortName: "",
      createCredentialOrgOfficialSchoolName: "",
      createCredentialOrgSchoolAddress: ""
    }
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
      //this.state.web3.eth.defaultAccount = accounts[0];
      credentialOrgFactory.deployed().then((instance) => {
        //this.state.web3.eth.defaultAccount = this.state.web3.eth.accounts[0];
        credentialOrgFactoryInstance = instance;
        // set the state of the contract
        this.setState({ credentialOrgFactoryContract: credentialOrgFactoryInstance}, this.credentialOrgFactoryDetail);
        var credentialOrgFactoryEvent = credentialOrgFactoryInstance.CredentialOrgEvent({schoolAddress: this.state.schoolAddress, account: accounts[0]});
        credentialOrgFactoryEvent.watch(function(err, result) {
          console.log("result.args");
          console.log (result.args);
          if (err) {
            console.log(err);
            return;
          }
          this.credentialOrgFactoryDetail(result.args.schoooAddress.c[0]);
          console.log("SchoolAddress is: " + result.args.schoolAddress.c[0])
          return this.setState({ schoolAddress: result.args.schoolAddress.c[0]});
        }.bind(this));

      }).then((result) => {
        // Update state with the result.
        credentialFactory.deployed().then((instance) => {
          credentialFactoryInstance = instance;
          // set the state of the contract
          return this.setState({ credentialFactoryContract: credentialFactoryInstance, account: accounts[0], accountCheckSummed: this.state.web3.toChecksumAddress(accounts[0])}, this.credentialFactoryDetail);
        }).then((result) => {
          //console.log(result);
          applicantFactory.deployed().then((instance) => {
            applicantFactoryInstance = instance;
            // set the state of the contract
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
                this.setState({ isCredentialOrg: "true" })
              } else {
                this.setState({ isCredentialOrg: "false"})
              }
              return credentialFactoryInstance.selectOrgCredentialCount(this.state.account) 
            }).then ((result) => {
              this.setState({ credentialCount: result.c[0]})
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

  createCredentialOrg(event){
    alert("Attempting Create");
    const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract
    var holder = this.state.web3.isAddress(this.state.createCredentialOrgSchoolAddress)
    if (holder){
      credentialOrgFactoryContract.createCredentialOrg(this.state.createCredentialOrgShortName, this.state.createCredentialOrgOfficialSchoolName, this.state.createCredentialOrgSchoolAddresst)
      .then(result => {
        alert(result);
        return credentialOrgFactoryContract.selectOrgCount()
      }).then ((result) => {
        alert(result)
        this.setState({credentialOrgCount: result.c[0]})

      })
    }
  }

  createOrgShortNameChange(event){
    //alert("change detected");
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
              <h1>Welcome to Credential Verify!</h1>
              <p>CurrentAccount isCredentialOrg: {this.state.isCredentialOrg}<br/>
              Total Credential Orgs: {this.state.credentialOrgCount}<br/>
              School ShortName: {this.state.schoolShortName}<br/>
              School Official Name: {this.state.officialSchoolName}<br/>
              SchoolAddress: {this.state.schoolAddress}<br/>
              Credential Count: {this.state.credentialCount}<br/>
              CredentialOrg Applicant Count: {this.state.applicantCount}</p>
              <table>
                <tbody>
                <tr><td>School Short Name</td><td><input type="text" maxLength="30"  size="32" value={this.state.createCredentialOrgShortName} onChange={this.createOrgShortNameChange} /></td></tr>
                <tr><td>School Official Name</td><td><input type="text" maxLength="70"  size="72" value={this.state.createCredentialOrgOfficialSchoolName} onChange={this.createOrgOfficialNameChange} /></td></tr>
                <tr><td>School Address</td><td><input type="text" maxLength="42"  size="50" value={this.state.createCredentialOrgSchoolAddress} onChange={this.createOrgSchoolAddress} /></td></tr>
                </tbody>
              </table>
              <button onClick={this.createCredentialOrg.bind(this)}>Create Credential Org?</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App

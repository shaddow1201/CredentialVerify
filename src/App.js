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
      shortName : null,
      schoolAddress : 0,
      detail : null,
      applicantZCount: null,
      credentialOrgFactoryContract: null,
      credentialFactoryContract: null,
      applicantFactoryContract: null,
      processApplicantContract: null
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
      credentialOrgFactory.deployed().then((instance) => {
        credentialOrgFactoryInstance = instance;
        // set the state of the contract
        this.setState({ credentialOrgFactoryContract: credentialOrgFactoryInstance}, this.credentialOrgFactoryDetail);
        var credentialOrgFactoryEvent = credentialOrgFactoryInstance.CredentialOrgEvent({schoolAddress: this.state.schoolAddress});
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
        //console.log(result);
        credentialFactory.deployed().then((instance) => {
          credentialFactoryInstance = instance;
          // set the state of the contract
          this.setState({ credentialFactoryContract: credentialFactoryInstance, account: accounts[0]}, this.credentialFactoryDetail);
  
        }).then((result) => {
          //console.log(result);
          applicantFactory.deployed().then((instance) => {
            applicantFactoryInstance = instance;
            // set the state of the contract
            this.setState({ applicantFactoryContract: applicantFactoryInstance}, this.applicantFactoryDetail);
  
          }).then((result) =>{
            //console.log(result);
            processApplicants.deployed().then((instance) => {
              processApplicantsInstance = instance; 
              // set the state of the contract
              this.setState({ processApplicantsContract: processApplicantsInstance}, this.processApplicantsDetail);
              // if use accounts[0] it fails. why?
              //return credentialOrgFactoryInstance.isCredentialOrg(this.state.account);
              return credentialOrgFactoryInstance.isCredentialOrg(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB);
            }).then((result) => {
              // Update state with the result.
              if (result){ 
                this.setState({ isCredentialOrg: "true" })
              } else {
                this.setState({ isCredentialOrg: "false"})
              }
              return credentialFactoryInstance.selectOrgCredentialCount(this.state.account) 
              //return credentialFactoryInstance.selectOrgCredentialCount(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB) 
            }).then ((result) => {
              this.setState({ credentialCount: result.c[0]})
              //return applicantFactoryInstance.selectOrgApplicantCount(this.state.account)
              return applicantFactoryInstance.selectOrgApplicantCount(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB)
            }).then ((result) => {
              //alert(result.c[0])
              return this.setState({applicantCount: result.c[0]})
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

  Check(event){
    //const credentialOrgFactoryContract = this.state.credentialOrgFactoryContract
    //const account = this.state.account
    
    //credentialOrgFactoryContract.createCredentialOrg("TESTINSERT", "TESTSCHOOLNAME", "0x839c18df17236382f8832d9Ab5ef3FaCAFBAC891" )
    //.then(result => {
    //  alert(result);
    //  //return this.setState({applicantCount: result.c[0]})
    //})
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

              <p>CurrentAccount isCredentialOrg: {this.state.isCredentialOrg}</p>
              <p>Credential Count: {this.state.credentialCount}</p>
              <p>CredentialOrg Applicant Count: {this.state.applicantCount}</p>

              <button onClick={this.Check.bind(this)}>CredentialOrg?</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
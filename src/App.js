import React, { Component } from 'react'
import CredentialOrgFactoryContract from '../build/contracts/CredentialOrgFactory.json'
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
      contract: null,
      account: null,
      credentialOrgCount: null,
      isCredentialOrg : null
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
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const credentialOrgFactory = contract(CredentialOrgFactoryContract)
    credentialOrgFactory.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on CredentialOrgFactory.
    var credentialOrgFactoryInstance
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      credentialOrgFactory.deployed().then((instance) => {
        //credentialOrgFactory.
        credentialOrgFactoryInstance = instance
        //var util = require('web3-utils');
        // calls isCredentialOrg function (returns true/false)
        //return credentialOrgFactoryInstance.isCredentialOrg(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB)

        return credentialOrgFactoryInstance.isCredentialOrg(accounts[0]);
      }).then((result) => {
        // Update state with the result.
        console.log(result);
        if (result){
          return this.setState({ isCredentialOrg: "true", contract: credentialOrgFactoryInstance, account: accounts[0] })
        } else {
          return this.setState({ isCredentialOrg: "false", contract: credentialOrgFactoryInstance, account: accounts[0] })
        }
      })

    })
  }

  handleClick(event){
    const contract = this.state.contract
    const account = this.state.account
    
    contract.isCredentialOrg(0x5a186B7FeC36909678211F69beB67EC3b1E4fFBB)
    //contract.isCredentialOrg(account.toString())
    .then(result => {

      alert(result);
      if (!result){
        //contract.createCredentialOrg("Test", "Test", account) 
        alert(account);        
        return this.setState({isCredentialOrg: "false" })
      } else {
        return this.setState({isCredentialOrg: "true" })
      }
      
    })

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

              <button onClick={this.handleClick.bind(this)}>CredentialOrg?</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App

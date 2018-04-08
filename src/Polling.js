import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import getWeb3 from './utils/getWeb3'
import VoteStorageContract from '../build/contracts/VoteSafe.json'


export default class Polling extends React.Component {

  constructor (props) {
    super(props)

    this.state={
      title:'',
      web3:null,
      userVerified:false,
      options:[],
      aadharNum:'',
      otp:'',
      verifyEnabled:false,
      otpEnabled:false,
      generatedOTP:'',
      voteSelected:-1
     }

    _.bindAll(
        this,
        [
          'verifyMe',
          'handleSubmit',
          'handleAadharChange',
          'verifyOTP',
          'handleOtpChange',
          'handleVoteSelected',
          'sendOTP'
      ]
    )
  }

  componentWillMount() {
     getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

    const contract = require('truffle-contract')
    const voteStorage = contract(VoteStorageContract)
    voteStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on voteStorage.
    var voteStorageInstance
    var title
    var self=this

    this.state.web3.eth.getAccounts((error, accounts) => {
      voteStorage.deployed().then((instance) => {
        voteStorageInstance = instance
        return voteStorageInstance.GetPollTitle.call();
      }).then((result) => {
              title=result         
              return voteStorageInstance.GetPollOptions.call();
          }).then((result) => {
            let rows=[]
            var ops = result.split('|')
            ops.forEach((o, i) => {
                const row1={'value':o}
                rows.push(row1)
              })
            self.setState({title:title,options:rows})     
      })
    })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleAadharChange(evt){
    //Checking if input value is a Numer 
    let val=evt.target.value
    let len=val.length
    if(Number(val) && len <10)
    {
      this.setState({aadharNum:evt.target.value,
                     verifyEnabled:len===9 ? true:false})
    }    
  }
  handleOtpChange(evt){
    this.setState({otp:evt.target.value})
  }
 
  verifyMe(evt){
    var self = this;
    const contract = require('truffle-contract')
    const voteStorage = contract(VoteStorageContract)
    voteStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on voteStorage.
    var voteStorageInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      voteStorage.deployed().then((instance) => {
        voteStorageInstance = instance
        return voteStorageInstance.IsFirstVisit.call(this.state.aadharNum,{from: accounts[0]})
      }).then((result) => {
          if(result===true){
            self.sendOTP(self)               
          }
          else {
           window.alert("You have already castes your vote !!");
           location.reload();
          }
      })
    })
  }
  verifyOTP(evt){
    //verify otp with backend
    if(Number(this.state.otp)===this.state.generatedOTP)
    {
      this.setState({userVerified:true,otpEnabled:false})
    }
    else {
      window.alert("Invalid OTP !!")
    }    
  }
  sendOTP(self){
     axios.get('./api/generateOTP')
        .then(function (response) {
          const otp=response.data
         self.setState({generatedOTP:otp})
        })
        .catch(function (error) {
          console.log(error);
        });

    self.setState({otpEnabled:true})
  }
  handleSubmit(evt){
    const contract = require('truffle-contract')
    const voteStorage = contract(VoteStorageContract)
    voteStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on voteStorage.
    var voteStorageInstance
    var self=this

    this.state.web3.eth.getAccounts((error, accounts) => {
      voteStorage.deployed().then((instance) => {
        voteStorageInstance = instance
        return voteStorageInstance.AddNewVote(self.state.voteSelected,self.state.aadharNum,{from: accounts[0]})
      }).then((result) => {              
              console.log("vote is casted")
              window.alert("Your vote is casted successfully !!")
              location.reload();
          })
  })}
  handleVoteSelected (evt){
    this.setState({voteSelected:evt.target.id})
  }

render(){
  let rows=[]


  this.state.options.forEach((o, i) => {
    const row1=(
        <div key={i} id={i} className="form-check textLeft" onClick={this.handleVoteSelected}>
            <input   className="form-check-input" type="radio" name="gridRadios" id={i} />
            <label   className="form-check-label labels">
                {o.value}
            </label>
        </div>       
    )
    rows.push(row1)
  })

return(
  <header className="masthead text-white text-center">
      <div className="overlay"></div>
      <div className="margin-top30px"/>      
      <div className="container">
          <div>
            <h1 className="header"> {'Welcome to Polling '} </h1>
          </div>
          {this.state.userVerified  ?
            <div className="margin-top100px">
            <h1 className="header textLeft"> {this.state.title} </h1>
            </div>:
            <div>
              <h1 className="header"> {'Please verify your Identity !!'} </h1>
            </div>
          }
           <div className="margin-top30px"/>
          {(this.state.otpEnabled || this.state.userVerified) ?null:
          <div className="form-group row alignCenter">
                  <label className="col-md-4 labels">{"Enter your 9 digit Aadar Number"}</label>
                  <input
                   type='number'
                   className="col-md-5 form-control form-control-lg"                   
                   value={this.state.aadharNum}
                   onChange={this.handleAadharChange}/>
                   <div className="col-md-1"/>
                   <button 
                        type="submit" 
                        className="btn  btn-lg btn-primary col-md-2"
                        onClick={this.verifyMe}
                        disabled={!this.state.verifyEnabled}>
                        VerifyMe
                    </button>
          </div>
          }
          {(this.state.otpEnabled && !this.state.userVerified) ?
            <div className="form-group row alignCenter">
                  <label className="col-md-4 labels">{"Enter OTP"}</label>
                  <input
                   type='number'
                   className="col-md-5 form-control form-control-lg"                   
                   value={this.state.otp}
                   onChange={this.handleOtpChange}/>
                   <div className="col-md-1"/>                   
                   <button 
                        type="submit" 
                        className="btn  btn-lg btn-primary col-md-2"
                        onClick={this.verifyOTP}>
                        Verify OTP
                    </button>
          </div>:null
          }

          {this.state.userVerified  ?
            <div >
                <div className="margin-top30px"/>
                    <div className="form-group col-md-12">
                        {rows}
                    </div>                                
                    <div className="margin-top30px"/>
                    <div className="form-group row">
                    <div className="col-md-2">
                    <button 
                        type="submit" 
                        className="btn btn-block btn-lg btn-primary"
                        onClick={this.handleSubmit}>
                        VOTE
                    </button>
                    </div>
                    </div>
            </div> : null
          }
        </div>
    </header>
)
}}


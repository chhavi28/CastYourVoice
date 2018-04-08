import _ from 'lodash'
import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import VoteStorageContract from '../build/contracts/VoteSafe.json'
import getWeb3 from './utils/getWeb3'

export default class Manager extends React.Component {

  constructor (props) {
    super(props)

    this.state={
      startDate: moment(),
      endDate: moment().add(1, 'days'),
      title:'',
      options: [{'id':0,value:''}],
      storageValue: 0,
      web3: null,
      txnDone:false
     }

    _.bindAll(
        this,
        [
          'handleStartDate',
          'handleEndDate',
          'handleTitleChange',
          'handleOptionChange',
          'handleSubmit' ,
          'handleKeyPressOptions'
      ]
    )
  }


  instantiateContract() {
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

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      voteStorage.deployed().then((instance) => {
        voteStorageInstance = instance

      }).then((result) => {
        const title=this.state.title
        const options = this.state.options.map(op => op.value).join('|')
        // Get the value from the contract to prove it worked.
         const op= voteStorageInstance.AddPollOptions(options,title,{from: accounts[0]})
         console.log(op)
         window.alert("Pole is created successfully !!")  
         location.reload()     
      })
    })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
 
  handleTitleChange(evt){
    this.setState({title:evt.target.value})
  }
  handleOptionChange(evt){
    let objList=this.state.options
    objList[Number(evt.target.id)].value=evt.target.value
    this.setState({options:objList})
  }
  handleKeyPressOptions(evt){
    let objList=this.state.options
    if(evt.key==="Enter"){      
      const len=objList.length -1
      if(Number(evt.target.id)===len){
        objList.push({'id': len+1,'value':''})        
      }
    }
    this.setState({options:objList})
  }
  handleStartDate(date){
    this.setState({startDate:date})
  }
  handleEndDate(date){
    this.setState({endDate:date})
  }
  handleSubmit(evt){
    this.instantiateContract()
  }

render(){
  let rows=[]


  this.state.options.forEach((o, i) => {
    const row1=(
      <input id={o.id} 
        key={o.id} 
        className="form-control form-control-lg" 
        placeholder="Enter your option..."
        onChange={this.handleOptionChange}
        onKeyDown={this.handleKeyPressOptions}
        value={o.value}/>    
    )
    rows.push(row1)
  })

return(
  <header className="masthead text-white text-center">
      <div className="overlay"></div>
      <div className="margin-top30px"/>      
      <div className="container">
          <div>
            <h1 className="header"> Design your Poll !! </h1>
          </div>

          <div className="margin-top50px"/>


          <div  className="container-fluid" >
                <div className="form-group row alignCenter">
                  <label className="col-md-2 labels">{"Title"}</label>
                  <input
                   className="col-md-10 form-control form-control-lg" 
                   placeholder="Enter Poll title .."
                   value={this.state.title}
                   onChange={this.handleTitleChange}/>
                </div>
                <div className="form-group row alignCenter">
                  <div className="col-md-2 labels">{'Options'}</div>
                  <div className="col-md-10 form-control">
                    {rows}
                   
                  </div>
                </div>
                <div className="form-group row alignCenter">
                  <div className="col-md-2 labels">{'Start Date'}</div>
                  <div className="col-md-4">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleStartDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="LLL"
                    timeCaption="time" />
                  </div>
                </div>
                <div className="form-group row alignCenter">
                  <div className="col-md-2 labels">{'End Date'}</div>
                  <div className="col-md-4">
                  <DatePicker
                  selected={this.state.endDate}
                  onChange={this.handleEndDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="LLL"
                  timeCaption="time" /> 
                  </div>
                </div>
                <div className="form-group row alignCenter">
                  <label className="col-md-2 labels">{"Voter Access"}</label>
                  <div className="form-group row">
                  <div className="form-check">
                      <input   className="form-check-input" type="radio" name="gridRadios"  />
                      <label   className="form-check-label labels">
                          {'Aadhar'}
                      </label>
                  </div>
                  <div className="form-check marginLeft20px">
                      <input   className="form-check-input " type="radio" disabled="true" name="gridRadios"  />
                      <label   className="form-check-label labels">
                          {'E-mail'}
                      </label>
                  </div> 
                  <div className="form-check marginLeft20px">
                      <input   className="form-check-input " type="radio"  disabled="true" name="gridRadios"  />
                      <label   className="form-check-label labels">
                          {'Unique Codes'}
                      </label>
                  </div>  
                  </div>

                </div>
                <div className="margin-top30px"/>
                <div className="form-group row">
                  <div className="col-md-3">
                  <button 
                    type="submit" 
                    className="btn btn-block btn-lg btn-primary"
                    onClick={this.handleSubmit}>
                    SUBMIT
                  </button>
                  </div>
                </div>
        </div>
      </div>
    </header>
)
}}


import React from 'react'
import PieChart from "react-svg-piechart"
import BarChart from "react-svg-bar-chart"
import getWeb3 from './utils/getWeb3'
import VoteStorageContract from '../build/contracts/VoteSafe.json'


export default class Analysis extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      web3: null,
      options:[],
      values:[],
      isLoading:true
     }
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

    var voteStorageInstance
    var options
    var self=this
    var values=[]

    this.state.web3.eth.getAccounts((error, accounts) => {
      voteStorage.deployed().then((instance) => {
        voteStorageInstance = instance
        return voteStorageInstance.GetPollOptions.call();
      }).then((result) => {


              let rows=[]
            var ops = result.split('|')
            ops.forEach((o, i) => {
                const row1=o
                rows.push(row1)
              })
            options=rows
            var promises=[]

           options.forEach((o,i)=>{
           	let itr=i
           	 promises.push(voteStorageInstance.GetVotePerOption.call(i,{from: accounts[0]})
           	 			.then((result)=>{
           	 				values[itr]=Number(result)
           	 			}))
           })
           Promise.all(promises).then(() =>
			    self.setState({values:values,options:options,isLoading:false})
			);
          })
    })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
 

render(){

let dataArr=[]
let dataBar=[]
let pieLabel=[]
let barLabel=[]
const values=this.state.values

this.state.options.forEach((o, i) => {
	const count=(i+1)%15
	const color='#'+count+'b3'+count+'37'
	let data ={'title':o,'value':values[i],'color':color}
	dataArr.push(data)
	pieLabel.push(
			<div key={i} style={{ color: color,fontWeight:'bolder',display:'inline-flex',marginRight:10}}>
			<div style={{height:10,width:10,display:'block',color:color,background:color,marginRight:5}}></div>
			<label>{' '+o +' '}</label>
			</div>)
	dataBar.push({'x':i,'y':values[i]})
	barLabel.push(
			<div key={i} style={{fontWeight:'bolder',display:'inline-flex',marginRight:15,color:'black'}}>			
			<label>{i+' - '+o}</label>
			</div>)
})

return(
  <header className="masthead text-white text-center">
      <div className="overlay"></div>
      <div className="margin-top30px"/>      
      <div className="container">
          <div>
            <h1 className="header"> Analyze your Poll !! </h1>
          </div>

          <div className="margin-top100px"/>


          <div  className="container-fluid" >

		   
		   {this.state.isLoading || this.state.options.length <2 ? null: 
		   	<div className="row alignCenter">
		   		<div className="col-md-6">
			   	<div className="pieStyle">
		           <PieChart
					    data={dataArr}
					    viewBoxSize={100}/>
				</div>
				<div className="marginTop10px"/>
				<div className="row style={{marginLeft:10}}">
		            {pieLabel}
		        </div>
		        </div>
		        <div className="col-md-6">
			      <div className="barStyle">
			         <BarChart
						    data={dataBar}/>
				 </div>
				 <div className="row" style={{marginLeft:10}}>
			            {barLabel}
			     </div>
		        </div>
           </div>
       	   }           
                
        </div>
      </div>
    </header>
)
}}


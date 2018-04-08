import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Manager from './Manager'
import Polling from './Polling'
import Analysis from './Analysis'

render(
  <BrowserRouter>
  <div>
  <Route exact path='/' component={Manager}/>
  <Route path='/polling' component={Polling}/>
  <Route path='/analysis' component={Analysis}/>
  </div>
</BrowserRouter>,
  document.getElementById('root')
)

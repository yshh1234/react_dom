import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory} from 'react-router'
import Main from './Main'
import page1 from './page1'
import page2 from './page2'
import page3 from './page3'
import '../../common/commonAll'

render((
  <Router history={hashHistory}>
    	<Route path="/" component={Main}/>
	    <Route path="/page1" component={page1}/>
	    <Route path="/page2" component={page2}/>
	    <Route path="/page3" component={page3}/>
  </Router>
), document.getElementById('app'))
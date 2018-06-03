import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,IndexRoute,browserHistory} from 'react-router';
import $ from 'jquery';

import Layout from './components/Layout';
import {initJQueryAjaxCSRF} from '../modules/utils';

$(document).ready(() => {
  initJQueryAjaxCSRF();

  let H = $('body').height();
  setTimeout(() => {
    $('#box-wrapper, #sidebar-menu, #box-content').css('height', H - 59);
  }, 0);
  $(window).resize(() => {
    let H = $('body').height();
    $('#box-wrapper, #sidebar-menu, #box-content').css('height', H - 59);
  });

  class App extends React.PureComponent{
    constructor(props) {
      super(props);
    }
    render(){
      return(
        <div>
          {this.props.children}
        </div>
      )
    }
  }
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Layout}/>
        <Route path="/superset/dashboard/:id/" component={Layout}/>
      </Route>
    </Router>
  ),document.getElementById('box-wrapper'));
});

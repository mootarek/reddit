import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD } from '../constants/actiontypes';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { history } from '../store'
import Home from './Home'
import Board from './Board'
import Thread from './Thread'

// take some commons 

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: APP_LOAD, payload, skipTracking: true }),
});

class App extends React.Component {

  render() {
    return (
      <div>
        <Router history={history} >
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/b/:board/threads" component={Board} />
            <Route path="/b/:board/:thread_id" component={Thread} /> 
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(() => { }, mapDispatchToProps)(App);





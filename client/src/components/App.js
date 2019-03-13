import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import SurveyThanks from './Thanks';

const Dashboard = () => <h2> Dashboard </h2>;
const SurveyNew = () => <h2> SurveyNew </h2>;

class App extends Component {
  componentDidMount() {
    // when the root component mount, we dispatch fetchUser action to see if a user is logged-in
    // to get access to the fetchUser's dispatch, we use connect(mapStateToProps, mapDispatchToProps)(component) to connect our App component and redux
    this.props.fetchUser();
  }

  render() {
  // when ever react router decides what set of components to show on the screen,
  // It's going to take the current URL and then try to match every single route and every single path to the current URL
  // if we only want the exactly same url, then add exact = true in Route state
  // in JSX, exact={true} is equal to exact
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            {/* header will always be displayed no matter what because it's not tied to any specific path configuration */ }

            <Route exact path="/" component={Landing} />
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
            <Route path="/surveys/thanks" component={SurveyThanks} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
// connect(mapStateToProps, mapDispatchToProps)(component)
// will assign "redux's state" and our "actions dispatch" to App's props

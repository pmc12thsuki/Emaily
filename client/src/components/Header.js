import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prefer-stateless-function
class Header extends Component {
  renderContent() {
    let status;
    switch (this.props.auth) {
      case null:
        status = null; // return nothing
        break;
      case false:
        status = <li><a href="/auth/google">Login With Google</a></li>;
        break;
      default:
        status = <li><a href="/api/logout">Logout</a></li>;
    }
    return status;
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="row">
            <div className="col s12">
              <Link
                to={this.props.auth ? '/surveys' : '/'}
                className="left brand-logo"
              >
                Emaily
              </Link>
              <ul className="right">
                {this.renderContent()}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

// 從 redux 維護的 global state 中，取出我們要的 object (auth)，並當作 prop 傳給這個 component (Header)
function mapStateToProps({ auth }) {
  return { auth };
}
// same as above
// function mapStateToProps(state) {
//   return { auth: state.auth };
// }

export default connect(mapStateToProps)(Header);
// 如果沒有第二個參數 mapDispatchToProps，就傳入第一個參數就好

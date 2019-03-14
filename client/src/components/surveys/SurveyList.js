import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveys() {
    return this.props.surveys.map((survey, index) => {
      return (
        <div className="card darken-1" key={index}>
          <div className="card-content">
            <span className="card-title">{ survey.title }</span>
            <p>{ survey.body }</p>
            <p className="right">Sent On: { new Date(survey.dateSent).toLocaleDateString() }</p>
          </div>
        <div className="card-action">
          <a>Yes: { survey.yes }</a>
          <a>No: { survey.no }</a>
        </div>
      </div>
      )
    })
  }

  render() {
    return (
      <div style={{ margin: "20px 0 0 0" }}>
        { this.renderSurveys() }
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    surveys: state.surveys,
  }
}
export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
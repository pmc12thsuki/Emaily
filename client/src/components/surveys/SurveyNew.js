import React, { Component } from 'react';
import SurveyForm from './SurveyForm';
import { reduxForm } from 'redux-form';
import SurveyFormReview from './SurveyFormReview';

// SurveyNew shows SurveyForm and SurveyFormReview
class SurveyNew extends Component {
  // 創造一個（傳統的） component state 來決定要 render surveyForm 或 surveyFormReview
  /*
  正常來說，創造 component state 要用以下的 code
  constructor(props) {
    super(props);
    this.state = { showFormReview: false };
  }
  但因為我們使用 CRA，其中一個功能就是可以把上述的 code 簡寫成下面那一行
  */
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return <SurveyFormReview onCancel={() => this.setState({ showFormReview: false })} />;
    }
    return <SurveyForm onSurveySubmit={() => this.setState({ showFormReview: true })}/>;
  }

  render() {
    return (
      <div style={{margin: '30px 10px'}}>
        {this.renderContent()}
      </div>
    )
  }
};

export default reduxForm({
  // 用一個 trick 讓 reduxForm 在離開 surveyNew 這個頁面時，會把 surveyForm 中的資料清空。 
  // 由於 SurveyForm 跟 FormReview 交換時都在 surveyNew 底下，所以不會把資料清空。但只要離開 surveyNew 就會被清空
  form: 'surveyForm', 
})(SurveyNew);

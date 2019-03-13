import React from 'react';
import { connect } from 'react-redux'; // 要拿出 redux-form 存在 redux store 的東西，我們仍然可以用原先的 connect 方式
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const SurveyFormReview = (props) => {
  const { onCancel, formValues, submitSurvey, history } = props;
  const reviewFields = formFields.map((field, index) => {
    return (
      <div key={index}>
        <label>{field.label}</label>
        <div>{formValues[field.name]}</div>
      </div>
    )
  })
  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button className='yellow darken-3 white-text btn-flat' style={{ margin:'20px 0' }} onClick={() => onCancel()}>
        Back <i className="material-icons right">arrow_back</i>   
      </button>
      <button className='green white-text btn-flat right' style={{ margin:'20px 0' }} 
              onClick={() => submitSurvey(formValues, history) } > 
              {/* 把 history 也傳給 action creator，這樣才能在 action 完成之後 redirect 頁面 */}
        Send Survey <i className="material-icons right">email</i>   
      </button>
    </div>
  )
}



function mapStateToProps(state) {
  return {
    formValues: state.form.surveyForm.values // 拿出 form 底下的 surveyForm 的資料，放進 props 中給這個 component
  }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
// withRouter 讓 surveyFormReview 可以知道 react app 中的 route history. withRoter 把 match, location, histor 這三個參數傳給 component 的 props
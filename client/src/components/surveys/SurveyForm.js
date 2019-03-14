import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

// SurveyForm shows a form for a user to add input
class SurveyForm extends Component {
  render() {
    return (
      <div>
        {/* this.props.handleSubmit 是一個 reduxForm 加在這個 component 上的 function，可以在我們 submit form 時把填寫的 value 都抓出來 */}
        <form onSubmit={this.props.handleSubmit(() => this.props.onSurveySubmit())}>
          {this.renderFields()}
          <Link to='/surveys' className="red  darken-1 btn-flat white-text"> Cancel </Link>
          <button className="teal btn-flat right white-text" type="submit"> Next <i className="material-icons right">arrow_forward</i> </button>
        </form>
      </div>
    )
  }

  renderFields() {
    return (
      <div>
        {/* Field component 就是 HTML 中各種 input，例如下面設定這個 field 是一個 text input，且他的 input 值要在 redux store 裡面叫作 title */ } {
        /* 如果想要自己定義 Field，就在 component 那邊傳入自定義的 react component, 如 surveyField */ }
        {/* < Field label="Survey Title" type = "text" name = "title" component={SurveyField} /> */}
        {formFields.map((field, key) => <Field key={key} label={field.label} type = "text" name={field.name}  component={SurveyField} /> )}
      </div>
    )
  }
};

function validate(values) {
  // 表單一 render 就會檢查了，而不是在要 submit 才檢查
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  formFields.forEach(({ name }) => {
    if(!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });




  return errors;
  // if we return an empty object, then reduxForm will assume there is no error in user's input
  // if there is a error property which match the Field name, reduxForm will pass this error to the relating Field
}

// reduxForm 的功能就像 redux 中的 connect 一樣，可以把這個 component 跟 redux 結合在一起
// reduxForm 只接受一個 argument
export default reduxForm({
  validate, // give reduxForm a validate function, so reduxForm will use it to validate our intput
  form: 'surveyForm', // 把這個表單 parse 出來的資料，存在 redux 的 store 中的 form.surveyForm 底下，以免一個 project 有多個 form
  destroyOnUnmount: false, // true on default. but we want to keep the user's input when user back from SurveyFormReview
})(SurveyForm);

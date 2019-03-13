import React from 'react';


export default ({ input, label, meta }) => { // meta 是 reduxForm 自動傳進這個 Field 裡的，裡面包含了跟這個 Field 相關的資訊，以及 error message
  return (
    <div>
      <label>{label}</label>
      {/* 使用 Field 傳進來的一些 function */}
      <input {...input} style={{ marginBottom: '5px'}}></input>

      <div className="red-text" style={{ marginBottom: '20px'}}>
        {meta.touched && meta.error}
        {/* touched 屬性告訴我們使用者是否有 cliked 過該 Field。如果不加上這個判斷，則一開市就會顯現出 error message */}  
      </div>
      
    </div>
  );
};
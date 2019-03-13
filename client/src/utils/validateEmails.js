const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// search for reg email for different coding language from http://emailregex.com/

export default (emails) => {
  const invalidEmails = emails.split(',').map(email => email.trim()).filter(email => email.length && re.test(email) === false);
  // use filter to find out the 'not valid' email which return false in the regex test

  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`
  }

  return;
}


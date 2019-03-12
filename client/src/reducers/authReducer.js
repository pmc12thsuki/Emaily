import { FETCH_USER } from '../actions/types';

export default function (state = null, action) { // apply default state here
  // we use default state as null to show that we do not know if the user has logged-in
  switch (action.type) {
    case FETCH_USER:
      // if action.payload is empty string, then return false, else return action.payload
      return action.payload || false;
    default:
      return state;
  }
}

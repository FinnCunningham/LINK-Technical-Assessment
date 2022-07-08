import { combineReducers } from 'redux';

const INITIAL_STATE = {
  token: "",
  page: "",
  name: ""
};

const ReduxReducer = (state = INITIAL_STATE, action) => {
  let newState = {};
  let {token, page, name} = {...state};
  switch (action.type) {
    case 'SET_TOKEN':
      token = action.payload;
      newState = { token, page, name };
      return newState;
    case 'SET_PAGE':
      page = action.payload;
      newState = { token, page, name };
      return newState;
    case 'SET_NAME':
      name = action.payload;
      newState = { token, page, name };
      return newState;
    default:
      return state
  }
};

export default combineReducers({
  reducer: ReduxReducer
});
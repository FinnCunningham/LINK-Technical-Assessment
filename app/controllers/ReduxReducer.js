import { combineReducers } from 'redux';

const INITIAL_STATE = {
  token: "",
  page: ""
};

const ReduxReducer = (state = INITIAL_STATE, action) => {
  let newState = {};
  let {token, page} = {...state};
  switch (action.type) {
    case 'SET_TOKEN':
        // const {token} = state;
        // console.log(action.payload)
        
        token = action.payload;

        // Finally, update the redux state
        newState = { token, page };
  
      return newState;

    case 'SET_PAGE':
      // console.log("SETTING PAGE TO" + action.payload)
      page = action.payload;
      // console.log("PAYLOAD=" + action.payload)
      newState = { token, page };
      return newState;
    default:
      return state
  }
};

export default combineReducers({
  reducer: ReduxReducer
});
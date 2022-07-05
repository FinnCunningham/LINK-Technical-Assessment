import { combineReducers } from 'redux';

const INITIAL_STATE = {
  token: ""
};

const ReduxReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
        // const {token} = state;
        console.log(action.payload)
        let token = action.payload;

        // Finally, update the redux state
        const newState = { token };
  
      return newState;
    default:
      return state
  }
};

export default combineReducers({
  reducer: ReduxReducer
});
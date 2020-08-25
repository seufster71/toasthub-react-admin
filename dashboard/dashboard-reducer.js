import reducerUtils from '../../core/common/reducer-utils';

export default function dashboardReducer(state = {}, action) {
  let myState = {};
  switch(action.type) {
    case 'LOAD_INIT_STATS': {
    	if (action.responseJson != null && action.responseJson.params != null) {
    	    return Object.assign({}, state, {
    	      itemCount: reducerUtils.getItemCount(action)
    	    });
    	  } else {
    	    return state;
    	  }
    }
    default:
      return state;
  }
}


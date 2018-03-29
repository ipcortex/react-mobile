const initialCommsState = {
  calls: {
    pendingDial: false,
    activeCall: false
  }
}

export const actions = {
  Dial: 'REQUEST_DIAL',
  DialSucceeded: 'DIAL_SUCCESS',
  DialFailed: 'DIAL_FAILED' // In case we want to add error messages to the state at some point
};

export default function commsReducer(state = initialCommsState, action) {
  switch (action.type) {
    case actions.Dial:
      console.log('Dialing', action.number);
      return {
        ...state,
        calls: {
          ...state.calls,
          pendingDial: action.number
        }
      };
    case actions.DialSucceeded:
      return {
        ...state,
        calls: {
          pendingDial: false,
          activeCall: action.call
        }
      };
    case actions.DialFailed:
      return {
        ...state,
        calls: {
          pendingDial: false,
          ...state.calls
        }
      };
    default:
        return state;
  }
}


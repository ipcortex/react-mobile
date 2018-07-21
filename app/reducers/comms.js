const initialCommsState = {
  calls: {
    pendingDial: null,
    activeCall: false,
    inboundAction: null
  }
}

export const actions = {
  Dial: 'REQUEST_DIAL',
  DialSucceeded: 'DIAL_SUCCESS',
  DialFailed: 'DIAL_FAILED', // In case we want to add error messages to the state at some point
  AcceptCall: 'ACCEPT_CALL',
  RejectCall: 'REJECT_CALL',
  clearAcceptReject: 'CLEARACCEPT_REJECT_CALL'
};

export default function commsReducer(state = initialCommsState, action) {
  console.log('Action: ', action);
  switch(action.type) {
  case actions.Dial:
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
        ...state.calls,
        pendingDial: false,
      }
    };
  case actions.AcceptCall:
    console.log('Acceptcall', state.calls, {})
    return {
      ...state,
      calls: {
        ...state.calls,
        inboundAction: 'talk',
      }
    };
  case actions.RejectCall:
    return {
      ...state,
      calls: {
        ...state.calls,
        inboundAction: 'hangup',
      }
    };
    case actions.clearAcceptReject:
      return {
        ...state,
        calls: {
          ...state.calls,
          inboundAction: null,
        }
      };
  default:
    return state;
  }
}

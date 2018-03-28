const initialContactsState = [];

export const actions = {
  AddContacts: { type: 'ADD_CONTACTS' }
};

export default function contactsReducer(state = initialContactsState, action) {
  let newState;
  switch (action.type) {
    case actions.AddContacts.type:
      newState = [...state, ...action.contacts];
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}


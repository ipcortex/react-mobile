const initialContactsState = [];

export const actions = {
  AddContacts: 'ADD_CONTACTS',
  UpdateContact: 'UPDATE_CONTACT'
};

export default function contactsReducer(state = initialContactsState, action) {
  let newState;
  switch (action.type) {
    case actions.AddContacts:
      newState = state.concat(action.contacts);
      newState.sort(function (a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      break;
    case actions.UpdateContact:
      newState = state.map(contact => 
        (contact.key == action.contact.key ? action.contact : contact));
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}


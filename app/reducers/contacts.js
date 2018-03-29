const initialContactsState = [];

export const actions = {
  AddContacts: 'ADD_CONTACTS',
  UpdateContact: 'UPDATE_CONTACT',
  DeleteContact: 'DELETE_CONTACT'
};

export default function contactsReducer(state = initialContactsState, action) {
  let newState;
  switch (action.type) {
    case actions.AddContacts:
      newState = sortContacts(state.concat(action.contacts));
      break;
    case actions.UpdateContact:
      let updated = false;
      newState = state.map(contact => {
        if (contact.key == action.contact.key) {
          updated = true;
          return action.contact;
        } else {
          return contact;
        }
      });
      if (!updated) {
        newState.push(action.contact);
        sortContacts(newState); // Move this outside if we want to re-sort after a contact renaming
      }
      break;
    case actions.DeleteContact:
      const deleteIndex = state.findIndex(c => c.key == action.key);
      newState = state;
      if (deleteIndex > 0)
        newState.splice(deleteIndex, 1);
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}

function sortContacts(contacts) {
  return contacts.sort(function (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}


const initialContactsState = [];

export const actions = {
	AddContacts: 'ADD_CONTACTS',
	FilterContacts: 'FILTER_CONTACTS',
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
				return Object.assign({}, contact, action.contact);
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
	case actions.FilterContacts:
		let pattern;
		if (action.name)
			pattern = new RegExp(action.name, 'ig');
		newState = state.map((contact) => {
			var hide = action.name &&
				action.name.length > 0 &&
				(contact.name + contact.number + contact.company)
				.match(pattern) == null;
			if (contact.hide !== hide)
				// Must replace, not just mutate current. Crying at the inefficiency of this.
				return Object.assign({}, contact, { hide: hide });
			else {
				return contact;
			}
		})
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

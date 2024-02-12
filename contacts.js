const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const contactById = contacts.find(({ id }) => id === contactId);

    if(!contactById) {
        return null;
    }

    return contactById;
}

async function updateContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { id: v4(), name: name, email: email, phone: phone };

    contacts.push(newContact);
    await updateContacts(contacts);

    return newContact;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const idx = contacts.findIndex(({ id }) => id === contactId);

    if (idx === -1) {
        return null;
    }

    const [removedContact] = contacts.splice(idx, 1);
    await updateContacts(contacts);

    return removedContact;
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
};

const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const res = contacts.find((contact) => contact.id === contactId.toString());
  if (!res) {
    return null;
  }
  return res;
}

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(
    (contact) => contact.id === contactId.toString()
  );
  if (index === -1) {
    console.log("No such contact");
  }
  const [res] = contacts.splice(index, 1);
  await updateContacts(contacts);
  console.log(`Success! Contact ${res.name} removed from list.`);
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  console.log(`Success! Contact ${newContact.name} added to list.`);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

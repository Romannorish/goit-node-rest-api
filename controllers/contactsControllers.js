import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import * as contactsServices from '../services/contactsServices.js';
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res) => {
    const contacts = await contactsServices.listContacts();
  return res.json(contacts);
};

export const getOneContact = async (req, res) => {
   const id = req.params.id;
   const contact = await contactsServices.getContactById(id)
   if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.json(contact);
};


export const deleteContact = async (req, res) => {
    const  id  = req.params.id;
    const contact = await contactsServices.removeContact(id)
    if (!contact) {
        return res.status(404).json({ message: 'Not found' });
    }   return res.json(contact);
};


export const createContact = async (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
}

const { error } = createContactSchema.validate(contact, {abortEarly: false})

if(error) {
    return res.status(400).json(error.details.map((error) => error.message).join(", "))
}

contactsServices.addContact(req.body).then((newContact) => res.status(201).json(newContact)).catch(error => {
    console.error("Error:", error)
});
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: 'Body must have at least one field' });
  }

  const { id } = req.params;
  const body = req.body;

  const result = await contactsServices.updataContact(id, body);

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.json(result);

     };


      


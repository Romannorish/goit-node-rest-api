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
    const { name, email, phone } = req.body;

    const contact = await contactsServices.addContact(name, email, phone);
  
    return res.status(201).json(contact);
};

export const updateContact = async (req, res) => {
    if (Object.keys(updata).length === 0) {
        return res
          .status(400)
          .json({ message: "Body must have at least one field" });
      }

const  id  = req.params.id;
  const body = req.body;

  const result = await contactsServices.updata(id, body);

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.json(result);

     };


      


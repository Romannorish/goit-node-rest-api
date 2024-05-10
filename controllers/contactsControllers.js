import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import {getContactById,removeContact,listContacts,addContact,updata} from "../services/contactsServices.js";


export const getAllContacts = (req, res) => {
    listContacts(then(contact => {res.status(200).json(contact)}))
};

export const getOneContact = (req, res) => {
    getContactById(res.params.id)
    .then((contact)=> {
        contact ? 
        res.status(200).json(contact)
        : res.status(404).json({ message: "Not found" });
    })
    .catch(error => {
        console.error("Error:",error)
    })
};

export const deleteContact = (req, res) => {
    removeContact(res.params.id)
    .then((contact)=> {
        contact ? 
        res.status(200).json(contact)
        : res.status(404).json({ message: "Not found" });
    })
    .catch(error => { 
        console.error("Error:",error)
    })
};


export const createContact = (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }

    const { error } = createContactSchema.validate(contact, {abortEarly: false})

    if(error) {
        return res.status(400).json(error.details.map((error) => error.message).join(", "))
    }
    
    addContact(req.body).then((newContact) => res.status(201).json(newContact)).catch(error => {
        console.error("Error:", error)
    });
};

export const updateContact = (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "Body must have at least one field" });
      }

      const { error } = updateContactSchema.validate(updatedData);
      if (error) {
          return res.status(400).json({message: error.message})
      }

      updata(id,updateData)
     .then((contact)=> { 
        contact ? 
        res.status(200).json(contact)
        : res.status(404).json({ message: "Not found" });
      }).catch(error => {console.log("error", error)})
     };

      


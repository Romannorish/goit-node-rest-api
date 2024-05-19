import HttpError from "../helpers/HttpError.js";
import {Contact} from "../schemas/contactsSchemas.js";


const getAllContacts = async (req, res, next) => {
  try {
    const response = await Contact.find()
    res.json(response)
  } catch (error) {
    next(error)
  }
};

const getOneContact = async (req, res, next) => {
  const {id} = req.params;

  try {
    const response = await Contact.findById(id)
    if (!response) {
      throw HttpError(404, "Not Found")
    }
    res.json(response)
  } catch (error) {
    next(error)
  }
};

const deleteContact = async (req, res, next) => {
  const {id} = req.params

  try {
      const response = await Contact.findByIdAndDelete(id)
      if (!response) {
        throw HttpError(404, "Not Found")
      }
      res.json(response)
  } catch (error) {
    next(error)
}
};

const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite
  }

  try {
    const response = await Contact.create(contact);
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
};

const updateContact = async (req, res, next) => {
  const {id} = req.params

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const response = await Contact.findByIdAndUpdate(id, contact, { new: true });
    if (!response) {
      throw HttpError(404, "Not Found")
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field")
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
};

const updateStatusContact = async (req, res, next) => {
  const {id} = req.params

  try {
    const {favorite} = req.body
    const response = await Contact.findOneAndUpdate({_id: id}, {favorite}, {new: true})
    if (!response) {
      throw HttpError(404, "Not Found")
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
}
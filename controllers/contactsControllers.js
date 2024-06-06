import HttpError from "../helpers/HttpError.js";
import {Contact} from "../schemas/contactsSchemas.js";


const getAllContacts = async (req, res, next) => {
  try {
    const response = await Contact.find({owner: req.user.id})
    res.json(response)
  } catch (error) {
    next(error)
  }
};

const getOneContact = async (req, res, next) => {
  const {id} = req.params;

  try {
    const response = await Contact.findById({_id: id, owner: req.user.id})
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
      const response = await Contact.findByIdAndDelete({_id: id, owner: req.user.id})
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

  const owner = req.user.id;

  try {
    const response = await Contact.create({...req.body, owner});
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
    const response = await Contact.findByIdAndUpdate({_id: id, owner: req.user.id}, contact, { new: true });
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
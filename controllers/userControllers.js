import {User} from '../schemas/usersSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body
        const user = await User.findOne({email})

        if (user !== null) {
            return res.status(409).send({message: "User already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({name, email, password: hashedPassword})

        res.status(201).send({message: "Registration successful!"})
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if (user === null) {
            return res.status(401).send({message: "Email or Password is incorrect!"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
              .status(401)
              .send({ message: "Email or Password is incorrect!" });
        }

        const token = jwt.sign({id: user._id, name: user.name}, process.env.JWT, {expiresIn: "1h"})

        await User.findByIdAndUpdate(user._id, {token}, {new: true})

        res.send({token})

    } catch (error) {
        next(error)
    }
}

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById( req.user.id)
        res.json({email: user.email, subscription: user.subscription})
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {token: null}, {new: true})

        res.status(204).end()

    } catch (error) {
        next(error)
    }
}

const updateSub = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length !== 1 || Object.keys(req.body)[0] !== "subscription") {
            return next(HttpError(400, "Body must have one field: subscription"))
        }

        const {subscription: updateSub} = req.body
        const data = await User.findByIdAndUpdate(
            req.user.id,
            {subscription: updateSub},
            {new: true}
        )

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export { register, login, logout ,getCurrentUser, updateSub}
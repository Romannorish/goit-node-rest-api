import jwt from 'jsonwebtoken'
import {User} from '../schemas/usersSchema.js'

function auth(req, res, next) {
    const authorizationHeader = req.headers.authorization

    if (typeof authorizationHeader !== "string") {
        return res.status(401).send({message: "Invalid token"})
    }

    const [bearer, token] = authorizationHeader.split(" ", 2)

    if (bearer !== "Bearer") {
        return res.status(401).send({message: "Invalid token"})
    }

    jwt.verify(token, process.env.JWT, async (error, decode) => {
        if (error) {
            return res.status(401).send({message: "Invalid token"})
        }

        try {
            const user = await User.findById(decode.id)

            if (user === null) {
                return res.status(401).send({message: "Invalid token"})
            }

            if (user.token !== token) {
                return res.status(401).send({message: "Invalid token"})
            }

            req.user = {id: decode.id, name: decode.name}
             
            // if (user.owner.toString() !== req.use.id){
            //     return res.status(403).send({message: "user is not allowed"})
            // }
            next()
        } catch (error) {
            next(error)
        }
    })
}

export default auth
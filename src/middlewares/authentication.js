const JWT = require('../utils/jwt.js')

module.exports = (req, res, next) => {
	try {
		const { token } = req.cookies

		if(!token) {
			return res.status(401).json({ message: 'You lose!' })
		}

		const { userId, admin } = JWT.verify(token)

		if(!process.db.users.find(user => user.userId == userId)) {
			return res.clearCookie('token').status(401).end()
		}

		req.userId = userId
		req.admin = admin

		return next()

	} catch(error) {
		return res
			.status(400)
			.json({
				status: 400,
				message: error.message
			})
	}
}
const path = require('path')

const GET = (req, res) => {
	try {
		const { users, words, remainingTime, gameStarted } = process.db

		const isTurn = users.find(user => user.userId == req.userId)?.turn || false
		const currentUser = users.find(user => user.turn)

		let nextUser = users.find(user => user.userId > currentUser?.userId) || null
		if(!nextUser && users.length > 1) nextUser = users[0] || null

		const lastWord = words.at(-1)?.word || null

		if(gameStarted && users.length == 1) {
			process.db.users = []
			process.db.words = []
			process.db.gameStarted = false
			process.db.remainingTime = 0
			clearInterval(process.timeReducerId)

			return res
				.clearCookie('token')
				.status(401)
				.json({
					message: 'You won!'
				})
		}

		return res
			.status(200)
			.json({
				status: 200,
				message: 'OK',
				remainingTime,
				gameStarted,
				currentUser,
				lastWord,
				nextUser,
				isTurn,
				users,
			})

	} catch(error) {
		return res.status(400).json({
			status: 400,
			message: error.message
		})
	}
}

module.exports = {
	GET
}
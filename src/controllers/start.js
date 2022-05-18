const path = require('path')

const GET = (req, res) => {
	try {
		let { users } = process.db

		if(process.db.gameStarted) {
			throw new Error("Game already started!")
		}

		if(!req.admin) {
			throw new Error("You are not allowed to start the game!")
		}

		if(users.length < 2) {
			throw new Error("There must be minimum 2 users to start game!")
		}

		process.db.gameStarted = true
		process.db.remainingTime = 15
		process.timeReducer()

		return res
			.status(200)
			.json({
				status: 200,
				message: 'game started!',
				remainingTime: process.db.remainingTime,
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
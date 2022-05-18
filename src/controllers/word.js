const path = require('path')

const GET = (req, res) => {
	try {
		const { users, words } = process.db
		let { word } = req.query

		word = word.trim().toLowerCase()

		if(!word) {
			throw new Error("word is required!")
		}

		if((/\d/).test(word)) {
			throw new Error("Invalid word!")
		}

		const userIndex = process.db.users.findIndex(user => user.userId == req.userId)
		const currentUser = process.db.users[userIndex]

		if(!currentUser.turn) {
			throw new Error("It is not your turn!")
		}

		const lastWord = words.at(-1)?.word
		const isSaid = words.find(el => el.word == word)

		if(isSaid || (lastWord && lastWord[lastWord.length - 1] != word[0])) {
			process.db.users.splice(userIndex, 1)
			process.db.remainingTime = 15

			if(process.db.users.length > 1 && process.db.users[userIndex]) {
				process.db.users[userIndex].turn = true
			} else if(process.db.users.length > 1 && !process.db.users[userIndex]) {
				process.db.users[0].turn = true
			}

			return res
			.clearCookie('token')
			.status(401)
			.json({
				message: 'You lose!'
			})
		}

		if(process.db.users[userIndex + 1]) {
			process.db.users[userIndex].turn = false
			process.db.users[userIndex + 1].turn = true
		} else {
			process.db.users.at(-1).turn = false
			process.db.users[0].turn = true
		}

		process.db.remainingTime = 15
		process.db.words.push({
			userId: req.userId,
			word
		})

		return res
			.status(200)
			.json({
				status: 200,
				message: 'OK'
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
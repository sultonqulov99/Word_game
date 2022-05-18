module.exports = (req, res, next) => {
	const { users, remainingTime, gameStarted } = process.db
	const { userId } = req

	const userIndex = process.db.users.findIndex(user => user.userId == userId)
	const user = process.db.users[userIndex]

	if(user?.turn && remainingTime <= 1 && gameStarted) {

		process.db.users.splice(userIndex, 1)
		process.db.remainingTime = 15

		if(users.length > 1 && users[userIndex]) {
			users[userIndex].turn = true
		} else if(users.length > 1 && !users[userIndex]) {
			users[0].turn = true
		}

		return res
			.status(401)
			.clearCookie('token')
			.json({
				message: 'You lose!'
			})
	}

	return next()
}	
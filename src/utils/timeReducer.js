process.timeReducer = (time) => {
	process.timeReducerId = setInterval(() => {
		process.db.remainingTime = process.db.remainingTime - 1
	}, 1000)
}
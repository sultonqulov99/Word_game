const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const express = require('express')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 5000

require('./utils/timeReducer.js')
process.db = {}
process.db.users = []
process.db.words = []
process.db.gameStarted = false
process.db.remainingTime = 0

app.set('views', path.join(__dirname, 'public'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

const authenticationMiddleware = require('./middlewares/authentication.js')
const kickGamerMiddleware = require('./middlewares/kickGamer.js')

app.use(cookieParser())
app.use(/^((?!\/login).)*$/, authenticationMiddleware)
app.use(kickGamerMiddleware)
app.use(fileUpload())
app.use((req, res, next) => {
	res.render = function (fileName) {
		return res.sendFile(path.join(app.get('views'), fileName + '.html'))
	}
	return next()
})


// routes
const loginRouter = require('./routes/login.js')
const homeRouter = require('./routes/home.js')
const infoRouter = require('./routes/info.js')
const startRouter = require('./routes/start.js')
const wordRouter = require('./routes/word.js')

app.use(loginRouter)
app.use(homeRouter)
app.use(infoRouter)
app.use(startRouter)
app.use(wordRouter)

app.listen(PORT, () => console.log('server is ready at *5000'))



/*
	users
		userId username profileImg turn
	texts
		userId text
	gameStarted
	remainingTime

	API architecture
	
	/ login (POST)
		* request   [username, img]
		* response  [userId, token, admin]
		* tasks
			* validate requset body
			* check username exists
			* save img
			* push new user to users array
			* check user is admin by it is first in an array
			* generate token
			* send response

	/getInfo (GET)
		* request [token]
		* response [users, lastWord, time, isTurn currentUser {userId, profileImg}]
		* tasks
			* check token
			* check isTurn
			* send response


	/word      (POST) 
		* request  [token, newWord]
		* response [ok: boolean message: text]
		* tasks 
			* validate word
			* check token
			* check word is used or not and word compability
			* delete user if user loses
			* push new Word to words array
			* update time
			* set false to current user
			* set true to next user

	/start (GET) 
		* request [token]
		* response [token]
		* tasks
			* check token
			* check user is admin
			* check users array length min: 2
			* set startGame
			* set time
*/
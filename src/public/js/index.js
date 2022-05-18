
async function renderData () {
	const { 
		users,
		isTurn, 
		nextUser, 
		lastWord, 
		currentUser, 
		gameStarted, 
		remainingTime,
	} = await request('/info', 'GET')

	
	if(!isTurn) wordInput.disabled = true
	else wordInput.disabled = false
		
	gameStarted && (timer.textContent = '00:' + remainingTime)

	lastWordEl.textContent = lastWord 
	nextPlayer.textContent = nextUser?.username

	if (window.localStorage.getItem('admin') == 'false') startGameBtn.style.display = 'none'

	setCurrentUser(currentUser)
	renderUsers(users)
}

function setCurrentUser (user) {
	if(JSON.stringify(setCurrentUser.user) == JSON.stringify(user)) {
		return 
	}

	setCurrentUser.user = user

	currentUserImg.src = backendApi + user.userImg
	currentUserUsername.textContent = user.username
}

function renderUsers (users) {
	if(renderUsers.users?.length == users.length) {
		if(JSON.stringify(renderUsers.users) == JSON.stringify(users)) {
			return
		}
	}

	renderUsers.users = users

	usersList.innerHTML = null

	for(let user of users) {
		usersList.innerHTML += `
			<li class="users-list__item">
                <div class="user-img">
                    <img src="${backendApi + user.userImg}">
                </div>
                <div class="user-name">
                    ${user.username}
                </div>
                <div style="visibility: ${!user.turn ? 'hidden' : 'none'}" class="user-status active">
                        turn
                </div>
            </li >
		`
	}
}

wordInput.onkeyup = async event => {
	const word = wordInput.value.trim()

	if(event.keyCode !== 13) return

	let response = await request('/word?word=' + word, 'GET')
	
	wordInput.value = null

	console.log(response)
}

startGameBtn.onclick = async event => {
	let response = await request('/start', 'GET')
	startGameBtn.disabled = true
}

setInterval(() => {
	renderData()
}, 500)
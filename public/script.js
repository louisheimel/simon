const colors = ['yellow', 'blue', 'green', 'red'];

const game = (() => {
	let colorList = []
	let userInput = []
  let strictMode = false 
  let computerIsBeeping = false
  let gameStarted = false
  let fullUserInput = false

  const normal= {
    'yellow': '#DFE875',
    'blue': '#90B5FF',
    'green': '#94FFAC',
    'red': '#FF949F',
  };

  const shades= {
    'yellow': 'yellow',
    'blue': 'blue',
    'green': 'green',
    'red': 'red',
  };

  const numberOfBeeps = 20 

	const getLength = () => colorList.length

  const lightUpAndBeep = (color) => {
    document.getElementById(color).style.backgroundColor = shades[color]
    document.getElementById(color + '_sound').play()
    setTimeout(() => { document.getElementById(color).style.backgroundColor = normal[color] }, 500)
  }

  const userClick = (color) => {
    fullUserInput = userInput.length === colorList.length
    if (!fullUserInput) {
      lightUpAndBeep(color)
      userInput.push(color)
      checkUserInput()
    }
  }
  
  const computerClick = (color) => {
    lightUpAndBeep(color)
  }
  
  const clickColor = (color) => {
    // return a click handler for the given button color
    return (e) => {
      // if the computer is not beeping, and the user has clicked
      if (e && !computerIsBeeping) {
        userClick(color)
      // else if the computer has clicked
      } else if (!e) {
        computerClick(color)
      }
    }
  }

	const addToColorList = () => {
    if (userInput.length === numberOfBeeps) {
      alert('You won!')
      reset()
    } else {
      colorList.push(_.sample(colors))
    }
	}

	const reset = () => {
	  colorList = []
    userInput = []
		addToColorList()
		beep()
	}

  const softReset = () => {
    userInput = []
    beep()
  }

  const alertAndReset = () => {
    this.beeping = true;
    alert('nope!') 
    if (strictMode) {
      setTimeout(reset, 2000)
    } else {
      setTimeout(softReset, 2000)
    }
  }

  const userInputCorrect = () =>  _.isEqual(userInput, colorList.slice(0, userInput.length))
  const checkUserInput = () => {
		if (userInputCorrect() && userInput.length === colorList.length) {
      setTimeout(() => { addToColorList(); beep(); }, 2000) 
    } 
    else if (!userInputCorrect()) {
      alertAndReset()
    }
	}

	const beep = (e) => {
    computerIsBeeping = true
    document.getElementById('count').innerHTML = colorList.length
	  colorList.forEach((color, i) => {
			setTimeout(() => {
        clickColor(color)(e, false)
        if (i === colorList.length - 1) {
          computerIsBeeping = false
        }
			}, 0 + 1000 * i)
		})
		userInput = []
	}

  const setStrictUIOff = () => {
    const strictButton = document.getElementById('strict')
    strictButton.style.backgroundColor = 'black'
    strictButton.style.color = 'red'
    strictButton.innerHTML = 'strict mode off'
  }
  const setStrictUIOn = () => {
    const strictButton = document.getElementById('strict')
    strictButton.style.backgroundColor = 'red'
    strictButton.style.color = 'black'
    strictButton.innerHTML = 'strict mode on'
  }
  const strict = () => {
    if (strictMode) {
      setStrictUIOff()
    } else {
      setStrictUIOn()
    }
    strictMode = !strictMode
  }

	const start = () => {
    if (!gameStarted) {
      gameStarted = true
      addToColorList()
      beep()
    } else {
      reset()
    }
	}

	return {
    clickColor: clickColor,
		start: start,
    strict: strict,
	};
})()


const addButtonListener = (color) => {
  document.getElementById(color).addEventListener('click', game.clickColor(color))
}

colors.forEach(addButtonListener)

document.getElementById('start').addEventListener('click', game.start)
document.getElementById('strict').addEventListener('click', game.strict)

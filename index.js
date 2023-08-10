/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Setting up canvas objects
const canvas = document.querySelector('#game')
const context = canvas.getContext('2d', { willReadFrequently: true })

const hudCanvas = document.querySelector('#hud')
const hudContext = hudCanvas.getContext('2d')

// initialising constants
const movementSpeed = 3
// eslint-disable-next-line no-unused-vars
const gravity = 0.3
const canvasWidth = 1280
const canvasHeight = 720

const player1SpawnPosition = 0
const player2SpawnPosition = 1100

// defining canvas dimensions & filling the background with colour
canvas.width = canvasWidth
canvas.height = canvasHeight

hudCanvas.width = canvasWidth
hudCanvas.height = canvasHeight

const bgMusic = new Sound(
  './sfx/2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3',
  0.1,
  (loop = true)
)

const rematchUI = document.querySelector('.rematch')
const rematchButton = document.querySelector('.rematchButton')
const muteButton = document.querySelector('.muteButton')

rematchButton.addEventListener('click', () => {
  rematchUI.style.display = 'none'
  startNewGame()
})

// event listener for HUD
muteButton.addEventListener('click', () => {
  bgMusic.toggleMute()
  if (bgMusic.sound.muted) {
    muteButton.src = './sprites/Mute Button muted1.png'
  } else {
    muteButton.src = './sprites/Mute Button unmuted1.png'
  }
})

// object constructors
const background = new Sprite({
  position: {
    x: 0,
    y: -170
  },
  imageSource: './sprites/background.png',
  scale: 0.6,
  height: canvasHeight - 300
})
const foregroundTileset = new Sprite({
  position: {
    x: -30,
    y: canvasHeight - 120
  },
  scale: 1.3,
  imageSource: './sprites/tilemap/tilemap_new_softy_sand.png'
})
const foregroundTileset2 = new Sprite({
  position: {
    x: 340,
    y: canvasHeight - 120
  },
  scale: 1.3,
  imageSource: './sprites/tilemap/tilemap_new_softy_sand.png'
})
const foregroundTileset3 = new Sprite({
  position: {
    x: 700,
    y: canvasHeight - 120
  },
  scale: 1.3,
  imageSource: './sprites/tilemap/tilemap_new_softy_sand.png'
})
const foregroundTileset4 = new Sprite({
  position: {
    x: 900,
    y: canvasHeight - 120
  },
  scale: 1.3,
  imageSource: './sprites/tilemap/tilemap_new_softy_sand.png'
})
const cloud1 = new Sprite({
  position: {
    x: -200,
    y: 0
  },
  scale: 1.2,
  imageSource: './sprites/clouds/cloud_shape2_2.png'
})

const healthBar1 = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  scale: 0.15,
  imageSource: './sprites/healthbarfinal.png'
})

const healthBar2 = new Sprite({
  position: {
    x: 937,
    y: 0
  },
  scale: 0.15,
  imageSource: './sprites/healthbarfinalflip.png'
})

// Creating player objects
const player = new Player({
  position: {
    x: player1SpawnPosition,
    y: canvas.height - 200
  },
  velocity: {
    x: 0,
    y: 0
  },
  playerNumber: 1,
  defaultFace: 'right',
  imageSource: './sprites/Fire vizard/Idle.png',
  frames: 7,
  scale: 1.5,
  offset: {
    x: 50,
    y: 100
  },
  sprites: {
    idle: {
      imageSource: './sprites/Fire vizard/Idle.png',
      frames: 7
    },
    run: {
      imageSource: './sprites/Fire vizard/Run.png',
      frames: 8
    },
    attack: {
      imageSource: './sprites/Fire vizard/Attack_1.png',
      frames: 7
    }
  }
})

const player2 = new Player({
  position: {
    x: player2SpawnPosition,
    y: canvas.height - 200
  },
  velocity: {
    x: 0,
    y: 0
  },
  playerNumber: 2,
  defaultFace: 'left',
  imageSource: './sprites/Lightning Mage/IdleLeft.png',
  frames: 7,
  scale: 1.5,
  offset: {
    x: 0,
    y: 100
  }
})

function moveBackground (sprite, speed) {
  sprite.position.x += speed
  if (sprite.position.x > 2000) {
    sprite.position.x = -1000
  }
}

// Recurrent animate function to keep the game running
function animate () {
  background.update()
  cloud1.update()

  moveBackground(cloud1, 0.1)

  foregroundTileset.draw()
  foregroundTileset3.draw()
  foregroundTileset2.draw()
  foregroundTileset4.draw()

  player.update()
  player2.update()
  checkWin()
  healthBar1.drawToHud()
  healthBar2.drawToHud()

  // collision detection for attack
  collisionDetection(player, player2)
  collisionDetection(player2, player)
  window.requestAnimationFrame(animate)
}

// Function to check if a hitbox is colliding with the opposing player
function collisionDetection (player, player2) {
  if (
    player.isAttacking &&
    player.attackHitbox.position.x + player.attackHitbox.width >=
      player2.position.x &&
    player.attackHitbox.position.x <= player2.position.x
  ) {
    console.log('hit')
    player.isAttacking = false
    player2.health -= 10
  }

  // collision detection for secondaryattack
  if (
    player.isSecondaryAttacking &&
    player.secondaryHitbox.position.x + player.secondaryHitbox.width >=
      player2.position.x &&
    player.secondaryHitbox.position.x <= player2.position.x
  ) {
    console.log('secondary hit')
    player.isSecondaryAttacking = false
    player2.health -= 30
  }
}

// function to check win
function checkWin () {
  if (player.health <= 0) {
    player.health = 0
    player.update()
    rematch()
  }
  if (player2.health <= 0) {
    player2.health = 0
    player2.update()
    rematch()
  }
}

function rematch () {
  rematchUI.style.display = 'flex'
}

function startNewGame () {
  player.health = 100
  player2.health = 100
  player.position.x = player1SpawnPosition
  player2.position.x = player2SpawnPosition
  bgMusic.play()
}

// event listeners / controls
window.addEventListener('keydown', (event) => {
  if (player.isBusy === false) {
    switch (event.key) {
      // player controls
      case 'd':
        player.lastPressedArray.push('d')
        break
      case 'a':
        player.lastPressedArray.push('a')
        break
      case 'q':
        player.currentFrame = 0
        player.lastPressedArray.push('q')
        player.attack()
        break
      case 'e':
        if (player.abilityCooldown === 0) {
          player.currentFrame = 0
          player.lastPressedArray.push('e')
          player.secondaryAttack()
          break
        }
        break
      case 'w':
        player.lastPressedArray.push('w')
        // prevent player from double jumping
        if (player.velocity.y === 0) {
          player.velocity.y = -12
        }
        break
      // player2 controls
      case 'j':
        player2.velocity.x = -1 * movementSpeed
        player2.lastPressedKey = 'j'
        break
      case 'l':
        player2.velocity.x = 1 * movementSpeed
        player2.lastPressedKey = 'l'
        break
      case 'i':
        // prevent player from double jumping
        if (player2.velocity.y === 0) {
          player2.velocity.y = -12
        }
        break
      case 'u':
        player2.attack()
        break
      case 'o':
        player2.secondaryAttack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      player.lastPressedArray = player.lastPressedArray.filter(
        (val) => val !== 'd'
      )
      break
    case 'a':
      player.lastPressedArray = player.lastPressedArray.filter(
        (val) => val !== 'a'
      )
      break
    case 'w':
      setTimeout(function () {
        player.lastPressedArray = player.lastPressedArray.filter(
          (val) => val !== 'w'
        )
      }, 500)
      break
    case 'q':
      setTimeout(function () {
        player.lastPressedArray = player.lastPressedArray.filter(
          (val) => val !== 'q'
        )
      }, 1000)

      break
    case 'e':
      setTimeout(function () {
        player.lastPressedArray = player.lastPressedArray.filter(
          (val) => val !== 'e'
        )
      }, 1000)
      break
    case 'j':
      player2.velocity.x = 0
      break
    case 'l':
      player2.velocity.x = 0
      break
  }
})

animate()

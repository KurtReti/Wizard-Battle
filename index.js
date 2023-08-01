// Setting up canvas objects
const canvas = document.querySelector('#game')
const context = canvas.getContext('2d')

const hudCanvas = document.querySelector('#hud')
const hudContext = hudCanvas.getContext('2d')

// initialising constants
const healthBarHeight = 100
const movementSpeed = 3
const gravity = 0.2
const canvasWidth = 1920
const canvasHeight = 1080

// defining canvas dimensions & filling the background with colour
canvas.width = canvasWidth
canvas.height = canvasHeight
context.fillRect(0, 0, canvas.width, canvas.height)
hudCanvas.width = canvasWidth
hudCanvas.height = canvasHeight

// class for creating sprites in the game
class Sprite {
  constructor ({
    position,
    imageSource,
    scale = 1,
    width = 50,
    height = 150,
    frames = 1
  }) {
    this.position = position
    this.width = width
    this.height = height
    this.image = new Image()
    this.image.src = imageSource
    this.scale = scale
    this.frames = frames
  }

  draw () {
    context.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    )
  }

  drawOnTop () {
    hudContext.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    )
  }

  update () {
    this.draw()
  }
}

class Player {
  constructor ({ position, velocity, playerNumber, defaultFace, imageSource }) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.attackHitbox = {
      position: this.position,
      width: 100,
      height: 50
    }
    this.secondaryHitbox = {
      position: this.position,
      width: 300,
      height: 20
    }
    this.isSecondaryAttacking = false
    this.isAttacking = false
    this.isBusy = false
    this.health = 100
    this.playerNumber = playerNumber
    this.lastPressedKey = ''
    this.facing = defaultFace
    this.image = new Image()
    this.image.src = imageSource
  }

  draw () {
    context.fillStyle = 'red'
    context.fillRect(this.position.x, this.position.y, 50, this.height)

    if (this.isAttacking) {
      context.fillStyle = 'yellow'
      if (this.facing === 'left') {
        context.fillRect(
          this.attackHitbox.position.x,
          this.attackHitbox.position.y,
          this.attackHitbox.width * -1,
          this.attackHitbox.height
        )
      } else if (this.facing === 'right') {
        context.fillRect(
          this.attackHitbox.position.x + 50,
          this.attackHitbox.position.y,
          this.attackHitbox.width,
          this.attackHitbox.height
        )
      }
    }

    if (this.isSecondaryAttacking) {
      context.fillStyle = 'blue'
      context.fillRect(
        this.secondaryHitbox.position.x,
        this.secondaryHitbox.position.y,
        this.secondaryHitbox.width,
        this.secondaryHitbox.height
      )
    }
  }

  // draw health bar based on player current health and update when player takes damage
  drawHealthBar () {
    hudContext.clearRect(0, 0, canvas.width, canvas.height)
    hudContext.fillStyle = 'green'
    switch (this.playerNumber) {
      case 1:
        hudContext.fillRect(0, 0, this.health * 8, healthBarHeight)
        break

      case 2:
        hudContext.fillRect(canvas.width, 0, this.health * -8, healthBarHeight)
        break
    }
  }

  update () {
    this.draw()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 100) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }

    if (this.isBusy) {
      this.velocity.x = 0
    }

    if (this.lastPressedKey === 'a' || this.lastPressedKey === 'j') {
      this.facing = 'left'
    } else if (this.lastPressedKey === 'd' || this.lastPressedKey === 'l') {
      this.facing = 'right'
    }
  }

  attack () {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }

  secondaryAttack () {
    this.isSecondaryAttacking = true
    this.isBusy = true
    setTimeout(() => {
      this.isSecondaryAttacking = false
      this.isBusy = false
    }, 300)
  }
}

const background = new Sprite({
  position: {
    x: 0,
    y: -200
  },
  imageSource: './sprites/background.png',
  height: canvasHeight - 300
})

const foregroundTileset = new Sprite({
  position: {
    x: -30,
    y: canvasHeight - 150
  },
  scale: 3,
  imageSource: './sprites/tilemap/tilemap_new_softy_sand.png',
  frames: 3.7
})

// Creating player objects
const player = new Player({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  playerNumber: 1,
  defaultFace: 'right'
})

const player2 = new Player({
  position: {
    x: 300,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  playerNumber: 2,
  defaultFace: 'left'
})

// Recurrent animate function to keep the game running
function animate () {
  window.requestAnimationFrame(animate)
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  foregroundTileset.draw()
  player.update()
  player2.update()
  initHUD(player, player2)
  checkWin()

  // collision detection for attack
  collisionDetection(player, player2)
  collisionDetection(player2, player)
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
    player.drawHealthBar()
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
    player2.health -= 20
    player.drawHealthBar()
  }
}

// function to initialize the health bar
function initHUD (player1, player2) {
  hudContext.fillStyle = 'green'
  hudContext.fillRect(0, 0, player1.health * 8, healthBarHeight)
  hudContext.fillRect(canvas.width, 0, player2.health * -8, healthBarHeight)
}

// func
function checkWin () {
  if (player.health <= 0) {
    alert('player 2 wins')
    player.health = 100
    player2.health = 100
  }
  if (player2.health <= 0) {
    alert('player 1 wins')
    player.health = 100
    player2.health = 100
  }
}

// event listeners / controls
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    // player controls
    case 'd':
      player.velocity.x = 1 * movementSpeed
      player.lastPressedKey = 'd'
      break
    case 'a':
      player.velocity.x = -1 * movementSpeed
      player.lastPressedKey = 'a'
      break
    case 'q':
      player.attack()
      break
    case 'e':
      player.secondaryAttack()
      break
    case 'w':
      // prevent player from double jumping
      if (player.velocity.y === 0) {
        player.velocity.y = -10
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
        player2.velocity.y = -10
      }
      break
    case 'u':
      player2.attack()
      break
    case 'o':
      player2.secondaryAttack()
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      player.velocity.x = 0
      break
    case 'a':
      player.velocity.x = 0
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
initHUD(player, player2)

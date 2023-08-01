/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class Player extends Sprite {
  constructor ({
    position,
    velocity,
    playerNumber,
    defaultFace,
    imageSource,
    scale,
    frames = 1,
    offset = { x: 0, y: 0 }
  }) {
    super({ position, imageSource, scale, frames, offset })
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.attackHitbox = {
      position: this.position,
      width: 200,
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
    this.lastPressedArray = ['']
    this.facing = defaultFace
    this.image = new Image()
    this.image.src = imageSource
  }

  checkAnimationStatus () {
    if (this.playerNumber === 1) {
      switch (this.lastPressedKey) {
        case 'a':
          this.frames = 8
          this.image.src = './sprites/Fire vizard/Run.png'
          player.velocity.x = -1 * movementSpeed

          break
        case 'd':
          this.frames = 8
          this.image.src = './sprites/Fire vizard/Run.png'
          player.velocity.x = 1 * movementSpeed
          break
        case 'w':
          this.frames = 9
          this.image.src = './sprites/Fire vizard/Jump.png'
          break
        case 'e':
          this.frames = 14
          this.image.src = './sprites/Fire vizard/Flame_jet.png'
          player.velocity.x = 0
          break
        case 'q':
          this.frames = 4
          this.image.src = './sprites/Fire vizard/Attack_2.png'
          player.velocity.x = 0
          break
        case '':
          this.image.src = '/sprites/Fire vizard/Idle.png'
          this.frames = 7
          player.velocity.x = 0
          break
      }
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
    const lastIndex = this.lastPressedArray.length
    this.lastPressedKey = this.lastPressedArray[lastIndex - 1]
    console.log(this.lastPressedKey)
    this.checkAnimationStatus()
    this.draw()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 60) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }

    if (this.position.x <= 0) {
      this.position.x = 0
    } else if (this.position.x + this.velocity.x >= canvas.width - 0) {
      this.position.x = canvas.width - 0
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
    }, 400)
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// init sounds
const fireSFX = new Sound('./sfx/04_Fire_explosion_04_medium.wav', 0.5)
const attackSFX = new Sound('./sfx/07_human_atk_sword_1.wav', 0.5)
const jumpSFX = new Sound('./sfx/12_human_jump_2.wav', 0.4)
const manaSFX = new Sound('./sfx/08_human_charge_1.wav', 0.35)

class Player extends Sprite {
  constructor ({
    position,
    velocity,
    playerNumber,
    defaultFace,
    imageSource,
    scale,
    frames = 1,
    offset = { x: 0, y: 0 },
    sprites
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
    this.isBusy = true
    this.health = 100
    this.playerNumber = playerNumber
    this.lastPressedKey = ''
    this.lastPressedArray = ['']
    this.image = new Image()
    this.image.src = imageSource
    this.sprites = sprites
    this.abilityCooldown = 0

    for (const sprite in sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSource
    }
  }

  updateHealthBar () {
    if (this.playerNumber === 1) {
      const healthBar = document.querySelector('#player1')
      const healthString = player.health * 2.2 + 'px'
      healthBar.style.width = healthString
    } else if (this.playerNumber === 2) {
      const healthBar = document.querySelector('#player2')
      const healthString = player2.health * 2.2 + 'px'
      healthBar.style.width = healthString
    }
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
          jumpSFX.play()
          break
        case 'e':
          this.frames = 14
          this.image.src = './sprites/Fire vizard/Flame_jet.png'
          player.velocity.x = 0
          fireSFX.play()
          break
        case 'q':
          this.frames = 4
          this.image.src = './sprites/Fire vizard/Attack_2.png'
          player.velocity.x = 0
          attackSFX.play()
          break
        case '':
          this.image.src = './sprites/Fire vizard/Idle.png'
          this.frames = 7
          player.velocity.x = 0
          break
      }
    }
  }

  update () {
    const lastIndex = this.lastPressedArray.length
    this.lastPressedKey = this.lastPressedArray[lastIndex - 1]
    this.checkAnimationStatus()
    this.updateHealthBar()
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
  }

  attack () {
    this.isBusy = true
    setTimeout(() => {
      console.log('hey')
      this.isBusy = false
    }, 1000)
  }

  startCooldown () {
    this.abilityCooldown = 50

    const intervalId = setInterval(() => {
      this.abilityCooldown--
      if (this.abilityCooldown < 0) {
        this.abilityCooldown = 0
      }
      console.log(this.abilityCooldown)

      if (this.abilityCooldown === 0) {
        manaSFX.play()
        clearInterval(intervalId)
      }
    }, 100)
  }

  secondaryAttack () {
    this.isBusy = true
    setTimeout(() => {
      console.log('hey')
      this.isBusy = false
    }, 1000)

    this.startCooldown()
  }
}

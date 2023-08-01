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
    this.facing = defaultFace
    this.image = new Image()
    this.image.src = imageSource
  }

  // draw () {
  //   context.fillStyle = 'red'
  //   context.fillRect(this.position.x, this.position.y, 50, this.height)

  //   if (this.isAttacking) {
  //     context.fillStyle = 'yellow'
  //     if (this.facing === 'left') {
  //       context.fillRect(
  //         this.attackHitbox.position.x,
  //         this.attackHitbox.position.y,
  //         this.attackHitbox.width * -1,
  //         this.attackHitbox.height
  //       )
  //     } else if (this.facing === 'right') {
  //       context.fillRect(
  //         this.attackHitbox.position.x + 50,
  //         this.attackHitbox.position.y,
  //         this.attackHitbox.width,
  //         this.attackHitbox.height
  //       )
  //     }
  //   }

  //   if (this.isSecondaryAttacking) {
  //     context.fillStyle = 'blue'
  //     context.fillRect(
  //       this.secondaryHitbox.position.x,
  //       this.secondaryHitbox.position.y,
  //       this.secondaryHitbox.width,
  //       this.secondaryHitbox.height
  //     )
  //   }
  // }

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
    }, 300)
  }
}

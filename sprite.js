/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Sprite {
  constructor ({
    position,
    imageSource,
    scale = 1,
    width = 50,
    height = 150,
    frames = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.width = width
    this.height = height
    this.image = new Image()
    this.image.src = imageSource
    this.scale = scale
    this.frames = frames
    this.currentFrame = 0
    this.lastFrameTime = 0
    this.offset = offset
  }

  draw () {
    const now = Date.now()
    const timeSinceLastFrame = now - this.lastFrameTime
    const frameDuration = 1000 / this.frames

    if (timeSinceLastFrame >= frameDuration) {
      this.currentFrame = (this.currentFrame + 1) % this.frames
      this.lastFrameTime = now
    }

    const frameWidth = this.image.width / this.frames
    const frameHeight = this.image.height
    const frameX = this.currentFrame * frameWidth

    context.drawImage(
      this.image,
      frameX,
      0,
      frameWidth,
      frameHeight,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      frameWidth * this.scale,
      frameHeight * this.scale
    )
  }

  update () {
    this.draw()
  }
}

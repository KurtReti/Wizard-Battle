class Sound {
  constructor (src, volume, loop = false) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    this.sound.volume = volume
    this.sound.loop = loop
    this.sound.muted = false
    this.muted = false
    document.body.appendChild(this.sound)
    this.play = function () {
      this.sound.play()
    }
    this.stop = function () {
      this.sound.pause()
    }
  }

  toggleMute () {
    if (this.sound.muted) {
      this.sound.muted = false
    } else {
      this.sound.muted = true
    }
  }
}

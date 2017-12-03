import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create (game) {
    this.game = window.game
    this.group = this.game.add.group()

    this.header = window.game.add.image(0, 0, 'header')
    this.header.scale.set(this.game.width / 640)
    this.group.add(this.header)

    if (this.header.height > 90) {
      this.header.height = 90
    }

    this.footer = window.game.add.image(0, this.game.height, 'footer')
    this.footer.scale.set(this.game.width / 640)
    this.footer.anchor.y = 1
    this.group.add(this.footer)

    if (this.footer.height > 90) {
      this.footer.height = 90
    }

    this.background = game.add.sprite(0, 0, 'title')
    this.group.add(this.background)
    this.background.scale.setTo(window.scale)
    this.background.anchor.setTo(0.5)
    this.background.x = this.game.width / 2
    this.background.y = this.game.height / 2
    this.background.inputEnabled = true

    this.background.events.onInputUp.add(() => {
      game.state.start('Game')
    })
  }
}

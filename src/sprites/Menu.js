import Phaser from 'phaser'

export default class Menu {
  constructor ({
    game,
    type = 'menu',
    overlay = true,
    duration = 500,
    scale = window.scale
  }) {
    this.game = game

    this.group = game.add.group()

    this.gameService = game.gameService

    this.duration = duration

    if (overlay) {
      this.graphics = game.add.graphics()
      this.graphics.beginFill(0x000000)
      this.graphics.drawRect(0, 0, this.game.width, this.game.height)
      this.graphics.alpha = 0.5
      this.group.add(this.graphics)
    }

    this.background = game.add.sprite(0, 0, type)
    this.group.add(this.background)
    this.background.scale.setTo(scale)
    this.background.anchor.setTo(0.5)
    this.background.x = this.game.width / 2
    this.background.y = this.game.height / 2

    this.group.alpha = 0
  }

  show () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.group)
        .to({ alpha: 1 }, this.duration, Phaser.Easing.Linear.None, true)

      this.resolve = resolve
      tween.onComplete.add(() => {
        this.background.inputEnabled = true
        this.background.events.onInputUp.add(() => {
          this.gameService.vibrate(10)
          this.hide()
        })
      })
    })
  }

  hide () {
    this.background.inputEnabled = false
    const tween = this.game.add
      .tween(this.group)
      .to({ alpha: 0 }, this.duration, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(this.resolve)
  }
}

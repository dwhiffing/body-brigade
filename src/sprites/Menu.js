import Phaser from 'phaser'

export default class Menu {
  constructor ({ game, type = 'menu' }) {
    this.game = game

    this.group = game.add.group()
    this.graphics = game.add.graphics()
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, this.game.width, this.game.height)
    this.graphics.alpha = 0.5
    this.group.add(this.graphics)
    this.background = game.add.sprite(0, 0, type)
    this.group.add(this.background)

    this.title = this.game.add.text(20, 20, '')
    this.title.fontSize = 24
    this.title.fill = '#ffffff'
    this.group.add(this.title)
    this.group.alpha = 0
    this.background.scale.setTo(window.scale)
    this.background.anchor.setTo(0.5)
    this.background.x = this.game.width / 2
    this.background.y = this.game.height / 2
  }

  show ({ title } = {}) {
    return new Promise(resolve => {
      if (title) {
        this.title.text = title
      }

      this.game.add
        .tween(this.group)
        .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)

      this.resolve = resolve
      this.background.inputEnabled = true
      this.background.events.onInputUp.add(() => this.hide())
    })
  }

  hide () {
    this.background.inputEnabled = false
    const tween = this.game.add
      .tween(this.group)
      .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(this.resolve)
  }
}

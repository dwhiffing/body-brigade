import Phaser from 'phaser'

export default class Menu {
  constructor ({ game }) {
    this.game = game

    this.group = game.add.group()
    this.background = game.add.sprite(0, 0, 'menu')
    this.group.add(this.background)

    this.title = this.game.add.text(20, 20, 'Upgrade!')
    this.title.fontSize = 24
    this.title.fill = '#ffffff'
    this.group.add(this.title)
    this.group.alpha = 0
    this.group.scale.setTo(window.scale)
    this.background.inputEnabled = true
    this.group.position = {
      x: this.game.width / 2 - this.group.width / 2,
      y: this.game.height / 2 - this.group.height / 2
    }
  }

  show ({ title }) {
    return new Promise(resolve => {
      this.title.text = title

      this.game.add
        .tween(this.group)
        .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)

      this.resolve = resolve
      this.background.events.onInputUp.add(() => this.hide())
    })
  }

  hide () {
    const tween = this.game.add
      .tween(this.group)
      .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(this.resolve)
  }
}

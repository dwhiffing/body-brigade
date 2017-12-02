import Phaser from 'phaser'

export default class DamageService {
  constructor (gameService) {
    this.game = gameService.game
    this.gameService = gameService

    this.graphics = this.game.add.graphics(0, 0)
    this.graphics.beginFill(0x000000)
    this.graphics.drawRect(0, 0, this.game.width, this.game.height)
    this.graphics.alpha = 0

    this.group = this.game.add.group()
    this.group.x = window.leftBuffer
    this.group.y = window.topBuffer

    this.banner = this._initText(
      this.game.width / 2,
      this.game.height / 2,
      '',
      '#ff0000',
      40
    )
    this.banner.alpha = 0
  }

  update () {}

  _showOverlay () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.graphics)
        .to({ alpha: 0.8 }, 250, Phaser.Easing.None, true)
      tween.onComplete.add(() => resolve())
    })
  }

  _showDamage () {
    return new Promise(resolve => {
      this.banner.text = `${this.damage} DMG`
      this.banner.x = this.game.width / 2
      this.banner.y = this.game.height / 2

      const tweens = [
        this.game.add
          .tween(this.banner)
          .to({ alpha: 1 }, 500, Phaser.Easing.None, true)
      ]

      const { armor, health } = this._getDamage()

      if (armor > 0) {
        const toArmorTween = this.animateDamage(this.game.width / 2)
        tweens[tweens.length - 1].chain(toArmorTween)
        toArmorTween.onComplete.add(() => {
          // window.navigator.vibrate(50)
        })
        tweens.push(toArmorTween)
      }

      if (health > 0) {
        const toHealthTween = this.animateDamage(this.game.width - 100)
        tweens[tweens.length - 1].chain(toHealthTween)
        toHealthTween.onComplete.add(() => {
          // window.navigator.vibrate(200)
        })
        tweens.push(toHealthTween)
      }

      tweens[tweens.length - 1].onComplete.add(resolve)
    })
  }

  animateDamage (x) {
    const opts = { delay: 1500, y: this.game.height - 100, x }
    const tween = this.game.add
      .tween(this.banner)
      .to(opts, 500, Phaser.Easing.None)
    return tween
  }

  _hideOverlay () {
    return new Promise(resolve => {
      const tween = this.game.add
        .tween(this.graphics)
        .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

      this.game.add
        .tween(this.banner)
        .to({ alpha: 0 }, 500, Phaser.Easing.None, true)

      tween.onComplete.add(resolve)
    })
  }

  _getDamage () {
    let armor = 0
    let health = 0
    let damage = this.damage

    if (damage > 0) {
      health += damage
    }
    return { armor, health }
  }

  _initText (x, y, string, fill, size) {
    const text = this.game.add.text(x, y, string)
    text.padding.set(10, 16)
    text.anchor.setTo(0.5)
    text.fontSize = size
    text.fill = fill
    return text
  }
}

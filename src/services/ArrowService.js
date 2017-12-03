import Phaser from 'phaser'

export default class ArrowService {
  constructor (gameService) {
    this.game = window.game
    this.damageService = gameService.damageService
    this.tileService = gameService.tileService
    this.matchService = gameService.matchService
    this.update = this.update.bind(this)

    this.group = this.game.add.group()
    this.group.x = window.leftBuffer
    this.group.y = window.topBuffer
    this.group.alpha = 0.9

    this.damageText = this.game.add.text(0, 0, 'dmg')

    this.clear()
  }

  update (position, tiles) {
    this.damageText.x = position.x
    this.damageText.y = position.y - 80

    if (JSON.stringify(tiles.map(t => t.gridIndex)) === this.tileIndexes) {
      return
    }
    this.clear()
    this.tileIndexes = JSON.stringify(tiles.map(t => t.gridIndex))

    if (this.matchService.hasValidMatch()) {
      this.damageText.alpha = 1
      this.damageText.text = `MATCH`
    }

    tiles.forEach((tile, index) => {
      if (index === 0) {
        // window.navigator.vibrate(10)
        return
      }

      this._createArrow(tiles[index], tiles[index - 1])
    })
  }

  clear () {
    this.tileIndexes = null
    this.group.removeAll(true)
    this.damageText.fill = '#f00'
    this.damageText.alpha = 0
    this.arrows = []
  }

  _createArrow (a, b) {
    const arrow = this.game.add.sprite(
      b.x * this.tileService.size + this.tileService.size / 2,
      b.y * this.tileService.size + this.tileService.size / 2,
      'arrows'
    )
    arrow.anchor.set(0.5)
    arrow.scale.setTo(window.scale * 1.8)
    this.group.add(arrow)
    this.arrows.push(arrow)

    const diff = new Phaser.Point(a.x, a.y)
    diff.subtract(b.x, b.y)

    if (diff.x === 0) {
      arrow.angle = -90 * diff.y
    } else {
      arrow.angle = 90 * (diff.x + 1)
      if (diff.y !== 0) {
        arrow.frame = 1
        if (diff.y + diff.x === 0) {
          arrow.angle -= 90
        }
      }
    }
  }
}

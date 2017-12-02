import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBg'
    )
    this.loaderBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBar'
    )

    for (var i = 1; i <= window.numLevels; i++) {
      this.load.tilemap(
        `level${i}`,
        `assets/levels/level_${i}.json`,
        null,
        Phaser.Tilemap.TILED_JSON
      )
    }

    this.loaderBg.anchor.setTo(0.5)
    this.loaderBar.anchor.setTo(0.5)

    this.load.setPreloadSprite(this.loaderBar)
    this.load.spritesheet('arrows', 'assets/images/arrows.png', 210, 210)
    this.load.image('tile', 'assets/images/Tiles.png')
    this.load.image('menu', 'assets/images/menu.png')
    this.load.image('box', 'assets/images/box.png')
  }

  create () {
    this.state.start('Game')
  }
}

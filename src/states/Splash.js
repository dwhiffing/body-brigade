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

    this.load.image('instructions_base', 'assets/images/instructions_base.png')

    for (var j = 1; j <= 12; j++) {
      this.load.image(
        `instructions_${j}`,
        `assets/images/instructions_${j}.png`
      )
    }

    this.loaderBg.anchor.setTo(0.5)
    this.loaderBar.anchor.setTo(0.5)

    this.load.setPreloadSprite(this.loaderBar)
    this.load.spritesheet('arrows', 'assets/images/arrows.png', 210, 210)

    this.load.image('close', 'assets/images/close.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.image('tile', 'assets/images/Tiles.png')

    this.load.image('header', 'assets/images/header.png')
    this.load.image('footer', 'assets/images/footer.png')

    this.load.image('win-menu', 'assets/images/win-menu@2x.png')
    this.load.image('lose-menu', 'assets/images/lose-menu@2x.png')
    this.load.image('mute-button', 'assets/images/mute-button.png')

    this.load.image('retry-button', 'assets/images/retry-button.png')
    this.load.image('right-button', 'assets/images/right-button.png')
    this.load.image('stop-button', 'assets/images/stop-button.png')
  }

  create () {
    this.state.start('Menu')
  }
}

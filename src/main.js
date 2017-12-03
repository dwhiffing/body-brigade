import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import MenuState from './states/Menu'
import GameOverState from './states/GameOver'

window.maxGameWidth = document.getElementById('content').offsetWidth
window.maxGameHeight =
  document.getElementById('content').offsetHeight || window.innerHeight
window.numLevels = 25
window.numTiles = 13
window.gridDim = 6
window.scale = window.maxGameWidth / 768
window.scale2 = window.innerWidth / 768

class Game extends Phaser.Game {
  constructor () {
    const tileSize = 128

    window.gridSize = window.gridDim * tileSize * window.scale
    window.tileSize = window.gridSize / window.gridDim
    window.leftBuffer = 0
    window.topBuffer = (window.maxGameHeight - window.gridSize) / 2 - 65

    const width = window.maxGameWidth
    const height = window.innerHeight
    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('GameOver', GameOverState, false)
  }
}

window.game = new Game()
window.game.state.start('Boot')

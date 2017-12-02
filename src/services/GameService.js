import ArrowService from './ArrowService'
import TileService from './TileService'
import MatchService from './MatchService'
import Menu from '../sprites/Menu'
import UIService from './UIService'
import DamageService from './DamageService'

export default class GameService {
  constructor (state) {
    this.game = window.game
    this.removedTiles = []
    this.visited = []
    this.state = state
    this.level = 1

    this.menus = {
      1: { title: 'Blue' },
      11: { title: 'Purple' },
      21: { title: 'Green' }
    }

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)

    this.uiService = new UIService()
    this.tileService = new TileService(this.level)

    this.damageService = new DamageService(this)

    this.uiService.init(this)

    this.matchService = new MatchService(this)
    this.arrowService = new ArrowService(this)

    this.menu = new Menu({ game: this.game })

    this.restartLevel()
  }

  onPress ({ position }) {
    const tileSelected = this.matchService.selectTile(position)
    if (tileSelected) {
      this.game.input.onDown.remove(this.onPress, this)
      this.game.input.onUp.add(this.onRelease, this)
      this.game.input.addMoveCallback(this.onMove, this)
    }
  }

  onMove ({ position }) {
    this.matchService.selectTile(position)
    this.arrowService.update(position, this.matchService.getTilesInMatch())
  }

  onRelease () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    this.arrowService.clear()

    const match = this.matchService.resolveMatch()
    if (match) {
      this.tileService.spreadCancer(match)
      const hasWon = this.tileService.numMalignantRemaining() === 0
      const numMatches = this.tileService.numMatchesRemaining()
      const hasLost = numMatches === 0

      if (hasWon) {
        setTimeout(() => {
          this.nextLevel()
        }, 1000)
      } else if (hasLost) {
        this.restartLevel()
      }
    }

    this.allowInput()

    this.matchService.clearPath()
    this.allowInput()
  }

  allowInput () {
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }

  restartLevel () {
    this.game.input.onUp.remove(this.onRelease, this)
    this.game.input.deleteMoveCallback(this.onMove, this)

    if (this.menus[this.level]) {
      this.menu.show(this.menus[this.level]).then(() => {
        this.allowInput()
      })
    } else {
      this.allowInput()
    }

    if (this.level > window.numLevels) {
      this.game.state.start('GameOver')
    } else {
      this.tileService.loadLevel(this.level)
    }
    this.game.world.bringToTop(this.arrowService.group)
    this.game.world.bringToTop(this.arrowService.damageText)
    this.game.world.bringToTop(this.menu.group)
  }

  nextLevel () {
    this.level++
    this.restartLevel()
  }

  prevLevel () {
    this.level--
    this.restartLevel()
  }
}

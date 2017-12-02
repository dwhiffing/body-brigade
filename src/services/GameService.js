import ArrowService from './ArrowService'
import TileService from './TileService'
import MatchService from './MatchService'
import Menu from '../sprites/Menu'
// import UIService from './UIService'
import DamageService from './DamageService'

export default class GameService {
  constructor (state) {
    this.game = window.game
    this.removedTiles = []
    this.visited = []
    this.state = state

    let tileData = null

    try {
      tileData = JSON.parse(localStorage.getItem('tile'))
    } catch (e) {}

    this.allowInput = this.allowInput.bind(this)
    this.game.input.onDown.add(this.onPress, this)

    // this.uiService = new UIService()
    this.tileService = new TileService()

    this.tileService.init(this, tileData)

    this.damageService = new DamageService(this)

    // this.uiService.init(this)

    this.arrowService = new ArrowService(this)
    this.matchService = new MatchService(this)

    this.menu = new Menu({ game: this.game })
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
      match.forEach(tile => {
        tile.picked = false
        this.tileService.destroyTile(tile)
      })

      this.tileService.placeNewTiles(match)
      this.allowInput()
      // this.menu.show({
      //   data: menu.data,
      //   title: menu.title,
      // })
    }

    this.matchService.clearPath()
    this.allowInput()
  }

  allowInput () {
    this.tileService.save()
    if (!this.game.input.onDown.has(this.onPress, this)) {
      this.game.input.onDown.add(this.onPress, this)
    }
  }
}

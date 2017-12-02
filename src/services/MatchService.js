export default class MatchService {
  constructor (gameService) {
    this.game = window.game
    this.tileService = gameService.tileService
    this.path = []
  }

  selectTile (position) {
    const tile = this.tileService.getTile(position)
    if (!tile || this._checkForDeselect(tile) || tile.picked) {
      return
    }

    if (
      this.path.length === 0 &&
      this.tileService.getTileType(tile) === 'bonus'
    ) {
      this._highlightMatchingTiles(tile.index)
      this._select(tile)
      return tile
    }

    const last = this._getLast(1)
    if (this._isValidMatch(tile, last)) {
      this._select(tile)
      return [tile, last]
    }
  }

  getMatch () {
    let match = []
    for (let i = 0; i < this.path.length; i++) {
      const tile = this.tileService.tiles[this.path[i]]
      match.push(tile)
    }
    return match
  }

  hasValidMatch (match = this.getMatch()) {
    return match[match.length - 1].index === 1
  }

  resolveMatch () {
    const match = this.getMatch()
    if (match.length === 1) {
      return false
    }

    if (this.hasValidMatch(match)) {
      for (let i = match.length - 1; i >= 0; i--) {
        const strongIndex = match[0].index + 1
        const type = i === match.length - 1 ? strongIndex : 1
        this.tileService.updateTile(match[i], type)
      }
      return match
    }

    this.clearPath()
  }

  clearPath () {
    this.path.forEach(t => (this.tileService.tiles[t].picked = false))
    this.path = []
    this.tileService.map.forEach(tile => {
      tile.alpha = 1
      tile.dirty = true
    })
  }

  getTilesInMatch () {
    return this.path.map(t => this.tileService.tiles[t])
  }

  _select (tile) {
    tile.picked = true
    this.path.push(tile.gridIndex)
  }

  _checkForDeselect (tile) {
    if (this._getLast(2) && tile.gridIndex === this._getLast(2).gridIndex) {
      this._getLast(1).picked = false
      this.path.pop()
      return true
    }
  }

  _getLast (n) {
    if (this.path.length < n) {
      return
    }
    return this.tileService.tiles[this.path[this.path.length - n]]
  }

  _highlightMatchingTiles (index) {
    this.tileService.map.forEach(tile => {
      tile.alpha = tile.index === index ? 1 : 0.5
      tile.dirty = true
    })
  }

  _isValidMatch (tile, last) {
    if (this.path.length === 1) {
      this.matchType = last.index
    }
    if (!last || last.index === 1) {
      return
    }
    // tile must be same medicine to match
    // if match is already of length 2/3, then red blood cells are also valid
    // a match cannot be resolved if it doesn't end with a red blood cell
    const isAdjacent = this.tileService._checkAdjacent(tile, last)
    const isBonus =
      this.tileService.getTileType(tile) === 'bonus' &&
      tile.index === this.matchType
    const isLongEnough = this.path.length === Math.ceil(this.matchType / 4)
    const isBloodCell = tile.index === 1
    const thing = isLongEnough ? isBloodCell : isBonus
    return isAdjacent && thing
  }
}

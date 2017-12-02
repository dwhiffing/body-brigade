export default class MatchService {
  constructor (gameService) {
    this.game = window.game
    this.tileService = gameService.tileService
    this.path = []
  }

  selectTile (position) {
    const tile = this.tileService.getTile(position)
    if (!tile) {
      return
    }
    if (this._checkForDeselect(tile) || tile.picked) {
      this._highlightMatchingTiles(tile, false)
      return
    }

    if (
      this.path.length === 0 &&
      this.tileService.getTileType(tile) === 'bonus'
    ) {
      this._highlightMatchingTiles(tile, true)
      this._select(tile)
      return tile
    }

    const last = this._getLast(1)
    if (this._isValidMatch(tile, last)) {
      this._highlightMatchingTiles(tile, true)
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
    return match[match.length - 1].index === window.numTiles
  }

  resolveMatch () {
    const match = this.getMatch()
    if (match.length === 1) {
      return false
    }

    if (this.hasValidMatch(match)) {
      for (let i = match.length - 1; i >= 0; i--) {
        const strongIndex = match[0].index + 1
        const type = i === match.length - 1 ? strongIndex : window.numTiles
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

  _highlightMatchingTiles (_tile, useIsLongEnough) {
    const tiles = this.tileService
      .getAdjacentForTile(_tile)
      .concat(this.tileService.getDiagonalForTile(_tile))

    this.tileService.map.forEach(tile => {
      tile.alpha =
        tile === _tile || this.path.includes(tile.gridIndex) ? 1 : 0.5
      if (tiles.indexOf(tile) > -1) {
        if (
          this.path.includes(tile.gridIndex) ||
          _tile === tile ||
          this._tilesCanMatch(tile, _tile, _tile.index, useIsLongEnough)
        ) {
          tile.alpha = 1
        }
      }
      tile.dirty = true
    })
  }

  _isValidMatch (tile, last) {
    if (this.path.length === 1) {
      this.matchType = last.index
    }
    return this._tilesCanMatch(tile, last, this.matchType, false)
  }

  _tilesCanMatch (tile, last, matchType, useIsLongEnough) {
    if (!last || last.index === window.numTiles) {
      return
    }
    // tile must be same medicine to match
    // if match is already of length 2/3, then red blood cells are also valid
    // a match cannot be resolved if it doesn't end with a red blood cell
    const isAdjacent = this.tileService._checkAdjacent(tile, last)
    const isBonus =
      this.tileService.getTileType(tile) === 'bonus' && tile.index === matchType
    const isBloodCell = tile.index === window.numTiles
    const isLongEnough =
      this.path.length === Math.ceil(matchType / 4) - (useIsLongEnough ? 1 : 0)
    const thing = isLongEnough ? isBloodCell : isBonus
    return isAdjacent && thing
  }
}

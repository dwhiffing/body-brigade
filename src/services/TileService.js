// import Tile from '../sprites/Tile'

export default class TileService {
  constructor (level) {
    this.game = window.game
    this.size = 128
    this.loadLevel(level)
  }

  loadLevel (level) {
    this.destroyLevel()
    this.size = 128

    this.map = this.game.add.tilemap('level' + level, 2, 2)
    this.map.tileWidth = this.size
    this.map.tileHeight = this.size
    this.map.addTilesetImage('Tiles', 'tile')
    this.layer = this.map.createLayer('Tile Layer 1')

    this.updateTiles()
  }

  destroyLevel () {
    if (this.map) this.map.destroy()
    if (this.layer) this.layer.destroy()
  }

  getTile ({ x, y }) {
    const _x = x / this.size
    const _y = y / this.size
    const dx = _x - Math.floor(Math.abs(_x))
    const dy = _y - Math.floor(Math.abs(_y))
    if (dx < 0.85 && dy < 0.85) {
      const x = Math.floor(_x)
      const y = Math.floor(_y)
      return this.map.getTile(x, y, this.layer)
    }
  }

  updateTiles () {
    this.tiles = [].concat.apply([], this.layer.layer.data)
    this.tiles.map((t, i) => {
      t.gridIndex = i
      return t
    })
  }

  updateTile (tile, index) {
    this.map.putTile(index, tile.x, tile.y)
  }

  save () {
    localStorage.setItem('tile', JSON.stringify(this.tiles.map(t => t.index)))
  }

  getTileType (tile) {
    const index = (tile.index - 1) % 4
    switch (index) {
      case 0:
        return 'normal'
      case 1:
        return 'bonus'
      case 2:
        return 'strong'
      case 3:
        return 'malignant'
      case 4:
        return 'benign'
    }
  }

  spreadCancer () {
    const badTiles = this.tiles.map((t, i) => {
      return this.getTileType(t) === 'malignant' ? t.gridIndex : -1
    })

    this.map.forEach(tile => {
      if (badTiles.includes(tile.gridIndex)) {
        const tiles = this.getAdjacentForTile(tile)
        tiles.forEach(_tile => {
          if (_tile && _tile.index === 1) {
            this.updateTile(_tile, tile.index)
          }
        })
      }
    })
    this.map.forEach(tile => {
      if (badTiles.includes(tile.gridIndex)) {
        this.updateTile(tile, tile.index + 1)
      }
    })
    this.updateTiles()
  }

  getAdjacentForTile (tile) {
    if (!tile) {
      return []
    }
    const left = this.map.getTileLeft(0, tile.x, tile.y)
    const right = this.map.getTileRight(0, tile.x, tile.y)
    const above = this.map.getTileAbove(0, tile.x, tile.y)
    const below = this.map.getTileBelow(0, tile.x, tile.y)
    return [left, above, right, below]
  }

  getDiagonalForTile (tile) {
    if (!tile) {
      return []
    }
    const leftAbove = this.layer.layer.data[tile.y - 1][tile.x - 1]
    const rightAbove = this.layer.layer.data[tile.y - 1][tile.x + 1]
    const leftBelow = this.layer.layer.data[tile.y + 1][tile.x - 1]
    const rightBelow = this.layer.layer.data[tile.y + 1][tile.x + 1]
    return [leftAbove, rightAbove, leftBelow, rightBelow]
  }

  numMalignantRemaining () {
    return this.tiles.reduce((sum, tile) => {
      if (this.getTileType(tile) === 'malignant') {
        return sum + 1
      }
      return sum
    }, 0)
  }

  numMatchesRemaining () {
    const matches = this.tiles.map(tile => {
      let numPairs = 0
      if (this.getTileType(tile) === 'bonus') {
        const tiles = this.getAdjacentForTile(tile).concat(
          this.getDiagonalForTile(tile)
        )
        tiles.forEach(other => {
          if (
            tile.index === 2 ||
            (other &&
              this._checkAdjacent(tile, other) &&
              other.index === tile.index)
          ) {
            numPairs++
          }
        })
      }
      return numPairs
    })

    return matches.reduce((s, t) => t + s, 0)
  }

  _checkAdjacent (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
  }
}

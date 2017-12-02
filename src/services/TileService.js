// import Tile from '../sprites/Tile'

export default class TileService {
  constructor (level) {
    this.game = window.game
    this.size = 128
    this.loadLevel(level)
  }

  loadLevel (level) {
    this.destroyLevel()

    this.map = this.game.add.tilemap('level' + level)
    this.map.addTilesetImage('Tiles', 'tile')
    this.layer = this.map.createLayer('Tile Layer 1')

    this.updateTiles()
  }

  destroyLevel () {
    if (this.map) this.map.destroy()
    if (this.layer) this.layer.destroy()
  }

  getTile ({ x, y }) {
    return this.map.getTileWorldXY(x, y)
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
        const left = this.map.getTileLeft(0, tile.x, tile.y)
        const right = this.map.getTileRight(0, tile.x, tile.y)
        const above = this.map.getTileAbove(0, tile.x, tile.y)
        const below = this.map.getTileBelow(0, tile.x, tile.y)
        if (left && left.index === 1) {
          this.updateTile(left, tile.index)
        }
        if (right && right.index === 1) {
          this.updateTile(right, tile.index)
        }
        if (above && above.index === 1) {
          this.updateTile(above, tile.index)
        }
        if (below && below.index === 1) {
          this.updateTile(below, tile.index)
        }
      }
    })
    this.map.forEach(tile => {
      if (badTiles.includes(tile.gridIndex)) {
        this.updateTile(tile, tile.index + 1)
      }
    })
    this.updateTiles()
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
        this.tiles.forEach(other => {
          if (this._checkAdjacent(tile, other) && other.index === tile.index) {
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

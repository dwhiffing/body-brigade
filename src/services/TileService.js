import get from 'lodash/get'
import compact from 'lodash/compact'

export default class TileService {
  constructor (level) {
    this.game = window.game
    this.size = 128
  }

  loadLevel (level) {
    this._destroyLevel()
    this.size = 128

    this.map = this.game.add.tilemap('level' + level)
    this.map.tileWidth = this.size
    this.map.tileHeight = this.size
    this.map.addTilesetImage('Tiles', 'tile')
    this.layer = this.map.createLayer('Tile Layer 1')

    this.timers = this.game.add.group()
    for (let i = 0; i < 10; i++) {
      const timer = this.game.add.text(50, 50, 'test')
      timer.fill = 'white'
      timer.fontSize = 42
      timer.anchor.set(0.5)
      timer.kill()
      this.timers.add(timer)
    }

    this._updateTileIndexes()

    this.tiles.map((t, i) => {
      t.updateTimer = this._getUpdateTimer(t)

      t.resetSplitCounter = function () {
        this.splitCounter = 3 - Math.ceil(this.index / 4)
      }.bind(t)

      t.updateSplitCounter = function () {
        if (this.splitCounter === -1) {
          this.resetSplitCounter()
        }

        if (this.splitCounter > 0) {
          this.splitCounter -= 1
          this.updateTimer()
          return this.splitCounter + 1
        }

        return 0
      }.bind(t)

      if (this.getTileType(t) === 'malignant') {
        t.updateTimer()
      }
      return t
    })
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

  updateTile (tile, index) {
    this.map.putTile(index, tile.x, tile.y)
  }

  getTileType (tile) {
    if (tile.index === window.numTiles) {
      return 'normal'
    }
    const index = (tile.index - 1) % 4
    switch (index) {
      case 0:
        return 'bonus'
      case 1:
        return 'strong'
      case 2:
        return 'malignant'
      case 3:
        return 'benign'
    }
  }

  spreadCancer () {
    const badTiles = this.tiles.map((t, i) => {
      return this.getTileType(t) === 'malignant' ? t.gridIndex : -1
    })

    this.map.forEach(badTile => {
      if (!badTiles.includes(badTile.gridIndex)) {
        return
      }

      const splitCounter = badTile.updateSplitCounter()

      if (splitCounter === 0) {
        badTile.timer.kill()

        const tiles = compact(this.getAdjacentForTile(badTile))
        tiles.forEach(adjacent => {
          if (/bonus|normal/.test(this.getTileType(adjacent))) {
            this.updateTile(adjacent, badTile.index)
            adjacent.resetSplitCounter()
            adjacent.updateTimer()
          }
        })
        this.updateTile(badTile, badTile.index + 1)
      }
    })

    this._updateTileIndexes()
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
    const thing = this.layer.layer.data
    const leftAbove = get(thing, `[${tile.y - 1}][${tile.x - 1}]`)
    const rightAbove = get(thing, `[${tile.y - 1}][${tile.x + 1}]`)
    const leftBelow = get(thing, `[${tile.y + 1}][${tile.x - 1}]`)
    const rightBelow = get(thing, `[${tile.y + 1}][${tile.x + 1}]`)
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
          if (tile.index === 1) {
            numPairs++
          } else if (
            other &&
            this._checkAdjacent(tile, other) &&
            other.index === tile.index
          ) {
            numPairs++
          }
        })
      }
      return numPairs
    })

    return matches.reduce((s, t) => t + s, 0)
  }

  _getUpdateTimer (t) {
    t.timer = this.timers.getFirstDead()
    t.size = window.tileSize
    return () => {
      if (typeof t.splitCounter !== 'number') {
        t.resetSplitCounter()
      }
      const n = `${t.splitCounter + 1}`
      t.timer.reset(t.x * t.size + t.size / 2, t.y * t.size + t.size / 2)
      t.timer.text = n
    }
  }

  _updateTileIndexes () {
    this.tiles = [].concat.apply([], this.layer.layer.data)
    this.tiles.map((t, i) => {
      t.gridIndex = i
      return t
    })
  }

  _destroyLevel () {
    if (this.map) this.map.destroy()
    if (this.layer) this.layer.destroy()
  }

  _checkAdjacent (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
  }
}

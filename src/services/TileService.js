// import Tile from '../sprites/Tile'

export default class TileService {
  constructor () {
    this.game = window.game
    this.size = 128
    this.map = this.game.add.tilemap('level1')
    this.map.addTilesetImage('Tiles', 'tile')
    this.layer = this.map.createLayer('Tile Layer 1')
    this.updateTiles()
  }

  init (gameService, data) {
    this.gameService = gameService
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

  destroyTile (tile) {
    tile.index = -1
    this.map.removeTile(tile.x, tile.y)
  }

  save () {
    localStorage.setItem('tile', JSON.stringify(this.tiles.map(t => t.index)))
  }

  placeNewTiles () {
    this.tiles.forEach(tile => {
      if (tile.index === -1) {
        const randomType = Math.floor(Math.random() * 5) + 1
        this.map.putTile(randomType, tile.x, tile.y)
      }
    })
    this.updateTiles()
  }

  _checkAdjacent (p1, p2) {
    return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
  }
}

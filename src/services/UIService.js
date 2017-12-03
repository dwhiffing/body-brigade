export default class UIService {
  constructor () {
    this.game = window.game
    this.group = this.game.add.group()
    const x = window.maxGameWidth
    const y = window.game.height

    this.footer = window.game.add.graphics(0, 0)
    this.footer.beginFill(0x222222)
    this.footer.drawRect(0, y - 115, x, y)
    this.footer.beginFill(0x888888)
    this.footer.drawRect(0, y - 115, x, 5)
    this.footer.endFill()
    this.group.add(this.footer)
  }

  init (gameService) {
    this.state = gameService.state
    this.gameService = gameService
    this.textGroup = this.game.add.group()
    const x =
      window.maxGameWidth >= window.gridSize
        ? window.gridSize
        : window.game.width
    const y = window.game.height
    const last = this._initText(70, y - 60, 'Last', '#ffffff', 22, () => {
      this.gameService.prevLevel()
    })
    const next = this._initText(x - 70, y - 60, 'Next', '#ffffff', 22, () => {
      this.gameService.nextLevel()
    })
    next.anchor.x = 1
    const retry = this._initText(x / 2, y - 60, 'Retry', '#ffffff', 22, () => {
      this.gameService.restartLevel()
    })
    retry.anchor.x = 0.5
    this.textGroup.add(last)
    this.textGroup.add(next)
    this.textGroup.add(retry)
    this.textGroup.x = window.leftBuffer + 5

    this.group.add(this.textGroup)

    this.texts = { last, next, retry }
    this.update()
  }

  update () {}

  _initText (x, y, string, fill, size, callback) {
    const text = this.game.add.text(x, y, string)
    text.fill = fill
    text.fontSize = size
    if (callback) {
      text.inputEnabled = true
      text.events.onInputUp.add(callback)
    }
    return text
  }
}

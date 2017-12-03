export default class UIService {
  constructor () {
    this.game = window.game
    this.group = this.game.add.group()

    this.header = window.game.add.image(0, 0, 'header')
    this.header.scale.set(window.innerWidth / 640)
    this.group.add(this.header)

    this.footer = window.game.add.image(0, this.game.height, 'footer')
    this.footer.scale.set(window.innerWidth / 640)
    this.footer.anchor.y = 1
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

    this.leftButton = window.game.add.image(70, y - 10, 'right-button')
    this.leftButton.scale.set(-1, 1)
    this.leftButton.anchor.y = 1
    this.leftButton.inputEnabled = true
    this.leftButton.events.onInputUp.add(() => {
      this.gameService.prevLevel()
    })
    this.group.add(this.leftButton)

    this.nextButton = window.game.add.image(x - 20, y - 10, 'right-button')
    this.nextButton.anchor.x = 1
    this.nextButton.anchor.y = 1
    this.nextButton.inputEnabled = true
    this.nextButton.events.onInputUp.add(() => {
      this.gameService.nextLevel()
    })
    this.group.add(this.nextButton)

    this.retryButton = window.game.add.image(x / 2, y - 10, 'retry-button')
    this.retryButton.anchor.x = 0.5
    this.retryButton.anchor.y = 1
    this.retryButton.inputEnabled = true
    this.retryButton.events.onInputUp.add(() => {
      this.gameService.restartLevel()
    })
    this.group.add(this.retryButton)

    this.muteButton = window.game.add.image(20, 10, 'mute-button')
    this.muteButton.inputEnabled = true
    this.group.add(this.muteButton)
    this.muteButton.events.onInputUp.add(() => {
      this.gameService.hapticsEnabled = !this.gameService.hapticsEnabled
      this.muteButton.alpha = this.gameService.hapticsEnabled ? 1 : 0.5
    })

    this.quitButton = window.game.add.image(x - 20, 10, 'stop-button')
    this.quitButton.anchor.x = 1
    this.quitButton.inputEnabled = true
    this.quitButton.events.onInputUp.add(() => {
      this.game.state.start('Menu')
    })
    this.group.add(this.quitButton)
  }

  update () {}
}

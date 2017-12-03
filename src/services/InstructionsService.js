import Menu from '../sprites/Menu'

export default class InstructionService {
  constructor (state) {
    this.game = window.game
    this.instructions = []
    this.group = this.game.add.group()
    this.gameService = this.game.gameService
    this.base = new Menu({
      game: this.game,
      type: 'instructions_base',
      scale: window.scale * 0.8
    })

    this.group.add(this.base.group)
    for (let i = 1; i <= 12; i++) {
      this.instructions[i] = new Menu({
        game: this.game,
        type: 'instructions_' + i,
        overlay: false,
        scale: window.scale * 0.8,
        duration: 125
      })
      this.group.add(this.instructions[i].group)
    }

    this.close = this.game.add.sprite(this.game.width - 70, 30, 'close')
    this.close.inputEnabled = true
    this.close.events.onInputUp.add(() => {
      this.gameService.vibrate(10)
      this.destroy()
    })
    this.group.add(this.close)

    this.destroy = this.destroy.bind(this)
  }

  show () {
    // ...lol
    this.base.show()
    return new Promise(resolve => {
      this.showNumber(1).then(() => {
        this.showNumber(2).then(() => {
          this.showNumber(3).then(() => {
            this.showNumber(4).then(() => {
              this.showNumber(5).then(() => {
                this.showNumber(6).then(() => {
                  this.showNumber(7).then(() => {
                    this.showNumber(8).then(() => {
                      this.showNumber(9).then(() => {
                        this.showNumber(10).then(() => {
                          this.showNumber(11).then(() => {
                            this.showNumber(12).then(() => {
                              this.base.hide()
                              this.close.alpha = 0
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }

  showNumber (n) {
    return new Promise(resolve => {
      this.instructions[n].show().then(resolve)
    })
  }

  destroy () {
    this.group.removeAll(true)
  }
}

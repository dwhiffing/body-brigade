/* globals __DEV__ */
import Phaser from 'phaser'
import GameService from '../services/GameService'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.gameService = new GameService(this)
  }

  render () {
    if (__DEV__) {
    }
  }
}

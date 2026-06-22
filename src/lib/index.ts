import * as Kefir from 'kefir'
import _ from 'lodash'

var model: { [k: string]: { f: number, d: number } } = {}

export type KeyInput = 'd' | 'f'

function updateModelF(fivegram: string) {
  return function (letter: KeyInput) {
    var fg = model[fivegram]
    if (!fg) {
      model[fivegram] = { f: 0, d: 0 }
    }
    model[fivegram][letter]+=1
    return
  }
}
function predictNextLetter(fivegram: string): KeyInput {
  var m = model[fivegram]
  if (!m)
    return 'f'
  if (m.f > m.d)
    return 'f'
  return 'd'
}

export default function predict(inputS: Kefir.Observable<KeyInput, never>) {
  var lastSix = inputS.slidingWindow(6,6)
  return lastSix.map(s => {
    var fiveGram = _.slice(s, 0,5).join('')
    // predict next value
    var prediction = predictNextLetter(fiveGram)
    //make a fn to update model after i see real value
    var updateModel = updateModelF(fiveGram)
    // get the next letter now
    var last = _.last(s)!
    // update my model with it (HACK SIDE-EFFECTY)
    updateModel(last)
    return [prediction, last]
  })
}

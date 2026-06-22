
import * as Kefir from 'kefir'
import { type KeyInput } from './index.ts'

class Mean {
  private length: number = 0
  mean: number = 0

  constructor() {}

  push(x: number): number {
    const i = ++this.length
    const m = this.mean
    this.mean = m - m / i + x / i
    return this.mean
  }
}

function isCorrect(prediction: KeyInput, letter: KeyInput) {
  if (prediction === letter)
    return 1
  return 0
}

export default function runningMean(stream: Kefir.Observable<[KeyInput, KeyInput], never>) {
  var m = new Mean()
  return stream
    .map(r => isCorrect(r[0], r[1]))
    .map(p => {
      m.push(p)
      return m.mean
    })
}

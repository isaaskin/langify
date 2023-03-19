import { generateRandomNumbers } from './helpers'
import { describe, test, expect } from 'vitest'


describe('generateRandomNumbers', () => {
  test('generate random with max value 20 and count 2', () => {
    expect(generateRandomNumbers(20, 2).length).toBe(2)
  })

  test('generate random with max value 100 and count 100', () => {
    expect(generateRandomNumbers(8, 8).length).toBe(8)
  })

  test('generate random with max value 100 and count 120', () => {
    expect(() => generateRandomNumbers(100, 120)).toThrowError("Cannot generate a random number with given parameters")
  })

  test('generate random with max value 3 and count 4', () => {
    expect(generateRandomNumbers(3, 4).sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
  })

  test('generate random with max value 4 and count 4 except 1', () => {
    expect(generateRandomNumbers(4, 4, [1]).sort((a, b) => a - b)).toEqual([0, 2, 3, 4])
  })
})
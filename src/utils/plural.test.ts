import { describe, expect, it } from 'vitest'
import { pluralize } from './plural'

const TICKET_FORMS = { one: 'квиток', few: 'квитки', many: 'квитків' }

describe('pluralize', () => {
  it.each([
    [1, 'квиток'],
    [21, 'квиток'],
    [2, 'квитки'],
    [4, 'квитки'],
    [22, 'квитки'],
    [0, 'квитків'],
    [5, 'квитків'],
    [11, 'квитків'],
    [12, 'квитків'],
    [14, 'квитків'],
    [111, 'квитків'],
  ])('%i → %s', (count, expected) => {
    expect(pluralize(count, TICKET_FORMS)).toBe(expected)
  })
})

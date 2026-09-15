import { describe, expect, it } from 'vitest'
import { CONTROL_TICKETS, ids, T1 } from '../test/fixtures'
import { sortTickets, type SortOption } from './sortTickets'

describe('sortTickets', () => {
  it('cheapest: by price, ascending', () => {
    expect(ids(sortTickets(CONTROL_TICKETS, 'cheapest'))).toEqual(['T6', 'T1', 'T2', 'T3', 'T4', 'T5'])
  })

  it('fastest: by total duration, then by price on a tie', () => {
    expect(ids(sortTickets(CONTROL_TICKETS, 'fastest'))).toEqual(['T5', 'T6', 'T3', 'T4', 'T1', 'T2'])
  })

  it('optimal: by duration, then stops, then price', () => {
    expect(ids(sortTickets(CONTROL_TICKETS, 'optimal'))).toEqual(['T5', 'T3', 'T6', 'T4', 'T1', 'T2'])
  })

  it('does not modify the input array', () => {
    const input = Object.freeze([...CONTROL_TICKETS])

    const result = sortTickets(input, 'fastest')

    expect(result).not.toBe(input)
    expect(ids(input)).toEqual(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'])
  })

  it.each<SortOption>(['cheapest', 'fastest', 'optimal'])(
    '%s: id decides the order when all criteria are equal',
    (sortBy) => {
      const twins = [
        { ...T1, id: 'b' },
        { ...T1, id: 'c' },
        { ...T1, id: 'a' },
      ]

      expect(ids(sortTickets(twins, sortBy))).toEqual(['a', 'b', 'c'])
    },
  )
})

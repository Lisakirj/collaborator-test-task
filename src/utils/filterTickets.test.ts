import { describe, expect, it } from 'vitest'
import type { StopsCount } from '../features/tickets/types'
import { CONTROL_TICKETS, ids } from '../test/fixtures'
import { areAllStopsSelected, filterTicketsByStops } from './filterTickets'
import { sortTickets } from './sortTickets'

describe('filterTicketsByStops', () => {
  it.each<[StopsCount[], string[]]>([
    [[0], ['T5']],
    [[1], ['T1', 'T3']],
    [[2], ['T2', 'T6']],
    [[3], ['T4']],
  ])('filter %j → %j', (stops, expected) => {
    expect(ids(filterTicketsByStops(CONTROL_TICKETS, stops))).toEqual(expected)
  })

  it('filter [1, 2] with cheapest → T6, T1, T2, T3', () => {
    const filtered = filterTicketsByStops(CONTROL_TICKETS, [1, 2])

    expect(ids(sortTickets(filtered, 'cheapest'))).toEqual(['T6', 'T1', 'T2', 'T3'])
  })

  it('empty selection returns an empty list', () => {
    expect(filterTicketsByStops(CONTROL_TICKETS, [])).toEqual([])
  })

  it('all values keep all 6 tickets', () => {
    expect(filterTicketsByStops(CONTROL_TICKETS, [0, 1, 2, 3])).toHaveLength(6)
  })
})

describe('areAllStopsSelected', () => {
  it.each<[StopsCount[], boolean]>([
    [[0, 1, 2, 3], true],
    [[3, 1, 0, 2], true],
    [[0, 1, 2], false],
    [[], false],
  ])('%j → %s', (stops, expected) => {
    expect(areAllStopsSelected(stops)).toBe(expected)
  })
})

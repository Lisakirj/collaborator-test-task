import { describe, expect, it } from 'vitest'
import { CONTROL_TICKETS, T1, T5 } from '../../test/fixtures'
import { hasConsistentStops, parseTickets } from './parseTickets'

describe('parseTickets', () => {
  it('returns a valid array of tickets', () => {
    expect(parseTickets(structuredClone(CONTROL_TICKETS))).toEqual(CONTROL_TICKETS)
  })

  it('rejects a response that is not an array', () => {
    expect(() => parseTickets({ tickets: [] })).toThrow(TypeError)
  })

  it.each([
    ['price is a string', { ...T1, price: '13300' }],
    ['only one segment', { ...T1, segments: [T1.segments[0]] }],
    ['invalid departure date', { ...T1, segments: [{ ...T1.segments[0], date: 'tomorrow' }, T1.segments[1]] }],
    ['different number of stops per direction', { ...T1, segments: [T1.segments[0], T5.segments[1]] }],
  ])('rejects a ticket where %s and reports its number', (_, invalid) => {
    expect(() => parseTickets([T5, invalid])).toThrow('Ticket #2')
  })
})

describe('hasConsistentStops', () => {
  it('true when both directions have the same allowed number of stops', () => {
    expect(hasConsistentStops(T1.segments)).toBe(true)
    expect(hasConsistentStops(T5.segments)).toBe(true)
  })

  it('false when the directions have a different number of stops', () => {
    expect(hasConsistentStops([T1.segments[0], T5.segments[1]])).toBe(false)
  })

  it('false when there are more stops than the filter allows', () => {
    const stops = ['IST', 'FRA', 'AMS', 'CDG']
    const segment = { ...T1.segments[0], stops }

    expect(hasConsistentStops([segment, { ...segment }])).toBe(false)
  })
})

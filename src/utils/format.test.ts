import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatDuration,
  formatFoundLabel,
  formatPrice,
  formatRange,
  formatShowMoreLabel,
  formatStopsCount,
  formatTime,
  toSegmentView,
} from './format'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('formatPrice', () => {
  it('groups digits and appends the dollar sign', () => {
    expect(formatPrice(13300).replace(/\s/g, ' ')).toBe('13 300 $')
    expect(formatPrice(900).replace(/\s/g, ' ')).toBe('900 $')
  })

  it('uses non-breaking spaces only, so the price never wraps', () => {
    expect(formatPrice(13300)).not.toContain(' ')
  })
})

describe('formatDuration', () => {
  it.each([
    [2055, '34г 15хв'],
    [545, '9г 05хв'],
    [60, '1г 00хв'],
    [45, '0г 45хв'],
  ])('%i min → %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected)
  })
})

describe('formatTime', () => {
  it.each(['UTC', 'America/New_York', 'Asia/Tokyo'])(
    'formats time in UTC regardless of the user time zone (%s)',
    (timeZone) => {
      vi.stubEnv('TZ', timeZone)

      expect(formatTime(new Date('2026-10-01T05:07:00Z'))).toBe('05:07')
    },
  )
})

describe('formatRange', () => {
  it('joins values with a spaced dash', () => {
    expect(formatRange('LHR', 'DXB')).toBe('LHR – DXB')
  })
})

describe('formatStopsCount', () => {
  it.each([
    [0, 'Без пересадок'],
    [1, '1 пересадка'],
    [2, '2 пересадки'],
    [3, '3 пересадки'],
    [5, '5 пересадок'],
  ])('%i → %s', (count, expected) => {
    expect(formatStopsCount(count)).toBe(expected)
  })
})

describe('formatShowMoreLabel', () => {
  it.each([
    [5, 'Показати ще 5 квитків'],
    [3, 'Показати ще 3 квитки'],
    [1, 'Показати ще 1 квиток'],
  ])('%i → %s', (count, expected) => {
    expect(formatShowMoreLabel(count)).toBe(expected)
  })
})

describe('formatFoundLabel', () => {
  it.each([
    [0, 'Рейсів, що відповідають заданим фільтрам, не знайдено'],
    [1, 'Знайдено 1 квиток'],
    [3, 'Знайдено 3 квитки'],
    [28, 'Знайдено 28 квитків'],
  ])('%i → %s', (count, expected) => {
    expect(formatFoundLabel(count)).toBe(expected)
  })
})

describe('toSegmentView', () => {
  it('computes arrival as departure + duration, including past midnight', () => {
    const view = toSegmentView({
      origin: 'LHR',
      destination: 'DXB',
      date: '2026-10-01T10:45:00Z',
      duration: 2055,
      stops: ['HKG', 'JNB'],
    })

    expect(view).toEqual({
      route: 'LHR – DXB',
      time: '10:45 – 21:00',
      duration: '34г 15хв',
      stopsLabel: '2 пересадки',
      stopsList: 'HKG, JNB',
    })
  })

  it('returns no airport list for a non-stop flight', () => {
    const view = toSegmentView({
      origin: 'DXB',
      destination: 'LHR',
      date: '2026-10-15T23:50:00Z',
      duration: 570,
      stops: [],
    })

    expect(view.time).toBe('23:50 – 09:20')
    expect(view.stopsLabel).toBe('Без пересадок')
    expect(view.stopsList).toBeNull()
  })
})

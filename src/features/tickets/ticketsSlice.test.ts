import { afterEach, describe, expect, it, vi } from 'vitest'
import { setupStore } from '../../app/store'
import { CONTROL_TICKETS } from '../../test/fixtures'
import { fetchTickets, selectTicketItems, selectTicketsStatus } from './ticketsSlice'

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchTickets', () => {
  it('loads tickets from data/tickets.json respecting BASE_URL', async () => {
    const fetchMock = mockFetch(Response.json(CONTROL_TICKETS))
    const store = setupStore()

    const request = store.dispatch(fetchTickets())
    expect(selectTicketsStatus(store.getState())).toBe('loading')
    await request

    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.BASE_URL}data/tickets.json`,
      expect.objectContaining({ signal: expect.any(AbortSignal) as unknown }),
    )
    expect(selectTicketsStatus(store.getState())).toBe('succeeded')
    expect(selectTicketItems(store.getState())).toEqual(CONTROL_TICKETS)
  })

  it('fails when the server responds with a non-2xx status', async () => {
    mockFetch(new Response(null, { status: 404 }))
    const store = setupStore()

    await store.dispatch(fetchTickets())

    expect(selectTicketsStatus(store.getState())).toBe('failed')
    expect(store.getState().tickets.error).toContain('404')
  })

  it('fails when the data does not match the expected format', async () => {
    mockFetch(Response.json([{ id: 't01' }]))
    const store = setupStore()

    await store.dispatch(fetchTickets())

    expect(selectTicketsStatus(store.getState())).toBe('failed')
    expect(selectTicketItems(store.getState())).toEqual([])
  })

  it('does not send a parallel duplicate request but allows a retry after a failure', async () => {
    const fetchMock = mockFetch(new Response(null, { status: 500 }))
    const store = setupStore()

    await Promise.all([store.dispatch(fetchTickets()), store.dispatch(fetchTickets())])
    expect(fetchMock).toHaveBeenCalledTimes(1)

    fetchMock.mockResolvedValue(Response.json(CONTROL_TICKETS))
    await store.dispatch(fetchTickets())

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(selectTicketsStatus(store.getState())).toBe('succeeded')
  })
})

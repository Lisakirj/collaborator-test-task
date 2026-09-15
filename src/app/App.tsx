import './App.scss'
import { useEffect } from 'react'
import { useAppDispatch } from './hooks'

import { fetchTickets } from '../features/tickets/ticketsSlice'
import Logo from '../components/Logo/Logo'
import StopsFilter from '../components/StopsFilter/StopsFilter'
import SortTabs from '../components/SortTabs/SortTabs'
import TicketList from '../components/TicketList/TicketList'




const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void dispatch(fetchTickets())
  }, [dispatch])

  return (
    <div className="app">
      <header className="app__header">
        <Logo />
      </header>
      <main className="app__main">
        <h1 className="app__title">Пошук авіаквитків</h1>
        <aside className="app__sidebar" aria-label="Фільтри">
          <StopsFilter />
        </aside>
        <section className="app__results" aria-label="Результати пошуку">
          <SortTabs />
          <TicketList />
        </section>
      </main>
    </div>
  )
}

export default App
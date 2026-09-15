import './SortTabs.scss'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectSortBy, sortChanged } from '../../features/sort/sortSlice'
import type { SortOption } from '../../utils/sortTickets'


interface SortTab {
  value: SortOption
  label: string
}

const TABS: readonly SortTab[] = [
  { value: 'cheapest', label: 'Найдешевший' },
  { value: 'fastest', label: 'Найшвидший' },
  { value: 'optimal', label: 'Оптимальний' },
]

export const SortTabs = () => {
  const dispatch = useAppDispatch()
  const sortBy = useAppSelector(selectSortBy)

  const handleSelect = (value: SortOption) => {
    // repeated click on active tab does not change the list and does not reset the loaded tickets
    if (value !== sortBy) {
      dispatch(sortChanged(value))
    }
  }

  return (
    <div className="sort-tabs" role="group" aria-label="Сортування квитків">
      {TABS.map(({ value, label }) => {
        const isActive = value === sortBy
        return (
          <button
            key={value}
            type="button"
            className={clsx('sort-tabs__button', isActive && 'sort-tabs__button--active')}
            aria-pressed={isActive}
            onClick={() => {
              handleSelect(value)
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
};

export default SortTabs;
import './StopsFilter.scss'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  allStopsToggled,
  selectSelectedStops,
  stopToggled,
} from '../../features/filters/filtersSlice'
import { selectIsAllStopsSelected } from '../../features/selectors'
import { formatStopsCount } from '../../utils/format'
import { STOPS_COUNTS } from '../../features/tickets/types'


interface StopsFilterOptionProps {
  label: string
  checked: boolean
  onChange: () => void
}

const StopsFilterOption = ({ label, checked, onChange }: StopsFilterOptionProps) => {
  return (
    <label className="stops-filter__item">
      <input className="stops-filter__input" type="checkbox" checked={checked} onChange={onChange} />
      <span className="stops-filter__checkbox" aria-hidden="true" />
      <span className="stops-filter__label">{label}</span>
    </label>
  )
}

const StopsFilter = () => {
  const titleId = useId()
  const dispatch = useAppDispatch()
  const selectedStops = useAppSelector(selectSelectedStops)
  const isAllSelected = useAppSelector(selectIsAllStopsSelected)

  return (
    <div className="stops-filter" role="group" aria-labelledby={titleId}>
      <h2 className="stops-filter__title" id={titleId}>
        Кількість пересадок
      </h2>
      <StopsFilterOption
        label="Всі"
        checked={isAllSelected}
        onChange={() => dispatch(allStopsToggled())}
      />
      {STOPS_COUNTS.map((count) => (
        <StopsFilterOption
          key={count}
          label={formatStopsCount(count)}
          checked={selectedStops.includes(count)}
          onChange={() => dispatch(stopToggled(count))}
        />
      ))}
    </div>
  )
}

export default StopsFilter
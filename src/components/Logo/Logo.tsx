import './Logo.scss'
import logoUrl from '../../assets/logo.svg'


const Logo = () => {

  return (
    <a className="logo" href={import.meta.env.BASE_URL} aria-label="Пошук авіаквитків - на головну">
      <img className="logo__image" src={logoUrl} alt="Логотип" width={60} height={60} />
    </a>
  )
}

export default Logo
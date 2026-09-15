import './Button.scss'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean
}

const Button = ({ block = false, className, type = 'button', ...props }: ButtonProps) => {
  return (
    <button {...props} type={type} className={clsx('button', block && 'button--block', className)} />
  )
}

export default Button

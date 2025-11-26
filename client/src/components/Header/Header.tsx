import './style.css'
import Image from 'next/image'
import logo from '../../../public/user-circle.svg'

export default function Header() {
  return (
    <header className="header">

      <section className='Logo sec'>
        <div className='  logo'>
          <Image src={logo} alt='logo' />
        </div>
        <h2 className='blocks'>Clockit</h2>
      </section>

      <section className='pages sec'>
        <h2 className='blocks' >Calendário</h2>
        <h2 className='blocks' >Dashboard</h2>

      </section>
    </header>
  )
}
import './style.css';
import Image from 'next/image';
import logo from '../../../public/user-circle.svg';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Header() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  const loggedIn = !!userId;

  return (
    <header className="header">
      <section className='Logo sec'>
        <div className='logo'>
          <Image src={logo} alt='logo' />
        </div>
        <h2 className='blocks'>Clockit</h2>
      </section>

      <section className='pages sec'>
        <Link className='pagesRedirect' href="/calendario"> <h2 className='blocks'>Calendário</h2> </Link>
        <Link className='pagesRedirect' href="/dashboard"> <h2 className='blocks'>Dashboard</h2> </Link>
        {!loggedIn && (
          <Link className='loginButton' href="/login">
            <h2 className="blocks">Logar</h2>
          </Link>
        )}
      </section>

    </header>
  );
}

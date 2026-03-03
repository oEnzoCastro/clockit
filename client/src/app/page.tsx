import React from 'react'

export default function page() {
  return (
    <div>
      
    </div>
  )
}

// 'use client';
// import React from 'react';
// import { useProtectedPage } from '../hooks/useProtectedPage';
// import { useAuth } from '../contexts/AuthContext';

// export default function Dashboard() {
//   useProtectedPage(); // protege a página

//   const { user } = useAuth();

//   return (
//     <div>
//       <h1>Bem-vindo, {user?.name}</h1>
//       <p>Seu papel: {user?.institute_role}</p>
//     </div>
//   );
// }


// 'use client';
// import { useProtectedPage } from '@/hooks/useProtectedPage';

// export default function Dashboard() {
//   const { checking } = useProtectedPage();

//   if (checking) return <div>Carregando...</div>;

//   return <div>Conteúdo do dashboard</div>;
// }
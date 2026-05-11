'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <section className="main-container" >
      <h1 className='text-3xl font-medium'>Default page running</h1>
      / running
    </section>
  );
}

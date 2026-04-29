'use client'

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main>
      <h1 className='text-3xl font-medium'>Default page running</h1>
      / running
      <Button onClick={() => router.push('/members')}>Dashboard</Button>
    </main>
  );
}

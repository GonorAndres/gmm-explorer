import { redirect } from 'next/navigation'

/**
 * Página principal - redirige al explorador de siniestros
 */
export default function Home() {
  redirect('/siniestros')
}

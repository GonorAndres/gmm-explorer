/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para Next.js 14

  // El dominio canónico es gmm.gonor.me. La URL que Vercel genera al crear el
  // proyecto sigue respondiendo, así que el tráfico y el posicionamiento se
  // reparten entre dos hosts. Se redirige el host exacto, no un sufijo
  // *.vercel.app, para no tocar los previews (<proyecto>-<hash>-<scope>).
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'gmm-explorer.vercel.app' }],
        destination: 'https://gmm.gonor.me/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

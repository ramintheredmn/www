/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
   rewrites: async () => {
       return [
       {
           source: '/api/:path*',
           destination:
           process.env.NODE_ENV === 'development'
               ? 'http://127.0.0.1:5000/api/:path*'
               : '/api/',
       },
       ]
 },
  experimental: {
    esmExternals: "loose",
},
}

module.exports = nextConfig

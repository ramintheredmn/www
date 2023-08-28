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
}

module.exports = nextConfig

// when you wanna build for production use the 3rd line 
// be sure that is not commented for development with flask dev server opned in 5000 port 
// be sure that the 3 line is commented and 4 to 14 is not commented

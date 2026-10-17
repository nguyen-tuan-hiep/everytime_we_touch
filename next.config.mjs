const githubPages = process.env.GITHUB_PAGES === 'true';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(githubPages ? { output: 'export', trailingSlash: true } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

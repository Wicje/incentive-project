import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wiscode Agency OS',
    short_name: 'Wiscode',
    description: 'Agency Management Operating System',
    start_url: '/',
    display: 'standalone',
    background_color: '#e5e5e5',
    theme_color: '#2F4560',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

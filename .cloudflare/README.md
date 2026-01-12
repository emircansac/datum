# Cloudflare Pages Deployment

This project is configured to deploy to Cloudflare Pages using `@cloudflare/next-on-pages`.

## Build Configuration

- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Node version**: 18 or higher

## Environment Variables

Set these in Cloudflare Pages dashboard:
- `ADMIN_PASSWORD` - Admin panel password
- `NEXT_PUBLIC_SITE_URL` - Your site URL (e.g., https://datum.pages.dev)

## Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run pages:build`
4. Set output directory: `.vercel/output/static`
5. Add environment variables
6. Deploy!

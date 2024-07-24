import { PUBLIC_WEBSITE_URL } from '$env/static/public';

export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${PUBLIC_WEBSITE_URL}/sitemap1.xml</loc>
      </sitemap>
    </sitemapindex>`,
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}

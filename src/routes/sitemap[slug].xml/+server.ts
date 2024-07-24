import { PUBLIC_WEBSITE_URL } from '$env/static/public';

export const GET = async ({ fetch, params }) => {
	const version = params.slug;
	const regex = new RegExp(/^(1|2|3|4|5)$/);

	if (!version || !version.match(regex)) {
		return new Response(JSON.stringify({ message: 'Param missing' }), { status: 400 });
	}

	const general =
		version === '1'
			? `<url>
            <loc>${PUBLIC_WEBSITE_URL}</loc>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>
         `
			: '';

	const generalCategories = async () => {
		const res = await fetch(`/api/v1/categories`);
		const data: any = await res.json();
		const categories = data && data.data ? data.data : [];
		return categories.map((item: { id: string; name: string }) => {
			return `
				<url>
					<loc>${PUBLIC_WEBSITE_URL}/tools/categories/${item?.id}-${encodeURIComponent(item?.name)?.toLowerCase()}</loc>
					<changefreq>daily</changefreq>
					<priority>0.7</priority>
				</url>
			`;
		});
	};

	const res = await fetch(`/api/v1/products/secret-sitemap?version=${version}`);
	const data: any = await res.json();

	const ids =
		data &&
		data.data &&
		data.data.length &&
		data.data
			.map((item: { id: string; name: string; updatedAt: Date }) => {
				return `
            <url>
              <loc>${PUBLIC_WEBSITE_URL}/tools/${item?.id}-${encodeURIComponent(item?.name)?.toLowerCase().replace(/ |_/g, '-')}</loc>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
			})
			.join('');

	return new Response(
		`
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
          xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="https://www.w3.org/1999/xhtml"
          xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
          xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
          xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
          xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
          <!-- <url> elements go here -->
          ${general}
					${await generalCategories()}
          ${ids || ''}
      </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
};

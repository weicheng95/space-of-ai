<script lang="ts">
	//@ts-ignore
	import hash from 'object-hash';
	export let article = false;
	export let author;

	/**
	 * @type {{ name: string; slug: string }[]}
	 */
	export let breadcrumbs;
	export let datePublished;
	export let lastUpdated;
	export let featuredImage;
	export let description;
	export let siteLanguage;
	export let siteTitle;
	export let siteTitleAlt;
	export let siteUrl: any;
	export let siteLogo: any;
	export let title;
	export let url;

	const entityHash = hash({ author }, { algorithm: 'md5' });

	const schemaOrgEntity = {
		'@type': ['Organization'],
		name: author,
		url: siteUrl,
		logo: `${siteUrl}/${siteLogo}`
	};

	const schemaOrgWebsite = {
		'@type': 'WebSite',
		'@id': `${url}#website`,
		url: siteUrl,
		name: siteTitle,
		description: siteTitleAlt,
		inLanguage: siteLanguage
	};

	const schemaOrgImageObject = {
		'@type': 'ImageObject',
		'@id': `${url}#primaryimage`,
		inLanguage: siteLanguage,
		url: `${featuredImage.url}`,
		contentUrl: `${featuredImage.url}`,
		width: featuredImage.width,
		height: featuredImage.height,
		caption: featuredImage.caption
	};

	const schemaOrgBreadcrumbList = {
		'@type': 'BreadcrumbList',
		'@id': `${url}#breadcrumb`,
		itemListElement: breadcrumbs.map((element: { slug: any; name: any }, index: number) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'WebPage',
				'@id': `${siteUrl}/${element.slug}`,
				url: `${siteUrl}/${element.slug}`,
				name: element.name
			}
		}))
	};

	const schemaOrgWebPage = {
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: title,
		isPartOf: {
			'@id': `${siteUrl}/#website`
		},
		primaryImageOfPage: {
			'@id': `${url}#primaryimage`
		},
		datePublished,
		dateModified: lastUpdated,
		author: {
			'@type': 'Person',
			name: author,
			url: siteUrl
		},
		description: description,
		breadcrumb: {
			'@id': `${url}#breadcrumb`
		},
		inLanguage: siteLanguage,
		potentialAction: [
			{
				'@type': 'ReadAction',
				target: [url]
			}
		]
	};

	let schemaOrgArticle = null;
	if (article) {
		schemaOrgArticle = {
			'@type': 'Article',
			'@id': `${url}#article`,
			isPartOf: {
				'@id': `${url}#webpage`
			},
			author: {
				'@type': 'Person',
				name: author,
				url: siteUrl
			},
			headline: title,
			datePublished,
			dateModified: lastUpdated,
			mainEntityOfPage: {
				'@id': `${url}#webpage`
			},
			publisher: {
				'@id': `${siteUrl}/#/schema/person/${entityHash}`
			},
			image: {
				'@id': `${url}#primaryimage`
			},
			articleSection: ['blog'],
			inLanguage: siteLanguage
		};
	}

	const schemaOrgArray = [
		schemaOrgEntity,
		schemaOrgWebsite,
		schemaOrgImageObject,
		schemaOrgWebPage,
		schemaOrgBreadcrumbList,
		...(article ? [schemaOrgArticle] : []),
	];
	const schemaOrgObject = {
		'@context': 'https://schema.org',
		'@graph': schemaOrgArray
	};
	let jsonLdString = JSON.stringify(schemaOrgObject);
	let jsonLdScript = `
		<script type="application/ld+json">
			${jsonLdString}
		${'<'}/script>
	`;
</script>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>

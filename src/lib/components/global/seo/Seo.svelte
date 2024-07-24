<script lang="ts">
	import website from '$lib/website.config';
	import Twitter from './Twitter.svelte';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import OpenGraph from './OpenGraph.svelte';
	import SchemaOrg from './SchemaOrg.svelte';

	const {
		ogLanguage,
		siteName,
		author,
		facebookAuthorPage,
		facebookPage,
		siteImage,
		siteImageAlt,
		siteTitle,
		siteShortTitle,
		siteDescription,
		siteLanguage,
		siteLogo,
		twitterUsername,
		keywords
	} = website;

	export let article = false;
	export let days: any | null = null;
	export let description = '';
	export let breadcrumbs: any[] = [];
	export let slug = '';
	export let timeToRead = 0;
	export let title = '';
	export let lastUpdated = '';
	export let datePublished = '';
	export let image = '';
	export let articleKeywords = '';
	export let siteUrl = '';
	export let url = '';
	export let imageAlt = '';

	export let twitterImage = {
		url: image || `${PUBLIC_WEBSITE_URL}/${siteImage}`,
		alt: imageAlt || siteImageAlt
	};
	export let ogImage = {
		url: image || `${PUBLIC_WEBSITE_URL}/${siteImage}`,
		alt: imageAlt || siteImageAlt
	};
	export let featuredImage = {
		url: image || `${PUBLIC_WEBSITE_URL}/${siteImage}`,
		alt: imageAlt || siteImageAlt,
		width: 672,
		height: 448
	};

	const pageTitle = title ? `${title} | ${siteName}` : siteTitle;
	const openGraphProps = {
		article,
		image: ogImage,
		description: description || siteDescription,
		ogLanguage,
		pageTitle,
		siteName,
		siteUrl: url || PUBLIC_WEBSITE_URL,
		...(article ? { datePublished, lastUpdated, facebookPage, facebookAuthorPage } : {})
	};
	
	const twitterProps = {
		article,
		twitterUsername,
		image: twitterImage,
		description: description || siteDescription,
		pageTitle,
		timeToRead,
		url: url || PUBLIC_WEBSITE_URL,
		imageUrl: `${twitterImage.url}`
	};

	const schemaOrgProps = {
		article,
		author,
		breadcrumbs,
		datePublished,
		lastUpdated,
		featuredImage,
		description: description || siteDescription,
		siteLanguage,
		siteTitle,
		siteTitleAlt: siteShortTitle,
		siteUrl: siteUrl || PUBLIC_WEBSITE_URL,
		title: pageTitle,
		url: url,
		facebookPage,
		twitterUsername,
		siteLogo,
		days
	};
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description || siteDescription} />
	<meta name="keywords" content={articleKeywords || keywords} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />

export interface Product {
	id: string;
	name: string;
	icon_url: string;
	website_image_url?: string;
	url: string;
	description: string;
	categories: {
		id: string;
		name: string;
	};
	status_type?: string;
}

export interface ProductDetail extends Product {
	meta: {
		who: string;
		what: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pricing: any;
		best_features: string[];
	};
	subcategory: string[];
}

export interface Category {
	id: number;
	name: string;
}

export interface Pricing {
	plan: string;
	price: number;
	features: string[];
}

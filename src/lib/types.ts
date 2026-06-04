export type PlatformLink = {
	url: string | null;
	label: string;
	comingSoon?: boolean;
};

export type GameDevice = 'browser' | 'windows' | 'linux';

export type GameFormat = 'web' | 'desktop';

export type Game = {
	id: string;
	title: string;
	tagline: string;
	description: string;
	cover: string | null;
	featured: boolean;
	price?: number | null;
	devices?: GameDevice[];
	platforms: {
		itch: PlatformLink;
		steam: PlatformLink;
	};
	tags: string[];
	releaseDate: string;
};

export type SiteConfig = {
	name: string;
	tagline: string;
	url: string;
	/** Site-relative path to default Open Graph / Twitter card image */
	ogImage?: string;
	author: {
		name: string;
		email: string;
	};
	social: {
		itch: string;
		twitter: string;
	};
};

export type BlogPostMeta = {
	title: string;
	description: string;
	date: string;
	published?: boolean;
	tags?: string[];
	cover?: string;
};

export type BlogPost = BlogPostMeta & {
	slug: string;
	content: string;
	html: string;
	readingTime: number;
};

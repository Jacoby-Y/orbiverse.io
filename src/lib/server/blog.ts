import matter from 'gray-matter';
import { marked } from 'marked';
import { toIsoDate } from '$lib/seo';
import type { BlogPost, BlogPostMeta } from '$lib/types';

const WORDS_PER_MINUTE = 200;

const rawPosts = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function slugFromPath(path: string): string {
	return path.split('/').pop()?.replace(/\.md$/, '') ?? '';
}

function readingTime(text: string): number {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function parsePost(path: string, raw: string): BlogPost | null {
	const { data, content } = matter(raw);
	const meta = data as BlogPostMeta;

	if (meta.published === false) return null;

	const slug = slugFromPath(path);

	return {
		slug,
		title: meta.title,
		description: meta.description,
		date: toIsoDate(meta.date),
		published: meta.published ?? true,
		tags: meta.tags ?? [],
		cover: meta.cover,
		content,
		html: marked.parse(content, { async: false }) as string,
		readingTime: readingTime(content)
	};
}

const posts: BlogPost[] = Object.entries(rawPosts)
	.map(([path, raw]) => parsePost(path, raw))
	.filter((post): post is BlogPost => post !== null)
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllPosts(): BlogPost[] {
	return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
	return posts.find((post) => post.slug === slug);
}

export function getLatestPosts(limit = 3): BlogPost[] {
	return posts.slice(0, limit);
}

export function getAdjacentPosts(slug: string): {
	prev: BlogPost | undefined;
	next: BlogPost | undefined;
} {
	const index = posts.findIndex((post) => post.slug === slug);
	return {
		prev: index > 0 ? posts[index - 1] : undefined,
		next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined
	};
}

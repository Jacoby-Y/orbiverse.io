import { error } from '@sveltejs/kit';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '$lib/server/blog';
import { buildBlogPostSeo } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const post = getPostBySlug(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	const { prev, next } = getAdjacentPosts(params.slug);

	return {
		post,
		prev,
		next,
		seo: buildBlogPostSeo(post)
	};
};

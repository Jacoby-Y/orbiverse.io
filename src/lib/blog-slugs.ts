const modules = import.meta.glob('/src/content/blog/*.md');

export function getBlogSlugs(): string[] {
	return Object.keys(modules).map((path) => path.split('/').pop()?.replace(/\.md$/, '') ?? '');
}

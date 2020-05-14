import React from 'react'

const BlogListItem = ({ blog }) => {
	return (
		<article className="flex flex-row p-2">
			<div className="flex flex-col flex-grow">
				<a href={blog.url} className="flex flex-grow-0 bold text-lg"><h2>{blog.title}</h2></a>
				<p className="flex flex-grow text-md">{blog.excerpt}</p>
			</div>
			<a href={blog.url} className="flex-none h-20 w-20 ml-4">
				<img className="object-cover h-full" src={blog.featureImage}>
				</img>
			</a>
		</article>
	)
}

const BlogList = ({ blogs }) => {
	return (
		<section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-4">
			{blogs.map((blog, i) => {
				return <BlogListItem key={i} blog={blog} />
			})}
		</section>
	)
}

export default BlogList
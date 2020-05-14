import React from 'react'
import PostContent from './PostContent'

const BlogPost = ({ blog }) => {

	return (
		<article className="w-full">
			{blog.featureImage ?
				<figure style={{
					height: '60vh',
					backgroundImage: `url(${blog.featureImage})`,
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover'
				}} className="w-full overflow-hidden">
				</figure>
				: <></>
			}

			<div className="w-full py-4 px-16">
				<header className="mb-8 text-center">
					<h1 className="bold text-4xl">{blog.title}</h1>
					<time className="bold text-lg text-indigo-700" dateTime={blog.date_published}>
						{new Date(blog.date_published).toDateString()}
					</time>
				</header>
				<PostContent content={blog.content || []} />
			</div>
		</article>
	)
}

export default BlogPost
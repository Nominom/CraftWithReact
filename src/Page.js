import React from 'react'
import PostContent from './components/PostContent'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'

const Page = ({ page }) => {

	if (page) {

		switch (page?.meta?.type) {
			case 'bloglist':
				return <BlogList blogs={page.data}/>
			case 'blogpost':
				return <BlogPost blog={page}/>
			case 'page':
				return <PostContent content={page.content || []}/>
			default:
				console.error('Unknown content type.')
		}
	}
	return (
		<>
		</>
	)
}

export default Page
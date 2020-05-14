import React from 'react'
import styled from 'styled-components'

const PostContainer = styled.div`

	font-size: 1.1rem;

	h1 {
		font-style: bold;
		font-size: 2rem;
	}
	h2 {
		font-style: bold;
		font-size: 1.6rem;
	}
	h3 {
		font-size: 1.3rem;
	}
	h4 {	
		font-style: italic;
		font-size: 1.2rem;
	}
	h5 {
		color: #222222;
		font-size: 1.1rem;
	}
	h6 {
		color: #222222;
		font-size: 1rem;
	}
	p {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	a {
		font-style: bold italic;
		border-bottom: 2px solid #05dd05;
		white-space: nowrap;
		&:hover {
			color: #05dd05;
		}
	}

	pre {
		margin-top: 1rem;
		background-color: #222222;
		padding: 0.5rem;
		padding-left: 1rem;
		border-radius: 0.5rem;
		color: #eeeeee;
	}

	blockquote {
		font-style: italic;
		border-left : 0.3rem solid #bbbbbb;
		color: #666666;
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
		padding-left: 1.5rem;
	}
`


const PostContent = ({ content }) => {
	return (
		<PostContainer className="w-full">
			{content.map((block, i) => {
				switch (block.type) {
					case "text":
						return <div key={i}
							dangerouslySetInnerHTML={{ __html: block.text }}>
						</div>
						break;
					case "image":

						return <figure key={i} className="w-full my-8">
							<img className="w-full h-auto" src={block.image}>
							</img>
						</figure>

						break;
					default:
						console.error("Content type not recognized: ", block.type)
						break;
				}
			})}
		</PostContainer>
	)
}

export default PostContent
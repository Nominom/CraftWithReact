This is part 3 of my tutorial on building a blog site with React front-end and Craft CMS. If you missed the first two, you can find them here: 
* [part1](https://dev.to/nominom/building-a-personal-blog-with-craft-cms-react-and-element-api-part-1-setting-up-2235) 
* [part2](https://dev.to/nominom/building-a-personal-blog-with-craft-cms-react-and-element-api-part-2-creating-a-blog-in-craft-425f)

All the code for this tutorial is available on [github](https://github.com/Nominom/CraftWithReact).

In this part we're going to create a front-end for our blog with React!

### Step 8 - Fetching JSON in react

Let's open up our **App.js** file. Currently, it should look something like this:
```js
import React from 'react'

const App = () => {
	return(
		<div>
			Hello World!
		</div>
	)
}

export default App
```

To render what's in  our Craft blog, we need a way to access the element api json endpoints. For this reason, we need to import [axios](https://github.com/axios/axios), and change our React import to include *useState* and *useEffect*.

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

...
```

Axios is a "Promise based HTTP client for the browser and node.js", that will execute the api calls to our backend.

Let's make our first api call to **/site.json**:
```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
	const [site,setSite] = useState(null)

	useEffect(() => {
		axios.get("/site.json").then((response) => {
			console.log(response.data)
			setSite(response.data);
		}).catch((error) => {
			console.error(error.message)
		})
	}, [])

	return (
		<div>
			Hello World!
		</div>
	)
}

export default App
```

If you're running the local php development server, you can open up another terminal and run
```console
$ npm run dev
```
... to run webpack in watch mode, where it will automatically watch for changes and rebuild the bundle when necessary. If you're running Craft on a remote server, you can set up WinSCP or similar to sync the **/web/res/** folder automatically.

If you now access http://localhost:3001/ and open up your development console, you should see that the json data gets printed to the console.

Let's also fetch the page's json data, by appending *.json* to the current url. We should also append any query parameters in the url to make Craft live preview work with our front-end.
```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
	const [page, setPage] = useState(null)
	const [site,setSite] = useState(null)

	const path = window.location.pathname
	const query = window.location.search

	useEffect(() => {
		axios.get("/site.json").then((response) => {
			console.log(response.data)
			setSite(response.data);
		}).catch((error) => {
			console.error(error.message)
		})
	}, [])

	useEffect(() => {
		axios.get(path + '.json' + query).then((response) => {
			console.log(response.data)
			setPage(response.data);
		}).catch((error) => {
			console.error(error.message)
		})
	}, [path, query])

	return (
		<div>
			Hello World!
		</div>
	)
}

export default App
```

Refresh the page, and now two console logs should pop up. One with our site data and one with our page data.

### Step 9 - Page layout

Let's add [tailwind](https://tailwindcss.com/) css include to our **templates/index.twig** file:
```html
<!DOCTYPE html>
<html lang="{{ craft.app.language }}">
	<head>
		...
		<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
	</head>
	...
</html>
```

Tailwind is a low-level css framework that will help us build a fairly good looking prototype without writing any actual css. You could also use another framework like bootstrap or write your own css classes. All of the styles here are just to make our example look a bit nicer.

*I will say though, I'm not a designer and don't pretend to be. So the layout is still a little bit rough. You have been warned.*

Let's also make a new folder under the **templates/** folder called **blog**, and copy the **templates/index.twig** to **templates/blog/index.twig**. This will make it so when we request for **/blog** url, Craft will show our React page instead of an 404 error.

To define our page layout, let's make a **Layout.js** file in our **src/** folder:
```js
import React from 'react'
import Nav from './components/Nav'

const Layout = ({ children, site }) => {
	return (
		<div className="flex min-h-screen">
			<div className="flex flex-col flex-grow mx-auto container px-4 md:px-8 xl:px-20">
				<header className="flex flex-grow-0 md:p-4">
					<Nav pages={site?.pages || []} logo={site?.logo} />
				</header>
				<main className="flex flex-grow md:p-4">
					{children}
				</main>
				<footer className="flex flex-grow-0 justify-center p-4 text-sm">
					{site?.footerText}
				</footer>
			</div>
		</div>
	)
}

export default Layout
```

Let's also make a simple navigation bar to show our site pages. Make a new folder in **src/** called **components**, and create a new file called **Nav.js**. Paste in the following contents:
```js
import React, { useState } from 'react'

const Nav = ({ pages, logo }) => {
	const [open, setOpen] = useState(false)

	const switchState = () => {
		setOpen(!open)
	}

	return (
		<div
			className="flex flex-col w-full mx-auto md:items-center 
			md:justify-between md:flex-row">
			<div className="py-2 flex flex-row items-center justify-between">
				{logo ?
					<a href={window.location.host}>
						<img className="h-12" src={logo} alt="logo" />
					</a>
					: <div className="h-12"></div>}
				<button className="md:hidden rounded-lg outline-none shadow-none p-2"
					onClick={switchState}>
					<svg className="fill-current h-5 w-5"
						viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
			<nav className={`flex-col flex-grow pb-4 md:pb-0 ${open ? 'flex' : 'hidden'} 
			md:flex md:flex-row`}>
				{pages.map((page, i) => {
					return (
						<a key={i} href={page.url}
							className="px-2 mt-4 text-2xl md:my-auto md:mx-2">
							{page.title}
						</a>
					)
				})}
			</nav>
		</div>
	)
}

export default Nav
```

This might look a bit complicated, but it's mostly just a lot of tailwind classes  and a button to make it responsive.

Without any styling or responsiveness, it would simply look like this:
```js
import React from 'react'

const Nav = ({ pages, logo }) => {

	return (
		<div>
			<div>
				{logo ?
					<a href={window.location.host}>
						<img src={logo} alt="logo" />
					</a>
					: <div></div>}
				
			</div>
			<nav>
				{pages.map((page, i) => {
					return (
						<a key={i} href={page.url}>
							{page.title}
						</a>
					)
				})}
			</nav>
		</div>
	)
}

export default Nav
```

Let's import our layout in **App.js** to see it in action:
```js
import ...
import Layout from './Layout'

const App = () => {
	...
	return (
		<Layout site={site}>
			Hello World!
		</Layout>
	)	
}

export default App
```

You should now see a navigation bar with your logo and our Home and Blog pages, and a footer with your defined footer text.

### Step 10 - Rendering page content

Next, we'll create a React component that renders our page content we have designed in Craft.

To start, let's create a Page component that decides what type of content to render on the current page. Here's where the meta objects we have in our json endpoint come in use: for each endpoint we are sending a type variable in the meta object. We can use that type to determine what we need to render.

Create a file called **Page.js** in the **src/** folder with the following contents:
```js
import React from 'react'

const Page = ({ page }) => {

	if (page) {

		switch (page?.meta?.type) {
			case 'bloglist':
				return <div>Blog List</div>
			case 'blogpost':
				return <div>Blog Post</div>
			case 'page':
				return <div>Page</div>
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
```

Let's also add the new component to our **App.js**:
```js
import ...
import Page from './Page'

const App = () => {
	...
	return (
		<Layout site={site}>
			<Page page={page} />
		</Layout>
	)
	
}

export default App
```

If we now take a look at our Home and Blog pages, the page should show either 'page' or 'Blog List' depending on what page we are on.

Let's create a component that can render our Post Content matrix blocks. Create a file called **PostContent.js** in **src/components/** folder:
```js
import React from 'react'

const PostContent = ({ content }) => {
	return (
		<div className="w-full">
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
		</div>
	)
}

export default PostContent
```
 
And add it to our **Page.js**:

```js
import React from 'react'
import PostContent from './components/PostContent'

const Page = ({ page }) => {

	if (page) {

		switch (page?.meta?.type) {
			case 'bloglist':
				return <div>Blog List</div>
			case 'blogpost':
				return <div>Blog Post</div>
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
```

Now, if we navigate to the Home page, the content should appear. What you might notice at least if you're using tailwind, is that all of our headings don't look like headings. 

Because we have no easy way to set classes to the html we get from the back-end, we'll have to use css child selectors to style our headers and such. We are going to use [styled components](https://styled-components.com/) to add some actual css, but you can also do this just by adding a css file in to your project.

Let's import styled components to our project.
```console
$ npm install --save styled-components
```
Then, we can make a styled component inside our **PostContent.js** that applies styles to it's children.

```js
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
				...
			})}
		</PostContainer>
	)
}

export default PostContent
```

Now our page should look a little nicer.

Another thing that's good to have in a blog website is a listing of all the blogs. So let's make one! 

Create a file called **BlogList.js** in **src/components/**, and paste in the following content:

```js
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
```

And let's import it to **Page.js**:

```js
import React from 'react'
import PostContent from './components/PostContent'
import BlogList from './components/BlogList'

const Page = ({ page }) => {

	if (page) {

		switch (page?.meta?.type) {
			case 'bloglist':
				return <BlogList blogs={page.data}/>
			case 'blogpost':
				return <div>Blog Post</div>
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
```

And now we have a neat listing of blogs in our Blog page.

One final thing we want to do is to create a page for the blog posts. We can reuse the PostContent component to show the content, but we'll have to make another component to show the title and our feature image.

Let's make a file called **BlogPost.js** in the **src/components/** folder with the following contents:
```js
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

			<div className="w-full py-4 sm:px-4 lg:px-16">
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
```

And again, import it to our Page:

```js
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
```

And there we go. Our blog site is ready!

There's still a lot we could do, but I don't want to drag on this 3-part tutorial for 5 more parts, so we're going to end it here. I hope this was informational and enough to get you started on your own project. 

I encourage you to play around a bit more and try to implement more features, or maybe you decided that Craft and React are not a good fit for you.

If you want to learn more, I would highly recommend checking out the [Craft CMS Docs](https://docs.craftcms.com/) and Helsinki University's [React web course](https://fullstackopen.com/en/). Unfortunately, Element API does not have much in the way of documentation, but you should still check out their [Github Page](https://github.com/craftcms/element-api).
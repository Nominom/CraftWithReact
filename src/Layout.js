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
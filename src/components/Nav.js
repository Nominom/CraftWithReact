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
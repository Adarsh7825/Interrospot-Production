import React, { useState, useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

import { NavbarLinks } from "../../data/navbar-links"
import InterroSpot from '../../assets/Logo/Logo-Full-Light.png'
import { MdKeyboardArrowDown } from "react-icons/md"
import { useSelector } from 'react-redux'
import ProfileDropdown from '../core/Auth/ProfileDropDown'
import MobileProfileDropDown from '../core/Auth/MobileProfileDropDown'


const Navbar = () => {
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);



    // when user click Navbar link then it will hold yellow color
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar 
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    },)

    // control Navbar
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY)
                setShowNavbar('hide')

            else setShowNavbar('show')
        }

        else setShowNavbar('top')

        setLastScrollY(window.scrollY);
    }

    return (
        <nav className={`z-[10] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-all ${showNavbar} `}>

            <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
                {/* logo */}
                <Link to="/">
                    <img src={InterroSpot} width={160} height={42} loading='lazy' />
                </Link>

                {/* Nav Links - visible for only large devices*/}
                <ul className='hidden sm:flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                    link?.title === "Services" ? (
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/Services/:ServicesName")
                                                ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                                                : "text-richblack-25 rounded-xl p-1 px-3"
                                                }`}
                                        >
                                            <p>{link?.title}</p>
                                            <MdKeyboardArrowDown />
                                            {/* drop down menu */}
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                                            >
                                                <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (<p className="text-center ">Loading...</p>)
                                                    : subLinks?.length ? (
                                                        <>
                                                            {subLinks?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/Services/${subLink?.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink?.name}</p>
                                                                </Link>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? "bg-yellow-25 text-black" : "text-richblack-25"} rounded-xl p-1 px-3 `}>
                                                {link.title}
                                            </p>
                                        </Link>)
                                }
                            </li>
                        ))}
                </ul>

                {/* Login and Signup Button */}

                <div className='flex gap-x-4 items-center'>

                    {
                        token === null && (
                            <Link to="/login">
                                <button className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                 ${matchRoute('/login') ? 'border-[2.5px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800'} `}
                                >
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">

                                <button className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                 ${matchRoute('/signup') ? 'border-[2.5px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800'} `}
                                >
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }

                    {/* For Large device */}
                    {token !== null && <ProfileDropdown />}

                    {/* For small devices */}
                    {token !== null && <MobileProfileDropDown />}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
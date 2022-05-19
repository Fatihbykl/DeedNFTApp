import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return(
        <nav class="navbar">
            <div class="container">

                <div class="navbar-header">
                <button class="navbar-toggler" data-toggle="open-navbar1">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a href="#">
                    <h4>Awesome<span>logo</span></h4>
                </a>
                </div>

                <div class="navbar-menu" id="open-navbar1">
                <ul class="navbar-nav">
                    <li>
                        <NavLink to="/" activeClassName="active">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="create" activeClassName="active">Create</NavLink>
                    </li>
                    <li>
                        <NavLink to="search" activeClassName="active">Search</NavLink>
                    </li>
                    <li>
                        <NavLink to="mydeeds" activeClassName="active">My Deeds</NavLink>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
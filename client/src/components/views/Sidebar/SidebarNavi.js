import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import { SidebarData } from './SidebarData';
import './sidebar.css';

const StyledSideNav = styled.div`   
    position: absolute;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
    height: 100%;
    width: 270px;     /* Set the width of the sidebar */
    z-index: 1;      /* Stay on top of everything */
    top: 3.4em;      /* Stay at the top */
    background-color: #white; /* Black */
    overflow-x: hidden;     /* Disable horizontal scroll */
    padding-top: 10px;
`;


function SidebarNavi() {

    return (
        
            <StyledSideNav>
                <div className="Sidebar">

<ul className="SidebarList"></ul>
                {SidebarData.map((val, key) => {
                    return (
                        <li
                            key={key}
                            className="row"
                            onClick={() => (window.location.pathname = val.path)}
                        >
                            <div id="icon">{val.icon} </div><div id="title">{val.title}</div>
                        </li>


                    );


                })}
                {/*<div>

                    <a className="weatherwidget-io" href="https://forecast7.com/en/52d5213d40/berlin/" data-label_1="BERLIN" data-label_2="WEATHER" data-days="7" data-theme="original" data-theme="original" >BERLIN WEATHER</a>

                    {!function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        // if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;
                        js.src = 'https:weatherwidget.io/js/widget.min.js';
                        fjs.parentNode.insertBefore(js, fjs);
                        // }
                    }
                        (document, 'script', 'weatherwidget-io-js')
                    }

                </div>*/}
                </div>

            </StyledSideNav>

    );
}


export default SidebarNavi;
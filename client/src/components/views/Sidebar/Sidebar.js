import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './sidebar.css';
import { IconContext } from 'react-icons';
import styled from 'styled-components';

function Sidebar() {
  
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

  return (
    <StyledSideNav>
  
    <div className="Sidebar">
        
        <ul className="SidebarList">
            
        {SidebarData.map((val, key) => { 
        return (
            <li
              key={key}
              className="row"
              onClick={() => (window.location.pathname = val.path)}
            >
              <div id= "icon">{val.icon} </div><div id="title">{val.title}</div>
            </li>

            
          );


        })}
      
      </ul>
    
    </div>
    </StyledSideNav>

    
  );
  
  
};


export default Sidebar;
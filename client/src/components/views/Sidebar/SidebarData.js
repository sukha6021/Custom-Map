import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { Icon } from 'leaflet';

export const SidebarData = [
  {
    title: 'My Maps',
    path: '/mymaps',
    icon: <IoIcons.IoMdMap />,
    cName: 'nav-text'
  },
  
  {
    title: 'Current Location',
    path: '/currentlocation',
    icon: <FaIcons.FaMapPin />,
    
    cName: 'nav-button'
  },
  

  {
    title: 'About',
    path: '/about',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  },

  
];
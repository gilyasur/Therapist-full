import React from 'react';
import { Outlet } from "react-router-dom";
import { Header } from '../Header/Header';




export function Dashboard() {

    return (
        <div>
            
 <Header></Header>
 <Outlet></Outlet>
        </div>
    );
}
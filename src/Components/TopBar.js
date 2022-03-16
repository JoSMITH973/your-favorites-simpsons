import { useState, useEffect, useContext } from "react";
import {Navbar, Nav} from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import {getPath} from './Regex';
import { Button } from 'react-bootstrap';
import './TopBar.scss';
import { ThemeContext } from "../ThemeContext/ThemeContext";
import Switch from "react-switch";

function TopBar() {
    const { toggle, toggleFunction } = useContext(ThemeContext);
    const [expanded, setExpanded] = useState(false);
    const [path, setPath] = useState(null);
    useEffect(() => {
        let pathToExtract = getPath.exec(window.location.pathname);
        setPath(pathToExtract[0]);
    }, []);

    return (
        <Navbar bg="primary" variant="dark" expanded={expanded} expand="lg" className="navbar" style={{fontSize:"120%", position:"relative",top:0,width:"100%", zIndex:1000}}>
            <Navbar.Brand className="marginForNavbar" href="/"><img height="30"  className="d-inline-block align-top" src={process.env.PUBLIC_URL+"logo_simpson.png"} /></Navbar.Brand>
            <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav activeKey={path} className="mr-auto">
                    <NavLink onClick={() => setExpanded(false)} className="nav-link" to="/">Découverte</NavLink>
                    <NavLink key="fav" onClick={() => setExpanded(false)} className="nav-link" to="/favoris">Favoris</NavLink>
                    {/* <Button onClick={toggleFunction}>Changer</Button> */}
                    <div id="alignSwitch" className="nav-link">
                        Mode {toggle ? "Sombre" : "Clair" }
                        <Switch onChange={toggleFunction} checked={toggle} offColor="#ffffff" offHandleColor="#4B4F4F" onColor="#4B4F4F"  onHandleColor="#ffffff" checkedIcon="" uncheckedIcon=""/>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default TopBar;

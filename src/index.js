import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from './Components/TopBar';
import Favoris from './Components/Favoris';
import Decouverte from './Components/Decouverte';
import {ThemeProvider} from './ThemeContext/ThemeContext';

ReactDOM.render(
    <ThemeProvider>
        <Router>
            <TopBar />
            <Routes>
                <Route exact path="/" element={<Decouverte />} />
                <Route exact path="/favoris" element={<Favoris />}/>
            </Routes>
        </Router>
    </ThemeProvider>,
  document.getElementById('root')
);
import { TailSpin } from  'react-loader-spinner';
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { useContext } from "react";
import './Loading.css';

function Loading() {
    // Pour Switcher du mode normal à sombre
    const { toggle } = useContext(ThemeContext);

    return (
        <div className={toggle ? "mainDivDark" :"mainDiv" }>
            <h3>
                Chargement
                <div className='alignLoader'>
                    <TailSpin
                        height="100"
                        width="100"
                        color='#16a085'
                        ariaLabel='loading'
                    />
                </div>
            </h3>
        </div>
    )
}

export default Loading;
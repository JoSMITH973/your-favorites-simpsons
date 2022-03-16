import { useState, useEffect, useContext } from "react";
import { Star, StarFill } from 'react-bootstrap-icons';
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import Loading from './Loading';
import './Favoris.css';
import { ThemeContext } from "../ThemeContext/ThemeContext";

function Favoris() {
    const [personnages, setPersonnages] = useState([]);
    const [personnageToRemove, setPersonnageToRemove] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstGetItem, setFirstGetItem] = useState(true);
    const [launchResearch, setLaunchResearch] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteClick, setFavoriteClick] = useState(false);
    const [favoritesInLocal, setFavoritesInLocal] = useState([]);
    const [syncLocal, setSyncLocal] = useState(false);
    const [indexChargement, setindexChargement] = useState(0)
    let i = 0;

    // Pour Switcher du mode normal à sombre
    const { toggle } = useContext(ThemeContext);

    useEffect(async () => {
        // On actualise le localStorage avec le nouveau tableau contenu dans le state favoritesInLocal
        if(syncLocal) {
            await AsyncLocalStorage.setItem("character", JSON.stringify(favoritesInLocal))
            setSyncLocal(false)
        }
        // On récupère les données du localStorage seulement lorsqu'on lance la page pour la première fois
        // De ce fait on évite les éventuels bugs empêchant le localStorage de s'actualiser
        if(firstGetItem) {
            const localItems = await AsyncLocalStorage.getItem('character');
            console.log('localItems :',localItems);
            if(localItems != undefined) {
                const itemsParsed = await JSON.parse(localItems)
                await setFavoritesInLocal(itemsParsed);
            }
            setFirstGetItem(false)
        }
        
        // On Lance une recherche
        if (launchResearch) {
            setLoading(true)
            let persosList = [];

            for(i=i; i<favoritesInLocal.length; i++) {

                console.log('character :', favoritesInLocal[i])
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?character=${favoritesInLocal[i]}`);
                const result = await response.json();
                // On insère les données reçus dans le state personnage
                // setindexChargement(i);
                setindexChargement(i+1);
                persosList.unshift(result[0])
                // setPersonnages([...personnages, result[0]])
                // On vérifie que le personnage reçu est dans le tableau
                // Si oui le state isFavorite passe à true et une étoile remplie s'affiche sinon l'inverse
                setIsFavorite(favoritesInLocal.find(el => el == result[0].character))
                if(i == favoritesInLocal.length-1) {
                    // On désactive l'écran de chargement
                    setLoading(false);
                }
            setPersonnages(persosList);
            }
            setLaunchResearch(false)
        }

        // On ajoute un personnage au favoris
        if(favoriteClick) {
            // On actualise 
            // Si le personnage est en favoris, alors on le retire du tableau
            console.log('here');
            await setFavoritesInLocal(favoritesInLocal.filter(el => el !== personnageToRemove));
            await setPersonnages(personnages.filter(el => el.character !== personnageToRemove));
            // On change l'état du state afin d'afficher l'icone adéquat à la demande
            // setIsFavorite(!isFavorite);
            setFavoriteClick(false);
            // On relance le useEffect avec le tableau qui sera mis à jour et donc par le même biais synchronisera le local
            setSyncLocal(true);
        }
    }, [firstGetItem, indexChargement, launchResearch, favoriteClick]);

    const getPersos = async () => {
    }

    const setFavorites = async (character) => {
        console.log('name :', character);
        setPersonnageToRemove(character)
        setFavoriteClick(true)
    }

    document.body.style.backgroundColor = toggle ? "#4B4F4F" : "white";

    return (
        <div className={toggle ? "mainDivDark" :"mainDiv" }>
            {loading && (
                <div>
                    <Loading />
                    <div>
                        {indexChargement} / {favoritesInLocal.length}
                    </div>
                </div>
            )}
            {!loading && (
                <div>
                    <h2 style={{margin: "3% 0"}}>
                        Vous avez {favoritesInLocal.length} favoris
                    </h2>
                    {personnages.map((perso) => (
                        <div key={perso.character}>
                            <h3>
                                {perso.character} 
                                {isFavorite && (
                                    <StarFill color={toggle ? "yellow" : ""} onClick={() => setFavorites(perso.character)} />
                                    )}
                                {!isFavorite && (
                                    <Star onClick={() => setFavorites(perso.character)} />
                                    )}
                            </h3>
                            <p>
                                once said : "{perso.quote}"
                            </p>
                            <img src={perso.image} />
                            <div className="refreshButton">
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favoris;
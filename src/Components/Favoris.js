import { useState, useEffect, useContext } from "react";
import { Star, StarFill } from 'react-bootstrap-icons';
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import Loading from './Loading';
import './Favoris.css';
import { ThemeContext } from "../ThemeContext/ThemeContext";

function Favoris() {
    // State contenant les personnages à affciher
    const [personnages, setPersonnages] = useState([]);
    // State contenant le personnage à supprimer
    const [personnageToRemove, setPersonnageToRemove] = useState(null);
    // State pour afficher la page de chargement ou non
    const [loading, setLoading] = useState(true);
    // State pour iniliatiser les données du localStorage
    const [initialise, setInitialise] = useState(true);
    // State pour lancer un appel vers l'api
    const [launchResearch, setLaunchResearch] = useState(false);
    // State pour mettre afficher une étoile remplie ou non
    const [isFavorite, setIsFavorite] = useState(false);
    // State pour ajouter ou supprimer un personnage des favoris
    const [launchFavorite, setLaunchFavorite] = useState(false);
    // State contenant le tableau des favoris
    const [favoritesInLocal, setFavoritesInLocal] = useState([]);
    // State pour mettre à jour le localStorage
    const [syncLocal, setSyncLocal] = useState(false);
    // State permettant combien de personnages ont déjà été chargées
    const [indexChargement, setindexChargement] = useState(0);
    // State No Favoris
    const [noFavoris, setNoFavoris] = useState(false);

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
        if(initialise) {
            const localItems = await AsyncLocalStorage.getItem('character');
            if(localItems != undefined) {
                const itemsParsed = await JSON.parse(localItems)
                await setFavoritesInLocal(itemsParsed);
                setLaunchResearch(true);
            }
            else {
                setLoading(false);
                setNoFavoris(true);
            }
            // Une fois terminé, on passe initialise à false afin de ne pas relancer la fonction d'initialisation lors 
            // d'une future réutilisation du useEffect 
            setInitialise(false)
            // On lance alors la fonction de recherche random d'un personnage
        }
        
        // On Lance une recherche
        if (launchResearch) {
            setLoading(true)
            let persosList = [];

            for(let i=0; i<favoritesInLocal.length; i++) {

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
            }
            setPersonnages(persosList);
            setLaunchResearch(false)
        }

        // On ajoute un personnage au favoris
        if(launchFavorite) {
            // On actualise 
            // Si le personnage est en favoris, alors on le retire du tableau
            await setFavoritesInLocal(favoritesInLocal.filter(el => el !== personnageToRemove));
            await setPersonnages(personnages.filter(el => el.character !== personnageToRemove));
            // On change l'état du state afin d'afficher l'icone adéquat à la demande
            // setIsFavorite(!isFavorite);
            setLaunchFavorite(false);
            // On relance le useEffect avec le tableau qui sera mis à jour et donc par le même biais synchronisera le local
            setSyncLocal(true);
        }
    }, [initialise, syncLocal, indexChargement, launchResearch, launchFavorite]);

    const getPersos = async () => {
    }

    const setFavorites = async (character) => {
        setPersonnageToRemove(character)
        setLaunchFavorite(true)
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
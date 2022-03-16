import { useState, useEffect, useContext } from "react";
import { Star, StarFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import Loading from './Loading';
import './Decouverte.css';
import { ThemeContext } from "../ThemeContext/ThemeContext";

function Decouverte() {
    // State contenant le personnage affcihé actuellement
    const [personnage, setPersonnage] = useState([]);
    // State pour afficher la page de chargement ou non
    const [loading, setLoading] = useState(true);
    // State pour iniliatiser les données du localStorage
    const [initialise, setInitialise] = useState(true);
    // State pour lancer un appel vers l'api
    const [launchResearch, setLaunchResearch] = useState(false);
    // State pour mettre afficher une étoile remplie ou non
    const [isFavorite, setIsFavorite] = useState(false);
    // State pour mettre un personnage en favori
    const [launchFavorite, setLaunchFavorite] = useState(false);
    // State contenant le tableau des favoris
    const [favoritesInLocal, setFavoritesInLocal] = useState([]);
    // State pour mettre à jour le localStorage
    const [syncLocal, setSyncLocal] = useState(false);

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
            // On récupère les favoris dans le localStorage de manière asynchrone
            const localItems = await AsyncLocalStorage.getItem('character');
            // Si les données récupérées du localStorage ne sont pas vide, alors on les ajoutes dans le state favoritesInLocal
            if(localItems != undefined) {
                const itemsParsed = await JSON.parse(localItems);
                await setFavoritesInLocal(itemsParsed);
            }
            // Une fois terminé, on passe initialise à false afin de ne pas relancer la fonction d'initialisation lors 
            // d'une future réutilisation du useEffect 
            setInitialise(false);
            // On lance alors la fonction de recherche random d'un personnage
            setLaunchResearch(true);
        }

        // On Lance une recherche
        if (launchResearch) {
            setLoading(true)
            fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
            .then( res => res.json() )
            .then( data => {
                // On insère les données reçus dans le state personnage
                setPersonnage(data[0])
                // On vérifie que le personnage reçu est dans le tableau
                // Si oui le state isFavorite passe à true et une étoile remplie s'affiche sinon l'inverse
                let checkInArray = favoritesInLocal.find(el => el == data[0].character) != undefined ? true : false;
                setIsFavorite(checkInArray)
                
                // Une fois les données affectées et traiter, on peut désactiver l'écran de chargement
                setLoading(false)
            })
            setLaunchResearch(false)
        }

        // On ajoute un personnage au favoris
        if(launchFavorite) {
            // On actualise 
            // On insère ou on retire un personnage du tableau des favoris
            if(isFavorite) {
                // Si le personnage est en favoris, alors on le retire du tableau
                setFavoritesInLocal(favoritesInLocal.filter(el => el !== personnage.character));
            }
            else {
                // Si le personnage n'est pas en favoris, alors on le rajoute au tableau
                setFavoritesInLocal([...favoritesInLocal, personnage.character]);
            }
            // On change l'état du state afin d'afficher l'icone adéquat à la demande
            setIsFavorite(!isFavorite);
            setLaunchFavorite(false);
            // On relance le useEffect avec le tableau qui sera mis à jour et donc par le même biais synchronisera le local
            setSyncLocal(true);
        }
    }, [launchResearch, launchFavorite]);
    
    const getPerso = async () => {
        setLaunchResearch(true)
    }

    const setFavorites = async (name) => {
        setLaunchFavorite(true)
    }

    document.body.style.backgroundColor = toggle ? "#4B4F4F" : "white";

    return (
        <div className={toggle ? "mainDivDark" :"mainDiv" }>
            {loading && (<Loading />)}
            {!loading && (
                <div> 
                    <h3>
                        {personnage.character} 
                        {isFavorite && (
                            <StarFill color={toggle ? "yellow" : ""} onClick={() => setFavorites(personnage.character)} />
                        )}
                        {!isFavorite && (
                            <Star onClick={() => setFavorites(personnage.character)} />
                        )}
                    </h3>
                    <p>
                        once said : "{personnage.quote}"
                    </p>
                    <img src={personnage.image} />
                    <div className="refreshButton">
                        <Button variant="primary" onClick={() => {
                            getPerso()
                        }}>
                            Suivant
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Decouverte;
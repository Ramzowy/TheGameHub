import './navigation.css';
import { Link, useNavigate } from 'react-router-dom';

function Navigation({onLinkClick, userName}) {
  const navigate = useNavigate();  
  const navigationClickHandler = (path) =>{
    if(onLinkClick) onLinkClick(path);
    navigate(path, { state: { userName } });
    }
  

  
  return (
      <nav className="navigation-bar">
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage")}>Hub</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/rock-paper-scissors")}>Rock Paper Scissors</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/tic-tac-toe")}>Tic Tac Toe</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/wordle")}>Wordle</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/memorygame")}>Memory Game</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/slingo-game")}>Slingo</button>
        <button className="link-button" onClick={() => navigationClickHandler("/HomePage/signin")}>Change Username</button>
      </nav>
    );
  }

export default Navigation;

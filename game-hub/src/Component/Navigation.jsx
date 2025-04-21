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
        <button className="link" onClick={() => navigationClickHandler("/HomePage")}>Hub</button>
        <button className="link" onClick={() => navigationClickHandler("/HomePage/rock-paper-scissors")}>Rock Paper Scissors</button>
        <button className="link" onClick={() => navigationClickHandler("/HomePage/tic-tac-toe")}>Tic Tac Toe</button>
        <button className="link" onClick={() => navigationClickHandler("/HomePage/wordle")}>Wordle</button>
        <button className="link" onClick={() => navigationClickHandler("/HomePage/slingo-game")}>Slingo</button>
        <button className="link" onClick={() => navigationClickHandler("/HomePage/signin")}>Change Username</button>
      </nav>
    );
  }

export default Navigation;




// import { Link } from 'react-router-dom';

// function Navigation() {
//   return (
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/rock-paper-scissors">Rock Paper Scissors</Link></li>
//         <li><Link to="/tic-tac-toe">Tic Tac Toe</Link></li>
//         <li><Link to="/slingo-game">Slingo</Link></li>
//       </ul>
//     </nav>
//   )
// }

// export default Navigation;

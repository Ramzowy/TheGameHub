import { useLocation } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import RockPaperScissorsGame from './rock-paper-scissors';
import TTT from './tic-tac-toe';
import Slingo from './slingo-game';
import Navigation from '../Component/Navigation';

function Hub() {
  const location = useLocation();
  const userName = location.state?.userName;
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const toggleWelcomeMessage = (tf) => {
    setShowWelcomeMessage(tf);
};

  return (
    <div>
      {showWelcomeMessage && <h1>Welcome, {userName}!</h1>}
      <Navigation 
      onLinkClick={(path) => {
        console.log("Navigation link clicked, path: ", path); // <- remove me
        if(path === '/hub'){
toggleWelcomeMessage(true);
      }
      else{
toggleWelcomeMessage(false);
}

}

} 
      userName={userName}
      />
      <Routes>
        <Route path="/rock-paper-scissors" element={<RockPaperScissorsGame />} />
        <Route path="/tic-tac-toe" element={<TTT />} />
        <Route path="/slingo-game" element={<Slingo />} />
      </Routes>
    </div>
  );
}


export default Hub;




// import { Link } from 'react-router-dom';

// function HomePage() {
//   return (
//     <div>
//       <h1>GameHub</h1>
//       <p>Welcome to GameHub - Your gaming portal!</p>
      
//       <nav>
//         <h2>Available Games:</h2>
//         <ul>
//           <li>
//             <Link to="/rock-paper-scissors">Rock Paper Scissors</Link>
//           </li>
//           <li>
//             <Link to="/tic-tac-toe">Tic Tac Toe</Link>
//           </li>
//           <li>
//             <Link to="/slingo-game">Slingo</Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default HomePage;


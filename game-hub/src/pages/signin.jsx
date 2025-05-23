import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

function SignInAction() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const inputChange = (event) => {
    setName(event.target.value);
  };

  const nameInputGuard = () => {
    if (name.trim()) {
      navigate('/HomePage', { state: { userName: name } }); 
    } else {
      alert('Enter a name.');
    }
  };

  return (
    <div className="sign-in">
      <h2>Enter Your Name</h2>
      <input className='signin-input'
        type="text"
        name="userCapture"
        value={name}
        onChange={inputChange}
      />
      <button className="signin-button"onClick={nameInputGuard}>Sign In</button>
    </div>
  );
}

export default SignInAction;
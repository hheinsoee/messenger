import React, { useState, useEffect } from 'react';
import Msgr from './messenger';

function SignIn() {
    const [name, setName] = useState('');
    const [login ,setLogin] =useState(false);

    const makelogin = (event) => {
        setLogin(true);
        event.preventDefault();
    }
    const handleChange = (event) => {
        setName(event.target.value)
    }
    return (
        <div>
            {
                login
                ?
                <Msgr name={name}/>
                :
                <form onSubmit={makelogin}>
                    <input type="text" value={name} onChange={handleChange} placeholder="Your Name"/>
                    <button>Save</button>
                </form>
            }
        </div>
    );
}

export default SignIn;
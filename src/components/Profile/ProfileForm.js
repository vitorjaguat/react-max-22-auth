import { useRef, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API_key from '../../env';
import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    //add validation

    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_key}`,
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Failed to change password!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        console.log('Successfully changed password!');
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          ref={newPasswordInputRef}
          min="7"
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
        {isLoading && <p>Sending request...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;

import React, { useState, VFC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './App.css';
import { Redirect } from 'react-router-dom';


type CancelType = {
  location: {
    state: {
      subscription: string
    }
  }
}


const Cancel: VFC<CancelType & RouteComponentProps> = ({location}) => {
  const [cancelled, setCancelled] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> | undefined = async (e) => {
    e.preventDefault();

    await fetch('/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId: location.state.subscription
      }),
    })
    // console.log(location);
    // console.log(location.state);
    
    setCancelled(true);
  };

  if(cancelled) {
    return <Redirect to={`/account`} />
  }

  return (
    <div>
      <h1>Cancel</h1>
      <button onClick={handleClick}>Cancel</button>
    </div>
  )
}


export default withRouter(Cancel);

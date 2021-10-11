import React, { useState, useEffect, VFC } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import './App.css';

type subscriptionType = {
  subscription: {
    id: string
    status: string
    plan: {
      amount: number
    }
    current_period_end: number
  }
}

type subscriptionsType = {
  id: string
  status: string
  plan: {
    amount: number
  }
  current_period_end: number
}

const AccountSubscription: VFC<subscriptionType> = ({ subscription }) => {
  return (
    <section>
      <hr />
      <h4>
        <a href={`https://dashboard.stripe.com/test/subscriptions/${subscription.id}`}>
          {`subscription.id${"(支払いページ)"}`}
        </a>
      </h4>
      {/* {console.log(subscription)} */}
      <p>
        Status(): {subscription.status}
      </p>

      <p>
        Subscribe Plan: {`$ ${subscription.plan.amount / 100}`}
      </p>

      <p>
        Current period end: {(new Date(subscription.current_period_end * 1000).toString())}
      </p>

      {/* <Link to={{pathname: '/change-plan', state: {subscription: subscription.id }}}>Change plan</Link><br /> */}
      <Link to={{ pathname: '/cancel', state: { subscription: subscription.id } }}>Cancel</Link>
    </section>
  )
}

const Account: VFC<RouteComponentProps> = () => {
  const [subscriptions, setSubscriptions] = useState<subscriptionsType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { subscriptions } = await fetch('/subscriptions').then(r => r.json());

      setSubscriptions(subscriptions.data);
      // console.log(subscriptions.data);
    }
    fetchData();
  }, []);
  
  if (!subscriptions) {
    return null;
  }

  return (
    <div>
      <h1>Account</h1>

      <a href="/prices">Add a subscription(サブスクリプションを追加)</a>
      <br />
      <a href="/">Restart demo(メールアドレス登録へ戻る)</a>

      <h2>Subscriptions</h2>

      <div id="subscriptions">
        {subscriptions.map((s) => {
          // console.log(s);
          return <AccountSubscription key={s.id} subscription={s} />
        })}
      </div>
    </div>
  );
}

export default withRouter(Account);

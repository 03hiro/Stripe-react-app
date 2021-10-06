import React, { useState, useEffect, VFC } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import './App.css';


type SubscribeType = {
  
}

const AccountSubscription = ({subscription}: any) => {
  return (
    <section>
      <hr />
      <h4>
        <a href={`https://dashboard.stripe.com/test/subscriptions/${subscription.id}`}>
          {`subscription.id${"(支払いページ)"}`}
        </a>
      </h4>
      {console.log(subscription)}
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
      <Link to={{pathname: '/cancel', state: {subscription: subscription.id }}}>Cancel</Link>
    </section>
  )
}

const Account: any & RouteComponentProps = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const {subscriptions} = await fetch('/subscriptions').then(r => r.json());

      setSubscriptions(subscriptions.data);
    }
    fetchData();
  }, []);

  if (!subscriptions) {
    return '';
  }

  return (
    <div>
      <h1>Account</h1>

      <a href="/prices">Add a subscription(サブスクリプションを追加)</a>
      <br />
      <a href="/">Restart demo(メールアドレス登録へ戻る)</a>

      <h2>Subscriptions</h2>

      <div id="subscriptions">
        {subscriptions.map((s: any) => {
          //型を変えたい
          return <AccountSubscription key={s.id} subscription={s} />
        })}
      </div>
    </div>
  );
}

export default withRouter(Account);

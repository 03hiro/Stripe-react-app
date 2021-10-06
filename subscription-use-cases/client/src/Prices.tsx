import React, { useState, useEffect, VFC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

type Props = {
  prices?: Number[],
  subscriptionData?: String,
  subscriptionId: String | Number | null,
  clientSecret: String | Number | null,
}

type PriceValue = {
  id: String | Number | null,
  unit_amount: String | Number | null,
  product: String | Number | null,
} 


const Prices: VFC<Props & RouteComponentProps> = () => {
// const Prices: any= () => {
  const [prices, setPrices] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState<Props | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const {prices} = await fetch('/config').then(r => r.json());
      setPrices(prices);
    };
    fetchPrices();
    
  }, [])

  const createSubscription = async (priceId: Number) => {
    const {subscriptionId, clientSecret} = await fetch('/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId
      }),
    }).then(r => r.json());

    setSubscriptionData({ subscriptionId, clientSecret });
  }

  if(subscriptionData) {
    return <Redirect to={{
      pathname: '/subscribe',
      state: subscriptionData
    }} />
  }
  console.log(setSubscriptionData);
  

  return (
    <div>
      <h1>Select a plan</h1>

      <div className="price-list">
        {prices.map((price: any) => {
          //型を変えたい
          // console.log(price);
          return (
            <div key={price.id}>
              <h3>{price.product.name}</h3>

              <p>
                ${price.unit_amount / 100} / month
              </p>

              <button onClick={() => createSubscription(price.id)} >
                Select
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default withRouter(Prices);

import React, { useState, useEffect, VFC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

type Props = {
  prices?: number[],
  subscriptionData?: string,
  subscriptionId: string | number | null,
  clientSecret: string | number | null,
}

type PriceValue = {
  id: string | number,
  unit_amount: number,
  product: {
    name: string
  }
} 


const Prices: VFC<Props & RouteComponentProps> = () => {
// const Prices: any= () => {
  const [prices, setPrices] = useState<PriceValue[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<Props | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const {prices} = await fetch('/config').then(r => r.json());
      setPrices(prices);
    };
    fetchPrices();
    
  }, [])

  const createSubscription = async (priceId: string | number) => {
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
      pathname: '/subscribe/',
      state: subscriptionData
    }} />
  }
  // console.log(subscriptionData);
  

  return (
    <div>
      <h1>Select a plan</h1>

      <div className="price-list">
        {prices.map((price) => {
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

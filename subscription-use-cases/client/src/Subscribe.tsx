import React, { useState, useEffect, VFC, memo } from 'react';
import { loadStripe, StripeCardElement, StripeCardNumberElement, StripeElements } from '@stripe/stripe-js';
import { withRouter, RouteComponentProps, useLocation, } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Redirect } from 'react-router-dom';


type LocationState = {
  from: {
    pathname: string;
  },
  clientSecret: string
}

type subscriptionsType = {
  id: string
  status: string
  plan: {
    amount: number
  }
  current_period_end: number
}

type subscriptionType = {
  subscription: {
    id: string | undefined
    status: string | undefined
    plan: {
      amount: number | undefined
    }
  }
}

// type PriceValue = {
//   id: string | number,
//   unit_amount: number,
//   product: {
//     name: string
//   }
// }


const SubscribeSubscription: VFC<subscriptionType> = ({ subscription }) => {
  // const SubscribeSubscription: any = ({ subscription }: any) => {
    

  if (subscription.plan.amount === 500) {
    return (
      <div>
        <h3>Total due : <span>{`$ ${subscription.plan.amount / 100}`}</span>.00</h3>
        <h3>Subscribing to : <span>Basic product</span>.</h3>
        {console.log(subscription)}
      </div>
    )
  } else if (subscription.plan.amount === 1500) {
    return (
      <div>
        <h3>Total due : <span>{`$ ${subscription.plan.amount / 100}`}</span>.00</h3>
        <h3>Subscribing to : <span>Premium product</span>.</h3>
        {console.log(subscription)}
      </div>
    )
  } else{
    return null;
  }
};

const Subscribe: VFC<RouteComponentProps> = memo(() => {
  const [subscriptions, setSubscriptions] = useState<subscriptionsType[]>([]);
  // const [prices, setPrices] = useState<PriceValue[]>([]);


  useEffect(() => {
    //金額表示取得用
    const fetchData = async () => {
      const { subscriptions } = await fetch('/subscriptions').then(r => r.json());
      setSubscriptions(subscriptions.data);
      console.log(subscriptions.data)
      
    }
    fetchData();

    // product表示用
    // const fetchPrices = async () => {
    //   const { prices } = await fetch('/config').then(r => r.json());
    //   setPrices(prices);
    //   // console.log(prices);
    // };
    // fetchPrices();

  }, []);
  if (!subscriptions) {
    return null;
  }

  const location = useLocation<LocationState>();

  // Get the lookup key for the price from the previous page redirect.
  const [clientSecret] = useState(location.state.clientSecret);
  // const [subscriptionId] = useState(location.state.subscriptionId);
  const [name, setName] = useState<string>('');
  const [messages, _setMessages] = useState<string>('');
  const [paymentIntent, setPaymentIntent] = useState<undefined | any>();

  // helper for displaying status messages.
  const setMessage = (message: string | undefined) => {
    _setMessages(`${messages}\n\n${message}`);
  }

  // console.log(location);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  const elements = useElements();
  if (!stripe || !elements) {
    // Stripe.js has not loaded yet. Make sure to disable     
    // form submission until Stripe.js has loaded.
    return null;
  }

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      alert("カード情報の取得に失敗しました");
      return
    }

    // Use card Element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        }
      }
    });


    if (error) {
      // show error and collect new card details.
      setMessage(error.message);
      return;
    }
    setPaymentIntent(paymentIntent);
  }

  if (paymentIntent && paymentIntent.status === 'succeeded') {
    return <Redirect to={{ pathname: '/account' }} />
  }

  return (
    <>
      <h1>Subscribe (Card Info)</h1>

      <div id="subscriptions">
        {subscriptions.map((s) => {
         
          return <SubscribeSubscription key={s.id} subscription={s} />
        })}
      </div>



      {/* <div>
        {prices.map((price) => {
          subscriptions.map((s) => {
            
            if(s.plan.amount === 500) {
              return (
                <>
                  <div key={s.id}>
                    <p>.{console.log(s.plan.amount)}</p>
                  </div>
  
                  <div key={price.id}>
                    
                    <h3>Subscribing to: {console.log(price.product.name)}</h3>
                  </div>
                </>
              )
            }

          })
        })}
      </div> */}

      <p>
        Try the test card(テスト用を番号)）: <span>4242424242424242</span>.
      </p>

      <p>
        Try the test card that requires SCA(テスト用番号): <span>4000002500003155</span>.
      </p>

      <p>
        Use any <i>future</i> expiry date, CVC,5 digit postal code
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" id="name" placeholder="Card Name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <CardElement />

        <button>
          Subscribe
        </button>

        <div>{messages}</div>
      </form>
    </>
  )
});

export default withRouter(Subscribe);

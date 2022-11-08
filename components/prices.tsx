import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Form from 'react-bootstrap/Form';
import styles from '../styles/Home.module.css'
import { Currency } from '../models/currency';

export default function Prices() {

  const [socketUrl, setSocketUrl] = useState('wss://wssx.gntapi.com:443');
  const [messageHistory, setMessageHistory] = useState<Currency[]>([]);
  const [cryptoOptions, setCryptoOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendMessage('prices');
    },
    shouldReconnect: (closeEvent) => true,
  });

  const handleprice = (price: any) => {    
    setCryptoOptions(Object.keys(JSON.parse(price.data)?.prices));    
    setMessageHistory((prev) => {
      if(prev.length > 1){
        prev.shift();
      }
      const newAsk = JSON.parse(price.data ?? {}).prices[selected]?.ask;
      const newBid = JSON.parse(price.data ?? {}).prices[selected]?.bid;
      
      let newPrice: Currency = {
        ask: {
          value: newAsk,
          increase: (prev.length > 0) ? (newAsk === prev[0]?.ask.value ? prev[0]?.ask.increase : (newAsk > prev[0]?.ask.value ? 1 : -1)) : 0
        },
        bid: {
          value: newBid,
          increase: (prev.length > 0) ? (newBid === prev[0]?.bid.value ? prev[0]?.bid.increase : (newBid > prev[0]?.bid.value ? 1 : -1)) : 0
        }
      }

      return prev.concat(newPrice);
    });
  }
  
  useEffect(() => {
    if (lastMessage !== null) {
      handleprice(lastMessage)
    }
  }, [lastMessage, setMessageHistory]);

  return (
    <div>
      <div className='text-center mt-4'>
        <h1>Visualizador de precios GNT</h1>
      </div>
      <div className='row justify-content-center mt-5 mb-5'>
        <div className='col-12 col-md-4'>
          <Form.Select  aria-label="Default select example" className={styles.input_dropdown} onChange={(e) => {
            setSelected(e.target.value);
            setMessageHistory([]);
            }}>
            <option value={undefined}>Seleccione una divisa</option>
            {cryptoOptions.map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-6 text-center'>
          <h2>Ask:</h2>
          <h3>
            <span className={
              messageHistory[messageHistory.length-1]?.ask.increase === 0 ? '' : messageHistory[messageHistory.length-1]?.ask.increase === 1 ? styles.increase : styles.decrease
            }>
              {messageHistory[messageHistory.length-1]?.ask.value}
            </span>
          </h3>
        </div>
        <div className='col-6 text-center'>
          <h2>Bid:</h2>
          <h3>
            <span className={
              messageHistory[messageHistory.length-1]?.bid.increase === 0 ? '' : messageHistory[messageHistory.length-1]?.bid.increase === 1 ? styles.increase : styles.decrease
            }>
              {messageHistory[messageHistory.length-1]?.bid.value}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
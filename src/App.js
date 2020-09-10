import React, { useEffect, useState } from 'react';
import './App.css';
import CC from './CC'

const url = 'https://api.exchangeratesapi.io/latest'

function App() {
  const [cur, setCur] = useState([])
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [exR, setExR] = useState()
  const [amount, setAmount] = useState(1)
  const [IsFrom, setIsFrom] = useState(true)

  let toAmount, fromAmount
  if (IsFrom) {
    fromAmount = amount
    toAmount = amount * exR
  } else {
    toAmount = amount
    fromAmount = amount / exR
  }

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCur([data.base, ...Object.keys(data.rates)])
        setFrom(data.base)
        setTo(firstCurrency)
        setExR(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (from != null && to != null) {
      fetch(`${url}?base=${from}&symbols=${to}`)
        .then(res => res.json())
        .then(data => setExR(data.rates[to]))
    }
  }, [from, to])

  function handleFromAC(e) {
    setAmount(e.target.value)
    setIsFrom(true)
  }

  function handleToAC(e) {
    setAmount(e.target.value)
    setIsFrom(false)
  }

  return (
    <>
      <h1>Final Convertor</h1>
      <CC className="tofrom"
        currencyOptions={cur}
        selectedCurrency={from}
        onChangeCurrency={e => setFrom(e.target.value)}
        onChangeAmount={handleFromAC}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CC className="tofrom"
        currencyOptions={cur}
        selectedCurrency={to}
        onChangeCurrency={e => setTo(e.target.value)}
        onChangeAmount={handleToAC}
        amount={toAmount}
      />
    </>
  );
}

export default App;

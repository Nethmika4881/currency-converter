import { useEffect, useState } from "react";

export default function App() {
  return (
    <div className="App">
      <Topic />
      <div className="main">
        <GetInput topic="From" currency="" key="from" />
        <GetInput topic="To" currency="" key="to" />
      </div>
    </div>
  );
}

function Topic() {
  return (
    <div className="topic">
      <h3>Curreny Converter</h3>
      <h5>Convert between world currencies</h5>
    </div>
  );
}

function GetInput({ topic }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currenciesList, setCurrenciesList] = useState([]);
  const [currenciesDes, setCurrenciesListDes] = useState([]);
  useEffect(function () {
    const getCurrencies = async function () {
      const res = await fetch(
        "      https://api.frankfurter.dev/v1/currencies"
      );
      const resJson = await res.json();
      const currencies = Object.keys(resJson);
      const currenciesDes = Object.values(resJson);

      setCurrenciesList(currencies);
      setCurrenciesListDes(currenciesDes);
    };
    getCurrencies();
  }, []);

  return (
    <div className="getInput">
      <p>{topic}</p>
      <form className="form">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        ></input>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="selection"
        >
          {currenciesList.map((curr) => (
            <option value={curr} key={curr}>
              {curr}
            </option>
          ))}
        </select>
      </form>
      <p>{currenciesDes.at(currenciesList.indexOf(currency))}</p>
    </div>
  );
}

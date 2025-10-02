import { useEffect, useState } from "react";
import { TrendingUp, ArrowDownUp } from "lucide-react";

const KEY = "ca007700f6389aab72ca16f0";
export default function App() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amountFrom, setAmountFrom] = useState("");
  const [result, setResult] = useState("");
  const [currenciesList, setCurrenciesList] = useState([]);
  const [currenciesDes, setCurrenciesListDes] = useState([]);
  const [loading, setLoading] = useState(false);
  function handleFrom(e) {
    if (e.target.value === to) {
      alert("Select a different currencies");
      return;
    }
    setFrom(e.target.value);
  }

  function handleTo(e) {
    if (e.target.value === from) {
      alert("Select a different currencies");
      return;
    }
    setTo(e.target.value);
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setAmountFrom(result);
    setResult(amountFrom);
  }

  useEffect(function () {
    setLoading(true);
    const getCurrencies = async function () {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${KEY}/codes`
        );

        if (!res.ok) throw new Error("Something bad happened!");
        const resJson = await res.json();

        const currencyCodes = resJson.supported_codes.map((arr) => arr[0]);

        const currenciesDes = resJson.supported_codes.map((arr) => arr[1]);

        setCurrenciesList(currencyCodes);
        setCurrenciesListDes(currenciesDes);
        // console.log(currenciesDes);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCurrencies();
  }, []);
  useEffect(
    function () {
      if (!amountFrom) {
        setResult("");
        return;
      }
      const controller = new AbortController();
      const signal = controller.signal;
      const convert = async function () {
        try {
          const res = await fetch(
            `https://v6.exchangerate-api.com/v6/${KEY}/pair/${from}/${to}/${amountFrom}`,
            { signal }
          );

          if (!res.ok) throw new Error("Bad Happened! Try Again");

          const resJson = await res.json();
          const result = Number(resJson.conversion_result).toFixed(2);
          // console.log(typeof result); #number
          setResult(result);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error.message);
          }
        }
      };
      convert();

      return () => {
        controller.abort();
      };
    },
    [from, to, amountFrom]
  );

  return (
    <div className="App">
      <Header />
      <div className="main">
        <GetInput
          topic="From"
          onChangeCurreny={handleFrom}
          currency={from}
          amount={amountFrom}
          setAmount={setAmountFrom}
          isDisabled={loading ? true : false}
          currenciesList={currenciesList}
          currenciesDes={currenciesDes}
        />
        <SwapBUtton onSwap={handleSwap} />
        <GetInput
          topic="To"
          onChangeCurreny={handleTo}
          currency={to}
          amount={result ? result : ""}
          isDisabled={true}
          currenciesList={currenciesList}
          currenciesDes={currenciesDes}
        />
      </div>
    </div>
  );
}

function SwapBUtton({ onSwap }) {
  return (
    <div className="swap-container">
      <button onClick={() => onSwap()} className="swap-button">
        <ArrowDownUp className="swap-icon" />
      </button>
    </div>
  );
}
function Header() {
  return (
    <>
      <Logo />
      <Topic />
    </>
  );
}

function Topic() {
  return (
    <div className="topic">
      <h3>Currency Converter</h3>
      <h5>Convert between world currencies</h5>
    </div>
  );
}
function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-circle">
        <TrendingUp className="logo-icon" />
      </div>
    </div>
  );
}

function GetInput({
  topic,
  onChangeCurreny,
  currency,
  amount,
  isDisabled,
  setAmount,
  currenciesList,
  currenciesDes,
}) {
  const handleAmount = function (e) {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setAmount(value);
    }
  };

  return (
    <div className="getInput">
      <p style={{ color: "#343a40", fontWeight: "500" }}>{topic}</p>
      <form className="form">
        <input
          value={amount}
          onChange={(e) => handleAmount(e)}
          disabled={isDisabled}
        ></input>
        <select
          value={currency}
          onChange={(e) => onChangeCurreny(e)}
          className="selection"
        >
          {currenciesList.map((curr) => (
            <option value={curr} key={curr}>
              {curr}
            </option>
          ))}
        </select>
      </form>
      <p style={{ color: "#868e96" }}>
        {currenciesDes.at(currenciesList.indexOf(currency))}
      </p>
    </div>
  );
}

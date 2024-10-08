import { useDarkMode } from "./hooks/useDarkMode";
import { Link } from "./lib/router";
import AppRoutes from "./routes";

import "./styles.css";

function Header() {
  const ref = useDarkMode();

  return (
    <header>
      <ul>
        <li>
          <Link path="/">Home</Link>
        </li>
        <li>
          <Link path="/countdown">Countdown</Link>
        </li>
        <li>
          <Link path="/comments">Comments</Link>
        </li>
        <li>
          <Link path="/charts">Charts</Link>
        </li>
        <li>
          <Link path="/map?bl_lat=49.699472&tr_lat=55.357133&bl_lng=-6.898218&tr_lng=1.231665">
            Map
          </Link>
        </li>
        <li>
          <Link path="/agile?projectId=1">Agile</Link>
        </li>
        <li>
          <Link path="/tic-tac-toe">TicTacToe</Link>
        </li>
        <li>
          <Link path="/whack-a-molly">WhacAMole</Link>
        </li>
        <li>
          <Link path="/snake">Snake</Link>
        </li>
        <li>
          <Link path="/game-of-life">GameOfLife</Link>
        </li>
        <li>
          <label htmlFor="theme">Dark mode</label>
          <input id="theme" ref={(el) => (ref.current = el)} type="checkbox" />
        </li>
      </ul>
    </header>
  );
}

export default function App() {
  return (
    <div className="App">
      <Header />
      <br />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

import Countdown from "./apps/Countdown";
import Comments from "./apps/Comments";
import Charts from "./apps/Charts";
import Map from "./apps/Map";
import Issues from "./apps/Issues";
import TicTacToe from "./apps/TicTacToe";
import WhackAMolly from "./apps/WhackAMolly";
import { Link, Route, Router } from "./Router";
import { useDarkMode } from "./hooks/useDarkMode";
import { Blob } from "react-interactive-blob";

import "./styles.css";

export default function App() {
  const ref = useDarkMode();

  return (
    <div className="App">
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
            <Link path="/map">Map</Link>
          </li>
          <li>
            <Link path="/issues">Issues</Link>
          </li>
          <li>
            <Link path="/tic-tac-toe">TicTacToe</Link>
          </li>
          <li>
            <Link path="/whack-a-molly">WhackAMolly</Link>
          </li>
          <li>
            <Link path="/snake">Snake</Link>
          </li>
          <li>
            <Link path="/game-of-life">GameOfLife</Link>
          </li>
          <li>
            <label htmlFor="theme">Dark mode</label>
            <input id="theme" ref={ref} type="checkbox" />
          </li>
        </ul>
      </header>
      <br />
      <main>
        <Router>
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/charts" element={<Charts />} />
          <Route
            path="/map"
            element={
              <Map
                boundaries={{
                  bl_lat: 49.699472,
                  tr_lat: 55.357133,
                  bl_lng: -6.898218,
                  tr_lng: 1.231665,
                }}
              />
            }
          />
          <Route path="/issues" element={<Issues />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/whack-a-molly" element={<WhackAMolly />} />
          <Route path="/snake" element={<div />} />
          <Route path="/game-of-life" element={<div />} />
          <Route
            path="/"
            element={
              <Blob
                acceleration={-0.9054201735838766}
                color="#2f4acf"
                elasticity={0.001}
                friction={0.0095}
                height={400}
                points={32}
                radial={0.1}
                radius={128}
                sensitivity={0.5}
                smoothing
                speed={0.5}
              />
            }
          />
        </Router>
      </main>
    </div>
  );
}

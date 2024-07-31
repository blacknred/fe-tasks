import { Suspense, lazy } from "react";
import Charts from "./features/Charts";
// import Comments from "./features/Comments";
import Countdown from "./features/Countdown";
import Issues from "./features/Issues";
import Map from "./features/Map";
import { ReactOrder } from "./features/ReactOrder/ReactOrder";
import TicTacToe from "./features/TicTacToe";
import WhackAMolly from "./features/WhackAMolly";
import { Route, Router } from "./lib/router";

const Comments = lazy(() => import('./features/Comments'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading</div>}>
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
        <Route path="/" element={<ReactOrder />} />
      </Router>
    </Suspense>
  );
}

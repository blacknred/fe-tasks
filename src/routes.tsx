import { Suspense, lazy } from "react";
import { Route, Router } from "./lib/router";

const Comments = lazy(() => import("./features/Comments"));
const Charts = lazy(() => import("./features/Charts"));
const Countdown = lazy(() => import("./features/Countdown"));
const Map = lazy(() => import("./features/Map"));
const TicTacToe = lazy(() => import("./features/TicTacToe"));
const WhackAMolly = lazy(() => import("./features/WhacAMole"));
const ReactOrder = lazy(() => import("./features/ReactOrder"));
const Agile = lazy(() => import("./features/Agile"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Router>
        <Route path="/countdown" element={<Countdown />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/map" element={<Map />} />
        <Route path="/agile" element={<Agile />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/whack-a-molly" element={<WhackAMolly />} />
        <Route path="/snake" element={<div />} />
        <Route path="/game-of-life" element={<div />} />
        <Route path="/" element={<ReactOrder />} />
      </Router>
    </Suspense>
  );
}

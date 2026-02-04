import { Switch, Route } from "wouter";
import { LandingPage } from "./pages/LandingPage";
import { CreatePage } from "./pages/CreatePage";
import { PlayPage } from "./pages/PlayPage";

function App() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/play/:gameId" component={PlayPage} />
    </Switch>
  );
}

export default App;

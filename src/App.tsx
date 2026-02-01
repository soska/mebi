import { Switch, Route, Redirect } from "wouter";
import { CreatePage } from "./pages/CreatePage";
import { PlayPage } from "./pages/PlayPage";

function App() {
  return (
    <Switch>
      <Route path="/create" component={CreatePage} />
      <Route path="/play/:gameId" component={PlayPage} />
      <Route path="/">
        <Redirect to="/create" />
      </Route>
    </Switch>
  );
}

export default App;

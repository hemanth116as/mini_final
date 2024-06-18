
import Navbar from './components/Navbar';
import Carousels from './components/Carousels';
import Foot from './components/Foot'; 
import InfoDiv from './components/InfoDiv';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import ExcelDisplay from './components/ExcelDisplay';
import FacultyDisplay from './components/FacultyDisplay';
import FacultyLogin from './components/FacultyLogin';
import Homepage from './components/HomePage';
import SignInModal from './components/SignInModal';
import Main from './components/Main';
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            {/* Redirect to '/home' when the page first loads */}
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <Homepage/>
            </Route>
            <Route path='/main'>
              <Main/>
            </Route>
            <Route path="/facultydisplay">
              <FacultyDisplay/>
            </Route>
            {/* <Route path="/regular_tt">
              <ExcelDisplay/>
            </Route>
            <Route path='/faculty_tt'>
              <FacultyDisplay/>
            </Route>
            <Route path="/faculty_login">
              <FacultyLogin/>
            </Route>
            <Route path='signin'>
              <SignInModal/>
            </Route> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
}
export default App;

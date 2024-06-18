import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ExcelDisplay from './ExcelDisplay';

import FacultyLogin from './FacultyLogin';
import SignInModal from './SignInModal';
import Navbar from './Navbar';
import Carousels from './Carousels';
import InfoDiv from './InfoDiv';
import Footer from './Foot';
import FacultyDisplay from './FacultyDisplay';
import Admin from './Admin';
import FacultyAvailabilityChecker from './FacultyAvailabiltyChecker';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';

export default function Main() {
  return (
    <div>
      <Navbar />
      <Switch>

        <Route exact path="/main">
        <Carousels/>
              <InfoDiv/>
              <Footer/>
        </Route>
        <Route path="/main/regular_tt">
          <ExcelDisplay />
        </Route>
        <Route path="/main/faculty_tt">
          <FacultyDisplay />
        </Route>
        <Route path="/main/faculty_login">
          <FacultyLogin />
        </Route>
        <Route path="/main/signin">
          <SignInModal />
        </Route>
        <Route path="/main/facultydisplay">
            <FacultyDisplay/>
        </Route>
        <Route path='/main/admin_module'>
          <Admin/>
        </Route>
        <Route path='/main/facultyfreetimechecker'>
          <FacultyAvailabilityChecker/>
        </Route>
        <Route path="/main/admininbox">
        <AdminDashboard/>
        </Route>
        <Route path="/main/facdash">
        <FacultyDashboard/>
        </Route>
      </Switch>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';
import SignInModal from './SignInModal';
import FacultyLogin from './FacultyLogin';

const HomePage = () => {
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showFacultyLoginModal, setShowFacultyLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openSignInModal = () => {
        setShowSignInModal(true);
        document.body.classList.add('modal-open'); // Apply class to blur background
    };

    const closeSignInModal = () => {
        setShowSignInModal(false);
        document.body.classList.remove('modal-open'); // Remove class to unblur background
    };

    const openFacultyLoginModal = () => {
        setShowFacultyLoginModal(true);
        document.body.classList.add('modal-open'); // Apply class to blur background
    };

    const closeFacultyLoginModal = () => {
        setShowFacultyLoginModal(false);
        document.body.classList.remove('modal-open'); // Remove class to unblur background
    };

    const handleSuccessfulSignIn = () => {
        setIsLoggedIn(true);
        setShowSignInModal(false);
        document.body.classList.remove('modal-open'); // Remove class to unblur background
    };

    const handleSuccessfulFacultyLogin = () => {
        setIsLoggedIn(true);
        setShowFacultyLoginModal(false);
        document.body.classList.remove('modal-open'); // Remove class to unblur background
    };

    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <img src={Students} alt="students" style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper elevation={3}>
                        <StyledTitle>
                            Welcome to
                            <br />
                            Faculty Roster
                            <br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Faculty Roster Management involves organizing and managing the schedules,
                            and responsibilities of faculty members in an educational institution.
                            Effective roster management ensures that classes are adequately staffed,
                            faculty workloads are balanced, and both faculty and student needs are met.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="#">
                                <LightPurpleButton variant="contained" fullWidth onClick={openSignInModal}>
                                    Login
                                </LightPurpleButton>
                            </StyledLink>
                            <StyledLink to="#">
                                <Button variant="outlined" fullWidth
                                    sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                                    onClick={openFacultyLoginModal}
                                >
                                    Login as Faculty
                                </Button>
                            </StyledLink>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
            {showSignInModal && <SignInModal onSuccess={handleSuccessfulSignIn} onClose={closeSignInModal} />}
            {showFacultyLoginModal && <FacultyLogin onSuccess={handleSuccessfulFacultyLogin} onClose={closeFacultyLoginModal} />}
        </StyledContainer>
    );
};

export default HomePage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  margin-top: 30px;
  margin-bottom: 30px;
  letter-spacing: normal;
  line-height: normal;
  font-family: Arial;
  font-size: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

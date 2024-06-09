import AccountPage from "../pages/AccountPage/AccountPage";
import BusinessPage from "../pages/BusinessPage/BusinessPage";
import CandidateProfilePage from "../pages/CandidateProfilePage/CandidateProfilePage";
import CandidatesPage from "../pages/CandidatesPage/CandidatesPage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ResultsPage from "../pages/ResultsPage/ResultsPage";

export const nav = [
     { path:     "/",         name: "Головна",        element: <HomePage />,       isMenu: true,     isPrivate: false  },
     { path:     "/login",    name: "Увійти",       element: <LoginPage />,      isMenu: false,    isPrivate: false  },
     { path:     "/candidates",  name: "Кандидату",     element: <CandidatesPage />,    isMenu: true,     isPrivate: true  },
     { path:     "/candidate/:id",  name: "Роботодавцю",     element: <CandidateProfilePage />,    isMenu: false,     isPrivate: true  },
     { path:     "/business",  name: "Роботодавцю",     element: <BusinessPage />,    isMenu: true,     isPrivate: true  },
     //{ path:     "/success",  name: "Кандидату",     element: <SuccessfulRegistration />,    isMenu: false,     isPrivate: true  },
     { path:     "/results",  name: "Роботодавцю",     element: <ResultsPage />,    isMenu: false,     isPrivate: true  },
     { path:     "/account",  name: "Профіль",     element: <AccountPage />,    isMenu: true,     isPrivate: true  },
];

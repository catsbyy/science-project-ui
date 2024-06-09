import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import CandidatesPage from "../pages/CandidatesPage/CandidatesPage";
import CandidateProfilePage from "../pages/CandidateProfilePage/CandidateProfilePage";
import BusinessPage from "../pages/BusinessPage/BusinessPage";
import AccountPage from "../pages/AccountPage/AccountPage";
import ResultsPage from "../pages/ResultsPage/ResultsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "candidates", element: <CandidatesPage /> },
            { path: "candidate/:id", element: <CandidateProfilePage /> },
            { path: "business", element: <BusinessPage /> },
            { path: "account", element: <AccountPage /> },
            { path: "results", element: <ResultsPage /> }
        ]
    }
]);
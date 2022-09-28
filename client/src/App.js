import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Loading from "./components/Loading";
import Landing from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import SearchResultsPage from "./pages/SearchResultsPage";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import { toast, ToastContainer } from "react-toastify";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { UserContext } from "./context/UserContext";

function App() {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("TaskUpToken");
                if (!accessToken) {
                    setLoggedUser(null);
                    setLoading(false);
                    return;
                }
                const res = await fetch("/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await res.json();
                if (res.status === 200) {
                    setLoggedUser(data.id);
                } else {
                    setLoggedUser(null);
                }
            } catch (err) {
                toast.error("Something went wrong");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <Loading />;
    return (
        <Router>
            <div aria-live="polite" aria-label="toast message">
                <ToastContainer role="alert" ariaLabel="toast" />
            </div>
            <Switch>
                <Route exact path="/">
                    <Landing />
                </Route>
                <Route exact path="/dashboard">
                    {loggedUser ? <Dashboard /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/profile">
                    {loggedUser ? <Profile /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/profile/update">
                    <UpdateProfile />
                </Route>
                <Route exact path="/projects/:projectId">
                    {loggedUser ? <Project /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/search/:query">
                    {loggedUser ? <SearchResultsPage /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/login">
                    {!loggedUser ? <Login /> : <Redirect to="/dashboard" />}
                </Route>
                <Route exact path="/register">
                    {!loggedUser ? <Register /> : <Redirect to="/dashboard" />}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

import "../assets/css/Landing.css";
import NavbarH from "../components/NavbarH";
import Footer from "../components/Footer.js";
import CheckIcon from "../assets/images/checklist.png";
import ComputerWoman from "../assets/images/computerWoman.png";
import WorkFlow from "../assets/images/bookkeeping.png";
import Progress from "../assets/images/progressChart.png";
import Complete from "../assets/images/completed.png";

const Landing = () => {
    return (
        <div className="pageBody">
            <NavbarH />
            <header className="page-header gradient">
                <div className="container pt-5">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-5">
                            <h1>Welcome to TaskUp!</h1>
                            <p>A space where you can easily manage all your project tasks.</p>
                        </div>
                        <div className="col-md-5 row justify-content-center">
                            <img
                                src={CheckIcon}
                                alt="a man standing before a completed checklist"
                                style={{ width: "min(500px, 100%)" }}
                            />
                        </div>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#fff"
                        fillOpacity="1"
                        d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,138.7C672,128,768,64,864,53.3C960,43,1056,85,1152,90.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </header>
            <section className="optask">
                <div className="container text-center" role="main">
                    <div className="row g-5 align-items-center justify-content-center">
                        <div className="col-md-3">
                            <img
                                src={WorkFlow}
                                alt="work flow graphic"
                                className="img-fluid pic1"
                            />
                        </div>
                        <div className="col-md-4">
                            <img
                                src={Progress}
                                alt="black board with to do, in progress, and done columns"
                                className="img-fluid"
                            />
                        </div>
                        <div className="col-md-3">
                            <img
                                src={Complete}
                                alt="woman checking off to do list"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="feature gradient">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#fff"
                        fillOpacity="1"
                        d="M0,64L48,58.7C96,53,192,43,288,64C384,85,480,139,576,181.3C672,224,768,256,864,229.3C960,203,1056,117,1152,96C1248,75,1344,117,1392,138.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    ></path>
                </svg>
                <div className="container" role="complementary">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-5">
                            <img
                                src={ComputerWoman}
                                alt="woman working at a computer"
                                style={{ width: "min(500px, 100%)" }}
                            />
                        </div>
                        <div className="col-md-5">
                            <h2 className="my-3">What can TaskUp do?</h2>
                            <p className="my-4">
                                TaskUp is reimaging how project management can be done. By
                                streamlining the process and giving you a place to keep track of all
                                of your projects, you no longer need to go anywhere else to keep
                                track of your work.
                            </p>
                            <ul>
                                <li> Create a project.</li>
                                <li> Add tasks.</li>
                                <li> Get projects done.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mb-3">
                <Footer />
            </div>
        </div>
    );
};

export default Landing;

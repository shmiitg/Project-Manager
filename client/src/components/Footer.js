import "../assets/css/Footer.css";

function Footer() {
    return (
        <footer className="text-center text-lg-start">
            <div className="mt-5">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg3 col-md-6 mb-4 mb-md-0">
                        <ul className="d-flex list-unstyled mb-0 justify-content-center gap-5">
                            <li>
                                <a
                                    target="_blank"
                                    href="https://github.com/shmiitg"
                                    className="text-dark"
                                    rel="noreferrer"
                                >
                                    Github
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://shm-portfolio.netlify.app/"
                                    className="text-dark"
                                    rel="noreferrer"
                                >
                                    Website
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

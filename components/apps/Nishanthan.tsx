import React, { Component, JSX } from 'react';
// import ReactGA from 'react-ga4';

interface AboutNishanthanState {
    screen: JSX.Element;
    active_screen: string;
    navbar: boolean;
}

export class AboutNishanthan extends Component<{}, AboutNishanthanState> {
    private screens: Record<string, JSX.Element> = {};

    constructor(props: {}) {
        super(props);
        this.state = {
            screen: <About />,
            active_screen: "about", // default screen
            navbar: false,
        };
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "skills": <Skills />,
            "projects": <Projects />,
            "resume": <Resume />,
        };

        const lastVisitedScreen = localStorage.getItem("about-section") || "about";
        this.changeScreen(lastVisitedScreen);
    }

    changeScreen = (screen: string) => {
        localStorage.setItem("about-section", screen);
        // ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "Custom Title" });
        this.setState({ screen: this.screens[screen], active_screen: screen });
    };

    showNavBar = () => {
        this.setState((prevState) => ({ navbar: !prevState.navbar }));
    };

    renderNavLinks = () => {
        const navItems = ["about", "education", "skills", "projects", "resume"];
        return (
            <>
                {navItems.map((item) => (
                    <div
                        key={item}
                        id={item}
                        tabIndex={0}
                        onClick={() => this.changeScreen(item)}
                        className={
                            (this.state.active_screen === item
                                ? "bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
                                : "hover:bg-gray-50 hover:bg-opacity-5") +
                            " w-28 md:w-full md:rounded-none rounded-sm cursor-pointer outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
                        }
                    >
                        <span className="ml-1 md:ml-2 text-gray-50">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                    </div>
                ))}
            </>
        );
    };

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className="w-3.5 border-t border-white"></div>
                    <div className="w-3.5 border-t border-white mt-1 mb-1"></div>
                    <div className="w-3.5 border-t border-white"></div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutNishanthan;

export const displayAboutNishanthan = () => {
    return <AboutNishanthan />;
};

function About() {
    return <div>About Content</div>;
}

function Education() {
    return <div>Education Content</div>;
}

function Skills() {
    return <div>Skills Content</div>;
}

function Projects() {
    return <div>Projects Content</div>;
}

function Resume() {
    return <iframe className="h-full w-full" src="./files/Nishanthan-Resume.pdf" title="Nishanthan's Resume" frameBorder="0"></iframe>;
}

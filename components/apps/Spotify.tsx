import React, { JSX } from 'react';

const Spotify: React.FC = () => {
    return (
        <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg"
            frameBorder="0"
            title="Spotify"
            className="h-full w-full bg-ub-cool-grey"
        ></iframe>
    );
};

export default Spotify;

export const displaySpotify = (): JSX.Element => {
    return <Spotify />;
};

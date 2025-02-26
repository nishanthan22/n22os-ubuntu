import React from 'react';

const VsCode: React.FC = () => {
    return (
        <iframe
            src="https://github.com/conwnet/github1s"
            frameBorder="0"
            title="VsCode"
            className="h-full w-full bg-ub-cool-grey"
        ></iframe>
    );
};

export default VsCode;

export const displayVsCode = (): React.ReactElement => {
    return <VsCode />;
};
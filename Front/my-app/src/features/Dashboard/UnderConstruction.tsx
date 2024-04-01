import React from 'react';

import Lottie from 'react-lottie';
import animationData from '../../images/UnderConstruction.json'; // Import your JSON animation data


const UnderConstruction = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };
  return (
    <div>
        <h1>Still Working on it</h1>

        <br></br>

        <Lottie options={defaultOptions} height={400} width={800} />

    </div>
  );
};

export default UnderConstruction;

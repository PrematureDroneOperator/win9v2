'use client';

import React from "react";

interface ParticlesBackgroundProps {
    id?: string;
    color?: string;
}

const ParticlesBackground = ({ id = "tsparticles", color = "#bf00ff" }: ParticlesBackgroundProps) => {
    return <div id={id} className="absolute inset-0 z-0 pointer-events-none bg-transparent" />;
};

export default ParticlesBackground;

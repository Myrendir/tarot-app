const SunIco = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG paths for a sun icon */}
            <circle cx="10" cy="10" r="5" fill="#FFD700"/> {/* Sun Core */}
            {/* Sun Rays */}
            <path d="M10 0V3" stroke="#FFD700"/>
            <path d="M10 17V20" stroke="#FFD700"/>
            <path d="M0 10H3" stroke="#FFD700"/>
            <path d="M17 10H20" stroke="#FFD700"/>
            {/* Diagonal Rays */}
            <path d="M3 3L6 6" stroke="#FFD700"/>
            <path d="M14 14L17 17" stroke="#FFD700"/>
            <path d="M14 6L17 3" stroke="#FFD700"/>
            <path d="M3 17L6 14" stroke="#FFD700"/>
        </svg>
    );
}

export default SunIco;

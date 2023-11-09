const SnowIco = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG paths for a snowflake icon */}
            <path d="M10 0V20" stroke="#87CEEB"/>
            <path d="M0 10H20" stroke="#87CEEB"/>
            {/* Diagonal Lines */}
            <path d="M3 3L17 17" stroke="#87CEEB"/>
            <path d="M17 3L3 17" stroke="#87CEEB"/>
            {/* Small Crosses on Lines */}
            {/* Horizontal and Vertical */}
            <path d="M10 5H8V7H10V5Z" fill="#87CEEB"/>
            <path d="M10 15H8V17H10V15Z" fill="#87CEEB"/>
            <path d="M15 10H13V12H15V10Z" fill="#87CEEB"/>
            <path d="M5 10H7V12H5V10Z" fill="#87CEEB"/>
            {/* Diagonal */}
            <path d="M13 7L12 6L13 5L14 6L13 7Z" fill="#87CEEB"/>
            <path d="M7 13L6 14L5 13L6 12L7 13Z" fill="#87CEEB"/>
            <path d="M7 7L6 6L7 5L8 6L7 7Z" fill="#87CEEB"/>
            <path d="M13 13L14 14L13 15L12 14L13 13Z" fill="#87CEEB"/>
        </svg>
    );
}

export default SnowIco;

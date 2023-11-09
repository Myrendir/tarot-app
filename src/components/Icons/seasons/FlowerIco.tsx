const FlowerIco = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG paths for a flower icon */}
            <circle cx="10" cy="10" r="3" fill="#FF69B4"/> {/* Flower Center */}
            {/* Petals */}
            <circle cx="10" cy="3" r="2" fill="#FF69B4"/>
            <circle cx="10" cy="17" r="2" fill="#FF69B4"/>
            <circle cx="3" cy="10" r="2" fill="#FF69B4"/>
            <circle cx="17" cy="10" r="2" fill="#FF69B4"/>
            {/* Diagonal Petals */}
            <circle cx="5" cy="5" r="2" fill="#FF69B4"/>
            <circle cx="15" cy="15" r="2" fill="#FF69B4"/>
            <circle cx="15" cy="5" r="2" fill="#FF69B4"/>
            <circle cx="5" cy="15" r="2" fill="#FF69B4"/>
        </svg>
    );
}

export default FlowerIco;

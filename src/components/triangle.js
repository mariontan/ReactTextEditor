import React from 'react';

const Triangle = () => {
    return (
        <div style={styles.container}>
            <div style={styles.triangle} />
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '10px solid blue',
        position: 'absolute',
        top: -5,
        left: '0%',
        transform: 'translate(-50%)',
    },
};

export default Triangle;
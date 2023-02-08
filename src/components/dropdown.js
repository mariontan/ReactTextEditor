import React from 'react';
import Triangle from './triangle';

const Dropdown = ({
    mergeFields,
    handleMergeFieldClick,
    showMergeFields,
    setShowMergeFields
}) => {
    return (
        <div style={styles.container}>
            <div onClick={() => setShowMergeFields(!showMergeFields)}>
                <Triangle />
            </div>
            {showMergeFields && (
                <div style={styles.dropdownContainer}>
                    {mergeFields.map((field, index) => (
                        <p key={index} value={field.value} onClick={() => handleMergeFieldClick(field)}>
                            {field.name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
    },
    toggleButton: {
        backgroundColor: 'lightgray',
        padding: '10px',
        borderRadius: '5px',
    },
    dropdownContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px 0px lightgray',
        borderRadius: '5px',
        padding: '10px',
        top: '100%',
        left: 0,
    },
};

export default Dropdown;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CORS_PROXY_URL, HOST, LOAD_URL, TEMPLATE_ID } from './constants';
import { getTheWord, getCursorXY } from './utils';
import Dropdown from './components/dropdown'

const App = () => {
    const [template, setTemplate] = useState('');
    const [mergeFields, setMergeFields] = useState([]);
    const [characterCount, setCharacterCount] = useState(0);
    const [showMergeFields, setShowMergeFields] = useState(false);
    const [trianglePosition, setTrianglePosition] = useState({});
    const [clickedWordIndex, setClickedWordIndex] = useState(0)

    useEffect(() => {
        setCharacterCount(template.length);
    }, [template]);

    const handleEditorClick = (event) => {
        const { index } = getTheWord(event.target.selectionStart, template)
        setClickedWordIndex(index)
        setTrianglePosition({
            top: event.clientY,
            left: event.clientX,
        });
        setShowMergeFields(true);
    };

    const handleLoadTemplate = () => {
        axios.get(`${CORS_PROXY_URL}${LOAD_URL}`)
            .then(res => {
                setTemplate(res.data.template);
                setMergeFields(res.data.mergeFields);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleSaveTemplate = () => {
        axios.post(`${CORS_PROXY_URL}${HOST}`, {
            id: `${TEMPLATE_ID}`,
            template: template,
        })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            });
    };


    const handleMergeFieldClick = (field) => {
        const templateArr = template.split(' ')
        templateArr.splice(clickedWordIndex, 0, field.value)
        const newTemplate = templateArr.join(' ')
        setTemplate(newTemplate);
        setShowMergeFields(false);

    };
    console.log('props index', clickedWordIndex)
    console.log('props triangle', trianglePosition)
    return (
        <div>
            <div onMouseLeave={() => setShowMergeFields(false)}>
                <textarea
                    value={template}
                    onChange={e => setTemplate(e.target.value)}
                    onClick={handleEditorClick}
                />
                <div style={{ position: 'absolute', top: trianglePosition.top, left: trianglePosition.left }}>
                    <Dropdown
                        mergeFields={mergeFields}
                        handleMergeFieldClick={handleMergeFieldClick}
                        showMergeFields={showMergeFields}
                        setShowMergeFields={setShowMergeFields}
                    />
                </div>
            </div>
            <div>
                <p style={{ color: characterCount > 160 ? 'red' : 'black' }}>
                    Character Count: {characterCount}
                </p>
            </div>
            <div>
                <button onClick={handleLoadTemplate}>Load</button>
                <button onClick={handleSaveTemplate}>Save</button>
            </div>
        </div>
    );
};

export default App
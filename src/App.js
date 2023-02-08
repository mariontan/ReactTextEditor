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
    const [insertedIndex, setInsertedIndex] = useState([])

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
        const indexToInsert = []
        const length = field.value.split(' ').length
        for (let i = 1; i <= length; i++) {
            indexToInsert.push(clickedWordIndex + i)
        }
        templateArr.splice(clickedWordIndex + 1, 0, field.value)
        const newInsertedIndex = [...insertedIndex.map(item => {
            if (item > clickedWordIndex + 1) {
                return item + 1
            }
            return item
        }), ...indexToInsert]

        setInsertedIndex(newInsertedIndex)
        const newTemplate = templateArr.join(' ')
        setTemplate(newTemplate);
        setShowMergeFields(false);
    };
    const onTextAreaChange = (event) => {
        const { target, currentTarget } = event
        const { selectionStart } = target
        setClickedWordIndex(selectionStart)
        setTemplate(event.target.value)
        const { x, y } = getCursorXY(currentTarget, selectionStart)
        setTrianglePosition({
            top: y,
            left: x,
        })
    }
    const onBackSpace = (event) => {
        const { keyCode, target } = event
        const { index } = getTheWord(target.selectionStart, template)
        // act only on backspace
        if (keyCode !== 8) {
            return
        }

        if (insertedIndex.includes(index)) {
            event.preventDefault();
            const temapleArr = template.split(' ')
            const filteredInsertedIndex = insertedIndex.filter(item => item !== index)
            const newInsertedIndex = filteredInsertedIndex.map((item) => {
                if (item > index) {
                    return item - 1
                }
                return item
            })
            temapleArr.splice(index, 1)
            setTemplate(temapleArr.join(' '))
            setInsertedIndex(newInsertedIndex)
        }
    }
    return (
        <div>
            <div onMouseLeave={() => setShowMergeFields(false)}>
                <textarea
                    value={template}
                    onChange={onTextAreaChange}
                    onClick={handleEditorClick}
                    onKeyDown={onBackSpace}
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
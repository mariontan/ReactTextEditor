import { useEffect, useRef } from "react";

export function getTheWord(selectionStart, message) {
    let arr = message.split(" ");
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i].length + 1
        if (sum > selectionStart) {
            return {
                index: i,
                word: arr[i]
            }
        }

    }
}

export function getCursorXY(input, selectionPoint) {
    const {
        offsetLeft: inputX,
        offsetTop: inputY,
    } = input
    // create a dummy element that will be a clone of our input
    const div = document.createElement('div')
    // get the computed style of the input and clone it onto the dummy element
    const copyStyle = getComputedStyle(input)
    for (const prop of copyStyle) {
        div.style[prop] = copyStyle[prop]
    }
    // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
    const swap = '.'
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
    // set the div content to that of the textarea up until selection
    const textContent = inputValue.substr(0, selectionPoint)
    // set the text content of the dummy element div
    div.textContent = textContent
    if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
    // if a single line input then the div needs to be single line and not break out like a text area
    if (input.tagName === 'INPUT') div.style.width = 'auto'
    // create a marker element to obtain caret position
    const span = document.createElement('span')
    // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
    span.textContent = inputValue.substr(selectionPoint) || '.'
    // append the span marker to the div
    div.appendChild(span)
    // append the dummy element to the body
    document.body.appendChild(div)
    // get the marker position, this is the caret position top and left relative to the input
    const { offsetLeft: spanX, offsetTop: spanY } = span
    // lastly, remove that dummy element
    // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
    document.body.removeChild(div)
    // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
    return {
        x: inputX + spanX,
        y: inputY + spanY - 245,
    }
}

export function getNewInsertedIndex(field, clickedWordIndex, insertedIndex) {
    const indexToInsert = [];
    const length = field.value.split(' ').length;
    for (let i = 1; i <= length; i++) {
        indexToInsert.push(clickedWordIndex + i);
    }
    const newInsertedIndex = [...insertedIndex.map(item => {
        if (item > clickedWordIndex + 1) {
            return item + 1;
        }
        return item;
    }), ...indexToInsert];
    return newInsertedIndex;
}

export function removeIndex(insertedIndex, index) {
    const filteredInsertedIndex = insertedIndex.filter(item => item !== index);
    const newInsertedIndex = filteredInsertedIndex.map((item) => {
        if (item > index) {
            return item - 1;
        }
        return item;
    });
    return newInsertedIndex;
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
    }); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
}
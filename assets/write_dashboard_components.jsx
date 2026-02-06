


// import { useState } from 'react';
import { createRoot } from 'react-dom/client';


function StorySoFarSplitOut() {
    var elementPerSection;

    console.log("React function reached");
    const storySoFar = [
        { "sectionid": 12, "content": "First Section" },
        { "sectionid": 13, "content": "Second Section" },
        { "sectionid": 1, "content": "Third Section" },
        { "sectionid": 9, "content": "Fourth Section" }
    ];// list holding all the story sections, of format {"sectionid":sectionid, "content":content}

    // console.log(storySoFar);
    elementPerSection = storySoFar.map(storySection =>
        <textarea key={storySection.sectionid}>{storySection.content}</textarea>);

    return elementPerSection;
}

console.log(".jsx file run");
createRoot(document.getElementById('react-read-only-content')).render(
    <StorySoFarSplitOut />
);
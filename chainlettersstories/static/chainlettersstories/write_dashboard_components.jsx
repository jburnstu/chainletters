


// import { useState } from 'react';
import { createRoot } from 'react-dom/client';



function StorySoFarSplitOut() {

    storySoFar = [{ "sectionid": 12, "content": "First Section" },
    { "sectionid": 13, "content": "Second Section" },
    { "sectionid": 1, "content": "Third Section" },
    { "sectionid": 9, "content": "Fourth Section" }
    ] // list holding all the story sections, of format {"sectionid":sectionid, "content":content}

    return storySoFar.map(storySection =>
        <textarea key={storySection.sectionid}>{storySection.content}</ textarea>
    )


}

createRoot(document.getElementById('react-read-only-content')).render(
    <StorySoFarSplitOut />
);
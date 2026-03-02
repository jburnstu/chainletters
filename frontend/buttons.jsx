
import React, { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
export default { NewButton, JoinButton, SubmissionButton, NewModerationButton };
import { UserContext } from "./context.jsx";

function getRandomItem(array, numberOfResults = 1, arrayOfOne = false) {
    console.log("started getRandomItem");
    if ((numberOfResults == 1 || array.length == 1) && arrayOfOne) {
        return array[Math.floor(Math.random() * array.length)];
    }

    let set = new Set();
    while (set.size < numberOfResults && set.size < array.length) {
        var randomIndex = Math.floor(Math.random() * array.length);
    }
    let randomIndexArray = Array.from(set);
    return randomIndexArray.map(index => array[index]);
}

async function contactAPI(urlTarget, method, bodyDict = {}) {

    const urlStub = "http://127.0.0.1:8000/api/";
    let fetchData;
    switch (method) {
        case "get":
            fetchData = {
                method: method
            }
            break;
        default:
            fetchData = {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyDict)
            }
    }

    let response = await fetch(`${urlStub}${urlTarget}`,
        fetchData
    )

    if ((method == "get" && response.status != 200) || !response.ok) {
        console.log("HTTP Error ", response.status, "at url ", `${urlStub}${urlTarget}`);
        return {};
    }

    return response.json();
};

export function NewButton(props) {
    const userid = useContext(UserContext);

    async function handleSubmit(e) {

        let storyCreationData = await contactAPI("story/", "post",
            {
                'userid': userid
            }
        )

        let sectionCreationData = await contactAPI("section/", "post",
            {
                'storyid': storyCreationData.id,
                'userid': userid,
                'sectionstatusid': 1,
            }
        )

        let newSectionID = await sectionCreationData.sectionid;
        let newStoryDict = await {
            "id": newSectionID, "sectiontrace": [{ newSectionID: "" }],
        }
        console.log("NEWSTORYDICT", newStoryDict);
        props.addNewStory(newStoryDict);
    }



    return (
        <button onClick={handleSubmit}>NEW</button>
    )
}


export function JoinButton(props) {
    const userid = useContext(UserContext);


    async function handleSubmit(e) {

        let availabilityData = await contactAPI(`userincludingavailability/${userid}/`,
            "get");

        let availableSections = availabilityData.availablesection;
        let randomSectionID = getRandomItem(availableSections);
        let updatePreviousSectionData = await contactAPI(`section/${randomSectionID}/`,
            "patch",
            { 'sectionstatusid': 5 }
        );

        let createSectionData = await contactAPI("section/",
            "post",
            {
                'storyid': updatePreviousSectionData.storyid,
                'userid': userid,
                'sectionstatusid': 1,
                'previoussectionid': randomSectionID
            }
        );

        let getNewSectionTraceData = await contactAPI(`sectiontrace/${createSectionData.sectionid}`, "get");
        console.log(getNewSectionTraceData);
        props.addNewStory(getNewSectionTraceData);
    }

    return (
        <button onClick={handleSubmit}>JOIN</button>
    )
}

export function SubmissionButton(props) {

    const userid = useContext(UserContext);

    let sectionstatusid;
    switch (props.submissionType) {
        case "SAVE":
            sectionstatusid = 1;
            break;
        case "SUBMIT":
            sectionstatusid = 2;
            break;
        case "ABANDON":
            sectionstatusid = 6;
            break;
    }

    async function handleSubmit(e) {

        let getNewSectionTraceData = await contactAPI(`sectiontrace/${props.sectionid}`, "get");

        console.log(getNewSectionTraceData);
        if (props.submissionType != "SAVE") {
            props.removeCurrentStory(getNewSectionTraceData);
        }

        let currentContent = props.currentContent;
        console.log(currentContent)
        let updateSectionStatusData = await contactAPI(`section/${props.sectionid}/`, "patch",
            {
                'sectionstatusid': sectionstatusid,
                'content': currentContent
            }
        )

        console.log(updateSectionStatusData);
        if (props.submissionType == "ABANDON" && updateSectionStatusData.previoussectionid != null) {
            contactAPI(`section/${updateSectionStatusData.previoussectionid}/`, "patch",
                {
                    'sectionstatusid': 4
                }
            )
        }


    }




    return (
        <button onClick={handleSubmit}>{props.submissionType}</button>
    )
}


export function NewModerationButton(props) {
    return null;
}

export function ModalButton(props) {
    const userid = useContext(UserContext);
    const storiesInModal = 3;


    async function getSectionsForModal() {
        let availabilityData = await contactAPI(`userincludingavailability/${userid}/`, "get")
        let availableSections = availabilityData.availablesection;
        let randomSectionIDArray = getRandomItem(availableSections, storiesInModal);
        let sectionTraceDataArray = [];
        let sectionTraceData;
        await Promise.all(randomSectionIDArray.map(async (sectionID) => {
            sectionTraceData = await contactAPI(`sectiontrace/${sectionID}`, "get");
            sectionTraceDataArray.push(sectionTraceData);
        }
        )
        )
        return sectionTraceDataArray;
    }


    const [isOpen, setIsOpen] = useState(false);

    const [arrayOfAvailableStories, setArrayOfAvailableStories] = useState(getSectionsForModal());

    function onModalClick() {
        setIsOpen(true);

    }

    function onStoryDisplaySelect(storyKey) {
        setIsOpen(false);
        props.addNewStory(storyKey);
    }

    useEffect(() => console.log("STATESET"));

    return (
        <>
            <button onClick={onModalClick}> OpenMyModal
            </ button >
            <ModalWindow isOpen={isOpen} onClose={onStoryDisplaySelect} arrayOfStoryOptions={arrayOfAvailableStories}>
                <div className="allDisplayStoriesContainer">
                    {arrayOfAvailableStories.map(availableStory =>
                        <StoryDisplayInModal key={availableStory.id} onClick={onStoryDisplaySelect} storyArray={availableStory} />
                    )}
                </div>
            </ModalWindow >
        </>
    )
}

function StoryDisplayInModal(props) {
    let firstSection = props.storyArray[0]
    let finalSection = props.storyArray[-1]
    finalSection = (finalSection == firstSection) ? null : finalSection


    return (
        <button onClick={props.onClick} className="displayStoryContainer">
            <textarea value={firstSection} readOnly />
            {(finalSecion) ? <textarea value={props.storyArray[-1]} readOnly /> : null}
        </button>
    )
}

function ModalWindow(props) {

    if (!(props.isOpen)) return null;

    return (
        createPortal(
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px'
                }}>

                    <button onClick={props.onClose}>Close</button>
                </div>
            </div>,
            document.body
        )
    )
}
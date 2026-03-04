
import React, { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
export default { NewButton, JoinButton, SubmissionButton, NewModerationButton };
import { UserContext } from "./context.jsx";
import { useNavigate, useLocation } from "react-router";

function getRandomItem(array, numberOfResults = 1, arrayOfOne = false) {
    console.log("started getRandomItem");
    if ((numberOfResults == 1 || array.length == 1) && !(arrayOfOne)) {
        return array[Math.floor(Math.random() * array.length)];
    }

    let set = new Set();
    while (set.size < numberOfResults && set.size < array.length) {
        console.log("Inside the while");
        var randomIndex = Math.floor(Math.random() * array.length);
        set.add(randomIndex);
    }
    let randomIndexArray = Array.from(set);
    console.log("finished getrandomitem");

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


async function uploadNewSection(previousSectionID, userID) {
    let updatePreviousSectionData = await contactAPI(`section/${previousSectionID}/`,
        "patch",
        { 'sectionstatusid': 5 }
    );

    let createSectionData = await contactAPI("section/",
        "post",
        {
            'storyid': updatePreviousSectionData.storyid,
            'userid': userID,
            'sectionstatusid': 1,
            'previoussectionid': previousSectionID
        }
    );

    let getNewSectionTraceData = await contactAPI(`sectiontrace/${createSectionData.id}`, "get");
    console.log(getNewSectionTraceData);
    return getNewSectionTraceData;
}

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

        let newSectionID = await sectionCreationData.id;
        console.log(newSectionID);
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

        let randomSectionID = await getRandomItem(availabilityData.availablesection);
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

        let getNewSectionTraceData = await contactAPI(`sectiontrace/${createSectionData.id}`, "get");
        console.log(getNewSectionTraceData);
        props.addNewStory(getNewSectionTraceData);
    }

    return (
        <button onClick={handleSubmit}>JOIN</button>
    )
}

export function SubmissionButton(props) {
    let navigate = useNavigate();
    let location = useLocation();

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

        let getNewSectionTraceData = await contactAPI(`sectiontrace/${props.sectionid}/`, "get");

        console.log(getNewSectionTraceData);
        if (props.submissionType != "SAVE") {
            props.removeCurrentStory(getNewSectionTraceData);
        }

        let currentContent = (typeof (props.currentContent) == "undefined") ? "" : props.currentContent;
        console.log(currentContent);
        console.log(`section/${props.sectionid}/`);

        contactAPI(`section/${props.sectionid}/`, "patch",
            {
                'sectionstatusid': sectionstatusid,
                'content': currentContent
            }
        )
            .then(
                function (value) {
                    console.log("Is it getting here?");
                    console.log(value);
                    console.log(value.previoussectionid);
                    if (props.submissionType == "ABANDON") {
                        console.log("made it here!");
                        if (value.previoussectionid != null) {
                            console.log("second conditional!");
                            contactAPI(`section/${value.previoussectionid}/`, "patch",
                                {
                                    'sectionstatusid': 4
                                }
                            )
                        }
                        console.log(location.pathname);
                        navigate(`..`);
                        console.log(location.pathname);
                    }
                })
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
        let randomSectionIDArray = await getRandomItem(availabilityData.availablesection, storiesInModal);
        let sectionTraceDataArray = [];
        let sectionTraceData;
        await Promise.all(randomSectionIDArray.map(async (sectionID) => {
            console.log("Setting up promise for sectionID", sectionID);
            sectionTraceData = await contactAPI(`sectiontrace/${sectionID}`, "get");
            sectionTraceDataArray.push(sectionTraceData);
            console.log(sectionTraceDataArray);
        }
        )
        )
        await setArrayOfAvailableStories(sectionTraceDataArray);
        return sectionTraceDataArray;
    }


    const [isOpen, setIsOpen] = useState(false);

    const [arrayOfAvailableStories, setArrayOfAvailableStories] = useState([]);

    console.log(arrayOfAvailableStories);

    function createModal() {
        getSectionsForModal()
            .then(function (value) {
                setIsOpen(true);
            })

    }

    function selectStory(previoussectionid) {
        setIsOpen(false);
        uploadNewSection(previoussectionid, userid)
            .then(function (value) { props.addNewStory(value) });
    }

    useEffect(() => console.log("STATESET"));

    return (
        <>
            <button onClick={createModal}> OpenMyModal
            </ button >
            <ModalWindow isOpen={isOpen} arrayOfStoryOptions={arrayOfAvailableStories}>
                <div className="allDisplayStoriesContainer">
                    {arrayOfAvailableStories.map(availableStory =>
                        <StoryDisplayInModal key={availableStory.id} selectStory={selectStory} storyDict={availableStory} />
                    )}
                </div>
            </ModalWindow >
        </>
    )
}

function StoryDisplayInModal(props) {
    console.log(props.storyDict);
    let firstSection = props.storyDict.sectiontrace[0]
    let finalSection = props.storyDict.sectiontrace.slice(-1)[0]
    finalSection = (finalSection == firstSection) ? null : finalSection



    const selectStory = () => props.selectStory(finalSection.earliersectionid);

    return (
        <button onClick={selectStory} className="displayStoryContainer">
            <textarea value={firstSection.earliersectioncontent} readOnly />
            {(finalSection != null) ? <textarea value={finalSection.earliersectioncontent} readOnly /> : null}
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
                {props.children}
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
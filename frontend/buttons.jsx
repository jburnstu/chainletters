
import React, { useState } from "react";
import { createPortal } from 'react-dom';
export default { NewButton, JoinButton, SubmissionButton };


function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
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
        {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyDict)
        }
    )

    if ((method == "get" && response.status != 200) || !response.ok) {
        console.log("HTTP Error:", response.status);
        return {};
    }

    return response.json();
};

export function NewButton(props) {

    async function handleSubmit(e) {

        let storyCreationData = await contactAPI("stories/", "post",
            {
                'userid': props.userid
            }
        )

        let sectionCreationData = await contactAPI("sections/", "post",
            {
                'storyid': storyCreationData.id,
                'userid': props.userid,
                'sectionstatusid': 1,
            }
        )
    }

    return (
        <button onClick={handleSubmit}>NEW</button>
    )
}


export function JoinButton(props) {



    async function handleSubmit(e) {

        let availabilityData = await contactAPI(`usersincludingavailability/${props.userid}/`, "get")
        let availableSections = availabilityData.availablesections;
        let randomSectionID = getRandomItem(availableSections);
        let updatePreviousSectionData = await contactAPI(`sections/${randomSectionID}/`, "patch",
            {
                'sectionstatusid': 5
            }
        );

        let createSectionData = await contactAPI("sections/", "post",
            {
                'storyid': updatePreviousSectionData.storyid,
                'userid': props.userid,
                'sectionstatusid': 1,
                'previoussectionid': randomSectionID
            }
        );
    }

    return (
        <button onClick={handleSubmit}>JOIN</button>
    )
}

export function SubmissionButton(props) {


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
        let currentContent = props.currentContent;
        console.log(currentContent)
        let updateSectionStatusData = await contactAPI(`sections/${props.sectionid}/`, "patch",
            {
                'sectionstatusid': sectionstatusid,
                'content': currentContent
            }
        )

        console.log(updateSectionStatusData);
        if (props.submissionType == "ABANDON" && updateSectionStatusData.previoussectionid != null) {
            contactAPI(`sections/${updateSectionStatusData.previoussectionid}/`, "patch",
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


export function ModalButton() {
    const [isOpen, setIsOpen] = useState(false);

    async function handleSubmit(e) {
        setIsOpen(true);
    }

    return (
        <button onClick={handleSubmit}> OpenMyModal
            {
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
                            <button onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </div>,
                    document.body
                )
            }
        </ button >
    )
}
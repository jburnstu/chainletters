
import React, { useState } from "react";
import { createRoot } from 'react-dom/client';

export default { NewButton, JoinButton, SubmissionButton };

export function NewButton(props) {

    console.log(props.userid);

    async function handleSubmit(e) {
        let storyCreationResponse = await fetch('http://127.0.0.1:8000/api/stories/',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'userid': props.userid
                })
            }
        )

        if (!storyCreationResponse.ok) {
            console.log("HTTP Error:", storyCreationResponse.status);
            return;
        }

        let storyResponseData = await storyCreationResponse.json();

        console.log("STORY SUCCESS");
        console.log(storyResponseData);


        let sectionCreationResponse = await fetch('http://127.0.0.1:8000/api/sections/',
            {
                'method': 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'storyid': storyResponseData.id,
                    'userid': props.userid,
                    'sectionstatusid': 1,
                })
            }
        );

        if (!sectionCreationResponse.ok) {
            console.log("HTTP Error:", sectionCreationResponse.status);
            return;
        }

        let sectionResponseData = await sectionCreationResponse.json();

        console.log("SECTION SUCCESS");
        console.log(sectionResponseData);
    }

    return (
        <button onClick={handleSubmit}>NEW</button>
    )
}


export function JoinButton(props) {

    console.log(props.userid);

    async function handleSubmit(e) {
        let availabilityResponse = await fetch(`http://127.0.0.1:8000/api/usersincludingavailability/${props.userid}`,
            {
                method: 'get'
            }
        )

        if (availabilityResponse.status != 200) {
            console.log("HTTP Error:", availabilityResponse.status);
            return;
        }

        let availabilityData = await availabilityResponse.json();
        console.log("STORY SUCCESS");
        console.log(availabilityData);

        let availableSections = availabilityData.availablesections;
        console.log(availableSections);

        let randomSectionID = availableSections[Math.floor(Math.random() * availableSections.length)]
        console.log(randomSectionID);
        console.log(`http://127.0.0.1:8000/api/sections/${randomSectionID}`);

        let updatePreviousSectionResponse = await fetch(`http://127.0.0.1:8000/api/sections/${randomSectionID}/`,
            {
                'method': 'patch',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'sectionstatusid': 5
                })
            }
        );

        if (!updatePreviousSectionResponse.ok) {
            console.log("HTTP Error:", updatePreviousSectionResponse.status);
            return;
        }
        let updatePreviousSectionData = await updatePreviousSectionResponse.json();
        console.log("UPDATE PREVIOUS SECTION SUCCESS");
        console.log(updatePreviousSectionData);

        let sectionCreationResponse = await fetch('http://127.0.0.1:8000/api/sections/',
            {
                'method': 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'storyid': updatePreviousSectionData.storyid,
                    'userid': props.userid,
                    'sectionstatusid': 1,
                    'previoussectionid': randomSectionID
                })
            }
        );

        if (!sectionCreationResponse.ok) {
            console.log("HTTP Error:", sectionCreationResponse.status);
            return;
        }

        let sectionResponseData = await sectionCreationResponse.json();

        console.log("SECTION SUCCESS");
        console.log(sectionResponseData);

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
        let updateSectionResponse = await fetch(`http://127.0.0.1:8000/api/sections/${props.sectionid}/`,
            {
                'method': 'patch',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'sectionstatusid': sectionstatusid,
                    'content': currentContent
                })
            }
        );

        if (!updateSectionResponse.ok) {
            console.log("HTTP Error:", updateSectionResponse.status);
            return;
        }
        let updateSectionData = await updateSectionResponse.json();
        console.log("UPDATE PREVIOUS SECTION SUCCESS");
        console.log(updateSectionData);
    }


    return (
        <button onClick={handleSubmit}>{props.submissionType}</button>
    )
}
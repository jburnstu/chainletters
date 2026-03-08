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
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
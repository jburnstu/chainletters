


export function AuthorProfile(props) {
    let readOrWrite = props.readOrWrite;
    const { storyID } = useParams();
    const [wordCount, setWordCount] = useState(0);
    const [currentContentByStory, setCurrentContentByStory] = useOutletContext();


    let storyDict = getArrayObjByID(props.dicts, storyID);
    let presavedCurrentContent = storyDict.segment_trace.slice(-1)[0]["earlier_segment_content"];
    let currentContent = currentContentByStory[storyID];

    let noSelections = {};
    storyDict.segment_trace.forEach(dictInArray =>
        noSelections[dictInArray["earlier_segment_id"]] = false)
    const [selectedSegmentDict, setSelectedSegmentDict] = useState(noSelections);

    // console.log(storyDict);

    function changeSegmentSelection(segmentID) {
        setSelectedSegmentDict({ ...selectedSegmentDict, [segmentID]: !selectedSegmentDict[segmentID] })
    }

    function handleChange(e) {
        setCurrentContentByStory({ ...currentContentByStory, [storyID]: e.target.value });
        setWordCount(getWordCount(currentContent));
    }

    function getWordCount(myText) {
        // const spaceMatchPattern = /[\w\d][\s\W*\d*]+[\w\d]/;
        const spaceMatchPattern = /\S+/g;
        let numberOfSpaces = myText.match(spaceMatchPattern);
        return (numberOfSpaces ? numberOfSpaces : []).length;
    }

    const removeCurrentStory = (storyDict) => props.setDicts(storyDict, readOrWrite, "remove");


    return (
        <div className="storyContainer" id={"storyContainer" + { storyID }}>
            <StoryHeader storyDict={storyDict} wordCount={wordCount} />
            <div className="storyContent">
                {storyDict.segment_trace.map(segmentDict =>
                    <SegmentDisplay key={segmentDict.earlier_segment_id}
                        id={segmentDict.earlier_segment_id}
                        isFinalSegment={segmentDict.earlier_segment_id == storyID}
                        fixedContent={segmentDict.earlier_segment_content}
                        currentContent={currentContent}
                        changeSelection={changeSegmentSelection}
                        onChange={handleChange} />
                )
                }
            </div>
            <SubmissionButtons readOrWrite={readOrWrite} currentContent={currentContent} segmentID={storyID} removeCurrentStory={removeCurrentStory} />
            <Comments selections={selectedSegmentDict} storyDict={storyDict} />
        </div>
    )
}
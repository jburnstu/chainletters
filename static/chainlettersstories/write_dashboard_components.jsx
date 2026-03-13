
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';


function AppByAuthor(author_id, display_name, writeDicts, readDicts) {

    console.log(writeDicts);

    return (

        <BrowserRouter>
            {/* Navigation */}
            <UniversalHeader author_id={author_id} display_name={display_name} />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/write_dashboard" element={<WriteDashboard writeDicts={writeDicts} />}>
                    <Route path="/:segmentid" element={<StoryInProgress />} />
                </Route>
                <Route path="/write_dashboard" element={<ReadDashboard readDicts={readDicts} />}>
                    <Route path="/:segmentid" element={<ReadStories />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


function UniversalHeader(props) {
    return (
        <header>
            <h1>CHAIN MATES</h1>
            <h1>Hi, {props.display_name}!</h1>
            <LinkButton author_id={props.author_id} link='chainlettersstories:dashboard' name="DASHBOARD" />
            <LinkButton author_id={props.author_id} link='chainlettersstories:write_dashboard' name="WRITE" />
            <LinkButton author_id={props.author_id} link='chainlettersstories:read_dashboard' name="READ" />
            <LinkButton author_id={props.author_id} link='chainlettersstories:login_or_signup_page' name="LOG OUT" />
        </header >
    )
}

function Dashboard(props) { }

function WriteDashboard(writeDicts) {



    return (
        <div className="write-dashboard-container">
            {/* <UniversalHeader author_id={props.author_id} display_name={props.display_name} /> */}
            <WriteSidebar />
            <Tabs />
            <Outlet />
        </div>
    )
}

function ReadDashboard(props) { }

function StorySoFarSplitOut() {

    storySoFar = [{ "segmentid": 12, "content": "First Segment" },
    { "segmentid": 13, "content": "Second Segment" },
    { "segmentid": 1, "content": "Third Segment" },
    { "segmentid": 9, "content": "Fourth Segment" }
    ] // list holding all the story segments, of format {"segmentid":segmentid, "content":content}

    return storySoFar.map(storySegment =>
        <textarea key={storySegment.segmentid}>{storySegment.content}</ textarea>
    )


}

function LinkButton(props) {
    return (
        <form action="{props.link} {props.author_id}">
            <button type="submit">{props.name}</button>
        </form>
    )
}

function GetButton(props) {
    return (
        <form action="{props.link} {props.author_id}">
            <button type="submit">{props.name}</button>
        </form>
    )
}


function WriteSidebar() {
    return (
        <div class="sidebar">
            <GetButton author_id={props.author_id} link='chainlettersstories:create_new_story' name="NEW" />
            <GetButton author_id={props.author_id} link='chainlettersstories:get_random_available_segment' name="JOIN" />
        </div>
    )
}

function Tabs(props) {

    return (
        <>
            {props.stories.map(story =>
                <button class="story-tab-button"
                    id="story-tab-button-{{forloop.counter}}">{{}}</button>
            )}
        </>
    )
}

function StoryContent(props) {

}



function StoryInProgress(props) {

    return (
        <div className="story-in-progress-container"> key=""
            <StoryContent />
            <SubmitButtons />
            <Comments />
        </div>
    )
}





const READ_DICTS = JSON.parse(document.getElementById('read-dicts').textContent);
const WRITE_DICTS = JSON.parse(document.getElementById('write-dicts').textContent);
const AUTHOR_ID = JSON.parse(document.getElementById('author').textContent);
const DISPLAY_NAME = JSON.parse(document.getElementById('display_name').textContent);
createRoot(document.getElementById('myappcontainer')).render(
    <AppByAuthor author_id={AUTHOR_ID} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} display_name={DISPLAY_NAME} />
);



// <div class="container">
//     <header>
//         <h1>CHAIN MATES</h1>
//         <h1>Hi, {{ display_name }}!</h1>
//         <form action="{% url 'chainlettersstories:dashboard' author_id %}">
//             <button type="submit">DASHBOARD</button>
//         </form>
//         <form action="{% url 'chainlettersstories:write_dashboard' author_id %}">
//             <button type="submit">WRITE</button>
//         </form>
//         <form action="{% url 'chainlettersstories:read_dashboard' author_id %}">
//             <button type="submit">READ</button>
//         </form>
//         <form action="{% url 'chainlettersstories:login_or_signup_page'%}">
//             <button type="submit">LOG OUT</button>
//         </form>
//     </header>

//     <div class="sidebar">
//         <form action="{% url 'chainlettersstories:create_new_story' author_id %}">
//             <button type="submit">New</button>
//         </form>
//         <form action="{% url 'chainlettersstories:get_random_available_segment' author_id %}">
//             <button type="submit">Join</button>
//         </form>
//     </div>

//     <div class="tabs">
//         {% for story_dict in story_dicts %}
//         <button class="story-tab-button"
//             id="story-tab-button-{{forloop.counter}}">{{ forloop.counter }}</button>
//         {% endfor %}
//     </div>

//     {% for segmentid, story_dict in story_dicts.items %}
//     <div class="content-submissions-comments"
//         id="content-submissions-comments-{{forloop.counter}}">
//         <form class="content-submissions"
//             id="content-submissions-{{forloop.counter}}"
//             action="{% url 'chainlettersstories:submit_segment_to_story' author_id segmentid %}" method="post">
//             {% csrf_token %}
//             <input class="read-only-content"
//                 id="read-only-content-{{forloop.counter}}"
//                 type="text"
//                 value="{{story_dict.previous}}"
//                 readonly>
//                 <div id="react-read-only-content"></div>
//                 {% vite_asset 'assets/write_dashboard_components.jsx' %}
//                 <input class="input-content"
//                     id="input-content-{{forloop.counter}}"
//                     type="text"
//                     placeholder="Enter Story Here"
//                     name="content"
//                     value="{{story_dict.current}}">
//                     <div class="submissions">
//                         <button type="submit" name="save-or-submit" value="save">Save</button>
//                         <button type="submit" name="save-or-submit" value="submit">Submit</button>
//                         <button type="submit" name="save-or-submit" value="abandon">Abandon</button>
//                     </div>
//                 </form>
//                 <div class="comments">Hello</div>
//             </div>
//             {% endfor %}
//     </div>
// </div>
// </body >

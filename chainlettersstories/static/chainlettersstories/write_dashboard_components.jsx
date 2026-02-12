
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';


function AppByUser(userid, displayname, writeDicts, readDicts) {

    console.log(writeDicts);

    return (

        <BrowserRouter>
            {/* Navigation */}
            <UniversalHeader userid={userid} displayname={displayname} />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/write_dashboard" element={<WriteDashboard writeDicts={writeDicts} />}>
                    <Route path="/:sectionid" element={<StoryInProgress />} />
                </Route>
                <Route path="/write_dashboard" element={<ReadDashboard readDicts={readDicts} />}>
                    <Route path="/:sectionid" element={<ReadStories />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


function UniversalHeader(props) {
    return (
        <header>
            <h1>CHAIN MATES</h1>
            <h1>Hi, {props.displayname}!</h1>
            <LinkButton userid={props.userid} link='chainlettersstories:dashboard' name="DASHBOARD" />
            <LinkButton userid={props.userid} link='chainlettersstories:write_dashboard' name="WRITE" />
            <LinkButton userid={props.userid} link='chainlettersstories:read_dashboard' name="READ" />
            <LinkButton userid={props.userid} link='chainlettersstories:login_or_signup_page' name="LOG OUT" />
        </header >
    )
}

function Dashboard(props) { }

function WriteDashboard(writeDicts) {



    return (
        <div className="write-dashboard-container">
            {/* <UniversalHeader userid={props.userid} displayname={props.displayname} /> */}
            <WriteSidebar />
            <Tabs />
            <Outlet />
        </div>
    )
}

function ReadDashboard(props) { }

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

function LinkButton(props) {
    return (
        <form action="{props.link} {props.userid}">
            <button type="submit">{props.name}</button>
        </form>
    )
}

function GetButton(props) {
    return (
        <form action="{props.link} {props.userid}">
            <button type="submit">{props.name}</button>
        </form>
    )
}


function WriteSidebar() {
    return (
        <div class="sidebar">
            <GetButton userid={props.userid} link='chainlettersstories:create_new_story' name="NEW" />
            <GetButton userid={props.userid} link='chainlettersstories:get_random_available_section' name="JOIN" />
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
const USERID = JSON.parse(document.getElementById('user').textContent);
const DISPLAYNAME = JSON.parse(document.getElementById('displayname').textContent);
createRoot(document.getElementById('myappcontainer')).render(
    <AppByUser userid={USERID} readDicts={READ_DICTS} writeDicts={WRITE_DICTS} displayname={DISPLAYNAME} />
);



// <div class="container">
//     <header>
//         <h1>CHAIN MATES</h1>
//         <h1>Hi, {{ displayname }}!</h1>
//         <form action="{% url 'chainlettersstories:dashboard' userid %}">
//             <button type="submit">DASHBOARD</button>
//         </form>
//         <form action="{% url 'chainlettersstories:write_dashboard' userid %}">
//             <button type="submit">WRITE</button>
//         </form>
//         <form action="{% url 'chainlettersstories:read_dashboard' userid %}">
//             <button type="submit">READ</button>
//         </form>
//         <form action="{% url 'chainlettersstories:login_or_signup_page'%}">
//             <button type="submit">LOG OUT</button>
//         </form>
//     </header>

//     <div class="sidebar">
//         <form action="{% url 'chainlettersstories:create_new_story' userid %}">
//             <button type="submit">New</button>
//         </form>
//         <form action="{% url 'chainlettersstories:get_random_available_section' userid %}">
//             <button type="submit">Join</button>
//         </form>
//     </div>

//     <div class="tabs">
//         {% for story_dict in story_dicts %}
//         <button class="story-tab-button"
//             id="story-tab-button-{{forloop.counter}}">{{ forloop.counter }}</button>
//         {% endfor %}
//     </div>

//     {% for sectionid, story_dict in story_dicts.items %}
//     <div class="content-submissions-comments"
//         id="content-submissions-comments-{{forloop.counter}}">
//         <form class="content-submissions"
//             id="content-submissions-{{forloop.counter}}"
//             action="{% url 'chainlettersstories:submit_section_to_story' userid sectionid %}" method="post">
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

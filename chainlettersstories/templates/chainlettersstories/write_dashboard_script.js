var stories;
var story_excluding_last_section;
var last_section;
var storyButtonHTML;
var storyTabHTML;

window.addEventListener('load', onPageLoaded, false);


function onPageLoaded() {
    const storiesHeaderPanel = document.querySelector(".stories-header-panel");
    const storiesMainPanel = document.querySelector(".stories-main-panel");
    if (story_list) {
        createStoryTabsAndButtons(story_list);
    }
    console.log("page loaded");
}


const createStoryTabsAndButtons = function (stories) {
    storiesHeaderPanel.innerHTML = '';
    storiesMainPanel.innerHTML = '';

    stories.forEach(function (story, i) {

        story_excluding_last_section = story[1].slice(0, -1).join(" ");
        last_section = story[1].slice(-1);


        storyButtonHTML = `
        <button class="story-tab-button" id="story-tab-button-${i}">${i}</button>
        `;

        storyTabHTML = `
        <div class="container-story-tab" id = "container-story-tab-${i}">
            <div class="read-only-div" id="read-only-div-${i}">${story_excluding_last_section}.</div> 
            <form action="{% url "chainlettersstories:submit_story_to_section"  %}" method="post"> 
                <fieldset>
                    <input class=section-input id="section-input-${i}" type="text" placeholder=${last_section == "" ? "Enter Story Here." : last_section} name="content"> 
                </fieldset>
                <input type="submit" value="Submit">
            </form>
        </div>
        `;


        storiesHeaderPanel.insertAdjacentHTML('afterbegin', storyButtonHTML);
        storiesMainPanel.insertAdjacentHTML('afterbegin', storyTabHTML);
    });

}
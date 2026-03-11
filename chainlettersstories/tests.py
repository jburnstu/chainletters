from django.test import TestCase
import random
import string
from .models import Story, StoriesUser, Section, ModerationAssignment, AvailableSectionByUser, ModeratableSectionByUser

"""
import random
import string
from chainlettersstories.models import Story, StoriesUser, Section, ModerationAssignment, AvailableSectionByUser, ModeratableSectionByUser
from chainlettersstories.tests import create_random_section_tree
"""

# Create your tests here.
'''
Checks on status:
- if a 1,2 or 3, assert previous are 5, and assert not previousid of anything
- if in moderationassignment and not closed, assert 3
- if no 1, 2, or 3 following, assert not 5

'''

'''
Checks on login details:
- assert an existing username will prompt login
- assert an existing login will login
- assert an empty username / password will prompt a message

'''

### UTILITY FUNCTIONS ###

def create_random_string_of_length(string_length,up_to_this_length=False,lowest_length_allowed=1):
    if up_to_this_length:
        string_length = random.randint(lowest_length_allowed,string_length)
    return "".join(random.choices(string.ascii_letters,k=string_length))

def create_random_user_array(array_length,name_length):
    array_of_user_ids = []
    for i in range(array_length):
        rng_name = create_random_string_of_length(name_length)
        new_user = create_user(rng_name)
        array_of_user_ids.append(new_user) 
    return array_of_user_ids

def create_user(username):
    email = username + "@exmaple.com"
    return StoriesUser.objects.create(displayname=username,email=email,password=username)

'''
def create_array_of_previous_section_ids(number_of_sections):
    array_of_previous_section_ids = []
    for i in range(number_of_sections):
        random_earlier_id = random.randint(1,i+1)
        if (random_earlier_id == i+1):
            random_earlier_id = None
        array_of_previous_section_ids.append(random_earlier_id)
    print(array_of_previous_section_ids)

    
    return array_of_previous_section_ids

def check_section_available_to_user(user,previoussection):
    print("entered availablecheck",type(user),previoussection)
    if previoussection is not None:
        print("ID",previoussection.id)
        query = AvailableSectionByUser.objects.all().query
        print(query)
        try:
            print("INTO TRY BRANCH")
            AvailableSectionByUser.objects.filter(userid=user)\
                                        .get(sectionid=previoussection.id)
        except AvailableSectionByUser.DoesNotExist:
            print("ERROR IN AVAILABLE")
            raise KeyError
    else: 
        print("previoussection is None",previoussection)
        return None

def check_section_moderatable_to_user(user,previoussection):
    if previoussection is not None:
        print("past if not none")
        try:
            Section.objects.filter(sectionstatusid_id=2)\
                        .exclude(userid=user)\
                        .get(pk=previoussection.id)
        except Section.DoesNotExist:
            print("ERROR IN MODERATABLE")
            raise KeyError
    else: 
        return None   


### BASIC EXPERIENCE FLOW ###


def get_previous_section_if_exists(previoussectionid):
    print("prevID",previoussectionid)
    if previoussectionid is not None:
        try:
            previoussection = Section.objects.get(pk=previoussectionid)
        except Section.DoesNotExist:
            print("exception in prev check")
            previoussection = None
    else:
        previoussection = None
    print("leaving prev check",type(previoussection),previoussection)
    return previoussection

def add_section_to_story_by_user(user,previoussection=None,valid_check=None):
    if valid_check is not None:
        check_section_available_to_user(user,previoussection)

    if previoussection is None:
        newstory = Story.objects.create(userid=user)
        newsection = Section.objects.create(storyid=newstory,userid=user,previoussectionid=None,sectionstatusid_id=1)
    else:
        newsection = Section.objects.create(storyid=previoussection.storyid,userid=user,previoussectionid=previoussection,sectionstatusid_id=1)
        previoussection.sectionstatusid_id = 5
        previoussection.save()
    return newsection
    
def assign_a_moderator(section,user,valid_check=None):
    if valid_check is not None:
        check_section_moderatable_to_user(user,section)

    section.sectionstatusid_id = 3
    section.save()
    return ModerationAssignment.objects.create(sectionid=section,userid=user)

def approve_moderation(section):
    section.sectionstatusid_id = 4
    section.save()
    if section.previoussectionid:
        section.previoussectionid.sectionstatusid_id = 4
        section.previoussectionid.save()
    moderationassignment = ModerationAssignment.objects.get(sectionid=section,isitclosed=False)
    moderationassignment.isitclosed = True
    moderationassignment.save()

'''

### UPDATED FLOW

def create_new_story_and_section(user):
        newstory = Story.objects.create(userid=user)
        newsection = Section.objects.create(storyid=newstory,userid=user,previoussectionid=None,sectionstatusid_id=1)
        return {"story":newstory,"section":newsection}

def join_to_random_open_section(user):
    try:
        possible_existing_sections = AvailableSectionByUser.objects.filter(userid=user)
        random_existing_section = random.choice(list(possible_existing_sections))
        new_section = Section.objects.create(storyid=random_existing_section.storyid,userid=user,previoussectionid=random_existing_section,sectionstatusid_id=1)
        random_existing_section.sectionstatusid_id = 5
        random_existing_section.save()
        return {"story":None, "section": new_section}
    except AvailableSectionByUser.DoesNotExist:
        story_and_section = create_new_story_and_section(user)
        return story_and_section

def update_section_content(section,content):
    section.content = content
    section.save()

def abandon_section(section,default_if_empty=True,):
    if default_if_empty and str(section.content) == "":
        section.content = "Default Empty Text"
    section.sectionstatusid_id = 6
    section.save()

def move_to_moderation(section):
    section.sectionstatusid_id = 2
    section.save()

def find_and_assign_moderator(section):
    try:
        possible_users = ModeratableSectionByUser.filter(sectionid=section.id)
        random_user = random.choice(list(possible_users))
        new_moderation_assignment = ModerationAssignment.objcets.create(userid=random_user,sectionid=section)
        section.sectionstatusid_id = 3
        section.save()
        return {"user_moderator":random_user,"assignment":new_moderation_assignment}
    except ModeratableSectionByUser.DoesNotExist:
        print("No moderators available")
        return {"user_moderator":None,"assignment":None}

def approve_moderation(section,moderation_assignment):
    section.section_statusid_id = 4
    section.save()
    if section.previoussectionid:
        section.previoussectionid.sectionstatusid_id = 4
        section.previoussectionid.save()
    moderation_assignment.isitclosed = True
    moderation_assignment.save()

### OVERALL FUNCTION ###
 
'''
def create_submit_and_approve_section(content,
                                      user_creator,
                                      user_moderator,
                                      previoussectionid=None,
                                      ):
    try:
        previoussection = get_previous_section_if_exists(previoussectionid)
        section = add_section_to_story_by_user(user_creator,previoussection=previoussection,valid_check=previoussectionid)
        update_section_content(section,content)
        move_to_moderation(section)
        assign_a_moderator(section,user_moderator,valid_check=previoussectionid)
        approve_moderation(section)
    except KeyError:
        section = create_submit_and_approve_section(content,user_creator,user_moderator,None)
    return section

def create_section_from_dict(dict,offset=0):
    section = create_submit_and_approve_section(dict["content"],
                                                dict["user_creator"],
                                                dict["user_moderator"],
                                                dict["previoussectionid"] if dict["previoussectionid"] is None else dict["previoussectionid"]+offset,
                                                
    )
    return section
'''

def new_create_submit_and_approve_section(user,content):    
    print(1)
    section = join_to_random_open_section(user)["section"]
    print(2)
    update_section_content(section,content)
    print(3)
    move_to_moderation(section)
    print(4)
    user_and_assignment = find_and_assign_moderator(section)
    print(5)
    approve_moderation(section,user_and_assignment["assignment"])
    print(6)
    return section

def new_create_section_from_dict(dict):
    new_create_submit_and_approve_section(dict["user_creator"],dict["content"])

def create_random_section_tree(number_of_users,number_of_sections, section_char_length=200):
    user_array = create_random_user_array(number_of_users,10)

    # array_of_previous_section_ids = create_array_of_previous_section_ids(number_of_sections)

    list_of_section_dicts = [{
        "content" : create_random_string_of_length(section_char_length,up_to_this_length=True),
        "user_creator" : random.choice(user_array),
        # "user_moderator" : random.choice(user_array),
        # "previoussectionid" : array_of_previous_section_ids[i]
        } for i in range(number_of_sections)]

    count = 0
    for dict in list_of_section_dicts: 
        count += 1
        print(count,dict)
        section = new_create_section_from_dict(dict)
            
        print("Compare to count / ", count,  section.id)

"""
previous section id: 
between 1 and i

"""












class SectionContentTests(TestCase):
    def test_not_empty(self):
        pass

    def test_not_equivalent(self):
        pass

    def test_formatting_preserved(self):
        pass

    def test_length_preserved(self):
        pass

class WriteDashboardDisplayTests(TestCase):
    def test_no_stories(self):
        pass

    def test_no_stories_to_join(self):
        pass

    def test_multiple_stories(self):
        pass

    def test_submitted_story_leaves_page(self):
        pass

    def test_saved_story_still_present(self):
        pass

class ReadDashboardDisplayTests(TestCase):
    def test_no_stories(self):
        pass

    def test_no_stories_to_moderate(self):
        pass

    def test_moderatable_story_will_be_accessed(self):
        pass



# class QuestionIndexViewTests(TestCase):
#     def test_no_questions(self):
#         """
#         If no questions exist, an appropriate message is displayed.
#         """
#         response = self.client.get(reverse("polls:index"))
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "No polls are available.")
#         self.assertQuerySetEqual(response.context["latest_question_list"], [])

#     def test_past_question(self):
#         """
#         Questions with a pub_date in the past are displayed on the
#         index page.
#         """
#         question = create_question(question_text="Past question.", days=-30)
#         response = self.client.get(reverse("polls:index"))
#         self.assertQuerySetEqual(
#             response.context["latest_question_list"],
#             [question],
#         )

#     def test_future_question(self):
#         """
#         Questions with a pub_date in the future aren't displayed on
#         the index page.
#         """
#         create_question(question_text="Future question.", days=30)
#         response = self.client.get(reverse("polls:index"))
#         self.assertContains(response, "No polls are available.")
#         self.assertQuerySetEqual(response.context["latest_question_list"], [])

#     def test_future_question_and_past_question(self):
#         """
#         Even if both past and future questions exist, only past questions
#         are displayed.
#         """
#         question = create_question(question_text="Past question.", days=-30)
#         create_question(question_text="Future question.", days=30)
#         response = self.client.get(reverse("polls:index"))
#         self.assertQuerySetEqual(
#             response.context["latest_question_list"],
#             [question],
#         )

#     def test_two_past_questions(self):
#         """
#         The questions index page may display multiple questions.
#         """
#         question1 = create_question(question_text="Past question 1.", days=-30)
#         question2 = create_question(question_text="Past question 2.", days=-5)
#         response = self.client.get(reverse("polls:index"))
#         self.assertQuerySetEqual(
#             response.context["latest_question_list"],
#             [question2, question1],
#         )
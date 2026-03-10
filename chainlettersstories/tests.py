from django.test import TestCase
import random
import string
from .models import Story, StoriesUser, Section, ModerationAssignment, AvailableSectionByUser


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

def check_section_available_to_user(user,previoussection):
    if previoussection:
        try:
            AvailableSectionByUser.objects.get(userid=user,sectionid=previoussection)
        except AvailableSectionByUser.DoesNotExist:
            raise KeyError
    else: 
        return

def check_section_moderatable_to_user(user,previoussection):
    if previoussection:
        try:
            Section.objects.filter(sectionstatusid_id=2)\
                        .exclude(userid=user)\
                        .get(pk=previoussection)
        except Section.DoesNotExist:
            raise KeyError
    else: 
        return
    
def check_previous_section_exists(previoussection, by_id=False):
    if previoussection and by_id:
        try:
            previoussection = Section.objects.get(pk=previoussection)
        except Section.DoesNotExist:
            previoussection = None
    return previoussection
    


### BASIC EXPERIENCE FLOW ###

def create_user(username):
    email = username + "@exmaple.com"
    return StoriesUser.objects.create(displayname=username,email=email,password=username)

def add_section_to_story_by_user(user,previoussection=None,by_id=False,valid_check=False):
    if by_id:
        user = StoriesUser.objects.get(pk=user)
        if previoussection:
            print(previoussection)
            previoussection = Section.objects.get(pk=previoussection)

    if valid_check:
        check_section_available_to_user(user,previoussection)

    if previoussection is None:
        newstory = Story.objects.create(userid=user)
        newsection = Section.objects.create(storyid=newstory,userid=user,previoussectionid=None,sectionstatusid_id=1)
    else:
        newsection = Section.objects.create(storyid=previoussection.storyid,userid=user,previoussectionid=previoussection,sectionstatusid_id=1)
        previoussection.sectionstatusid_id = 5
        previoussection.save()
    return newsection

def update_section_content(section,content,by_id=False):
    if by_id:
        section = Section.objects.get(pk=section)

    section.content = content
    section.save()

def abandon_section(section,default_if_empty=True,by_id=False):
    if by_id:
        section = Section.objects.get(pk=section)

    if default_if_empty and str(section.content) == "":
        section.content = "Default Empty Text"
    section.sectionstatusid_id = 6
    section.save()

def move_to_moderation(section,by_id=False):
    if by_id:
        section = Section.objects.get(pk=section)

    section.sectionstatusid_id = 2
    section.save()
    
def assign_a_moderator(section,user,by_id=False,valid_check=False):
    if by_id:
        section = Section.objects.get(pk=section)
        user = StoriesUser.objects.get(pk=user)
    
    if valid_check:
        check_section_moderatable_to_user(user,section)

    section.sectionstatusid_id = 3
    section.save()
    return ModerationAssignment.objects.create(section,user)

def approve_moderation(section,by_id=False):
    if by_id:
        section = Section.objects.get(sectionid_id=section)
    
    section.sectionstatusid_id = 4
    section.save()
    if section.previoussectionid:
        section.previoussectionid.sectionstatusid_id = 4
        section.previoussectionid.save()
    moderationassignment = ModerationAssignment.objects.get(sectionid=section,isitclosed=False)
    moderationassignment.isitclosed = True
    moderationassignment.save()

### OVERALL FUNCTION ###

def create_submit_and_approve_section(content,
                                      user_creator,
                                      user_moderator,
                                      previoussection=None,
                                      by_id=False):
    try:
        previoussection = check_previous_section_exists(previoussection,by_id=by_id)
        section = add_section_to_story_by_user(user_creator,previoussection=previoussection,by_id=by_id,valid_check=True)
        update_section_content(section,content,by_id=by_id)
        move_to_moderation(section,by_id=by_id)
        assign_a_moderator(section,user_moderator,by_id=by_id,valid_check=True)
        approve_moderation(section,by_id=by_id)
    except KeyError:
        return None
    return section


def create_section_from_dict(dict):
    section = create_submit_and_approve_section(dict["content"],
                                                dict["user_creator"],
                                                dict["user_moderator"],
                                                dict["previoussection"],
                                                by_id=True
    )
    return section


def create_random_section_tree(number_of_users,number_of_sections, section_char_length=200):
    username_length = 10
    array_of_user_ids = []
    for i in range(number_of_users):
        print(i)
        rng_name = create_random_string_of_length(username_length)
        new_user = create_user(rng_name)
        array_of_user_ids.append(new_user.id)

    array_of_previous_section_ids = []
    for i in range(number_of_sections):
        random_earlier_id = random.randint(1,i+1)
        if random_earlier_id == i:
            random_earlier_id = None
        array_of_previous_section_ids.append(random_earlier_id)

    list_of_section_dicts = [{
        "content" : create_random_string_of_length(section_char_length,up_to_this_length=True),
        "user_creator" : random.choice(array_of_user_ids),
        "user_moderator" : random.choice(array_of_user_ids),
        "previoussection" : array_of_previous_section_ids[i]
        } for i in range(number_of_sections)]

    print(list_of_section_dicts)
    for dict in list_of_section_dicts: 
        create_section_from_dict(dict)


# if __name__ == '__main__':
#     create_random_section_tree

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
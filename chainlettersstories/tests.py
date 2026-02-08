from django.test import TestCase

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
import random
import string
from .models import Story, StoriesUser, Section, ModerationAssignment

def create_user(username,password):
    email = username + "@exmaple.com"
    return StoriesUser.objects.create(displayname=username,email=email,password=password)


def add_section_to_story_by_user(user,previoussection=None):
    if previoussection is None:
        newstory = Story.objects.create(userid=user)
        newsection = Section.objects.create(storyid=newstory,userid=user,previoussectionid=None)
    else:
        newsection = Section.objects.create(storyid=previoussection.storyid,userid=user,previoussectionid=previoussection)
        previoussection.sectionstatusid_id = 5
        previoussection.save()
    return newsection

def update_section_content(section,content):
    section.content = content
    section.save()

def move_to_moderation(section):
    section.sectionstatusid_id = 2
    section.save()
    

def assign_a_moderator(section,user):
    section.sectionstatusid_id = 3
    section.save()
    return ModerationAssignment.objects.create(section,user)

def approve_moderation(section):
    section.sectionstatusid_id = 4
    section.save()
    if section.previoussectionid is not None:
        section.previoussectionid.sectionstatusid_id = 4
        section.previoussectionid.save()
    moderationassignment = ModerationAssignment.objects.get(sectionid=section,isitclosed=False)
    moderationassignment.isitclosed = True
    moderationassignment.save()

def create_submit_and_approve_section(user_creator,content,user_moderator,previoussection=None):
    section = add_section_to_story_by_user(user_creator,previoussectionid=previoussection)
    update_section_content(section,content)
    move_to_moderation(section)
    assign_a_moderator(section,user_moderator)
    approve_moderation(section)
    return section



class QuestionIndexViewTests(TestCase):
    def test_no_questions(self):
        """
        If no questions exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse("polls:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No polls are available.")
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_past_question(self):
        """
        Questions with a pub_date in the past are displayed on the
        index page.
        """
        question = create_question(question_text="Past question.", days=-30)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question],
        )

    def test_future_question(self):
        """
        Questions with a pub_date in the future aren't displayed on
        the index page.
        """
        create_question(question_text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "No polls are available.")
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_future_question_and_past_question(self):
        """
        Even if both past and future questions exist, only past questions
        are displayed.
        """
        question = create_question(question_text="Past question.", days=-30)
        create_question(question_text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question],
        )

    def test_two_past_questions(self):
        """
        The questions index page may display multiple questions.
        """
        question1 = create_question(question_text="Past question 1.", days=-30)
        question2 = create_question(question_text="Past question 2.", days=-5)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question2, question1],
        )
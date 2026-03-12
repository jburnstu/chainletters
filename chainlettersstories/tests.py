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
- assert an existing authorname will prompt login
- assert an existing login will login
- assert an empty authorname / password will prompt a message

'''
import random
import string
from .models import Story, Author, Segment, ModerationAssignment

def create_author(authorname,password):
    email = authorname + "@exmaple.com"
    return Author.objects.create(display_name=authorname,email=email,password=password)


def add_segment_to_story_by_author(author,previous_segment=None):
    if previous_segment is None:
        newstory = Story.objects.create(author=author)
        newsegment = Segment.objects.create(story=newstory,author=author,previous_segment=None)
    else:
        newsegment = Segment.objects.create(story=previous_segment.story,author=author,previous_segment=previous_segment)
        previous_segment.segment_status_id = 5
        previous_segment.save()
    return newsegment

def update_segment_content(segment,content):
    segment.content = content
    segment.save()

def move_to_moderation(segment):
    segment.segment_status_id = 2
    segment.save()
    

def assign_a_moderator(segment,author):
    segment.segment_status_id = 3
    segment.save()
    return ModerationAssignment.objects.create(segment,author)

def approve_moderation(segment):
    segment.segment_status_id = 4
    segment.save()
    if segment.previous_segment is not None:
        segment.previous_segment.segment_status_id = 4
        segment.previous_segment.save()
    moderationassignment = ModerationAssignment.objects.get(segment=segment,is_it_closed=False)
    moderationassignment.is_it_closed = True
    moderationassignment.save()

def create_submit_and_approve_segment(author_creator,content,author_moderator,previous_segment=None):
    segment = add_segment_to_story_by_author(author_creator,previous_segment=previous_segment)
    update_segment_content(segment,content)
    move_to_moderation(segment)
    assign_a_moderator(segment,author_moderator)
    approve_moderation(segment)
    return segment

class SegmentContentTests(TestCase):
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

class LoginTests(self):



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
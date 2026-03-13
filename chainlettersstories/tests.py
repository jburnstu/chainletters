from django.test import TestCase
import random
import string
from .models import Story, Author, Segment, ModerationAssignment,\
AvailableSegmentByAuthor, ModeratableSegmentByAuthor

"""
import random
import string
from chainlettersstories.models import Story, Author, Segment, ModerationAssignment, AvailableSegmentByAuthor, ModeratableSegmentByAuthor
from chainlettersstories.tests import create_random_segment_tree
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
- assert an existing author_name will prompt login
- assert an existing login will login
- assert an empty author_name / password will prompt a message

'''

### UTILITY FUNCTIONS ###

def create_random_string_of_length(string_length,up_to_this_length=False,lowest_length_allowed=1):
    if up_to_this_length:
        string_length = random.randint(lowest_length_allowed,string_length)
    return "".join(random.choices(string.ascii_letters,k=string_length))

def create_random_author_array(array_length,name_length):
    array_of_author_ids = []
    for i in range(array_length):
        rng_name = create_random_string_of_length(name_length)
        new_author = create_author(rng_name)
        array_of_author_ids.append(new_author) 
    return array_of_author_ids

def create_author(author_name):
    email = author_name + "@example.com"
    return Author.objects.create(display_name=author_name,email=email,password=author_name)

### UPDATED FLOW

def create_new_story_and_segment(author):
        new_story = Story.objects.create(author=author)
        new_segment = Segment.objects.create(story=new_story,author=author,previous_segment=None,segment_status_id=1)
        return {"story":new_story,"segment":new_segment}

def join_to_random_open_segment(author):
    try:
        possible_existing_segments = AvailableSegmentByAuthor.objects.filter(author=author)
        if not possible_existing_segments:
            raise AvailableSegmentByAuthor.DoesNotExist
        random_existing_segment = Segment.objects.get(pk=\
                                    random.choice(list(possible_existing_segments)).segment_id)
        new_segment = Segment.objects.create(story=random_existing_segment.story,author=author,previous_segment=random_existing_segment,segment_status_id=1)
        random_existing_segment.segment_status_id = 5
        random_existing_segment.save()
        return {"story":None, "segment": new_segment}
    except AvailableSegmentByAuthor.DoesNotExist:
        story_and_segment = create_new_story_and_segment(author)
        return story_and_segment

def update_segment_content(segment,content):
    segment.content = content
    segment.save()

def abandon_segment(segment,default_if_empty=True,):
    if default_if_empty and str(segment.content) == "":
        segment.content = "Default Empty Text"
    segment.segment_status_id = 6
    segment.save()

def move_to_moderation(segment):
    segment.segment_status_id = 2
    segment.save()

def find_and_assign_moderator(segment):
    try:
        possible_authors = ModeratableSegmentByAuthor.objects.filter(segment_id=segment.id)
        random_author = random.choice(list(possible_authors)).author
        new_moderation_assignment = ModerationAssignment.objects.create(author=random_author,segment=segment)
        segment.segment_status_id = 3
        segment.save()
        return {"author_moderator":random_author,"assignment":new_moderation_assignment}
    except ModeratableSegmentByAuthor.DoesNotExist:
        print("No moderators available")
        return {"author_moderator":None,"assignment":None}

def approve_moderation(segment,moderation_assignment):
    segment.segment_status_id = 4
    segment.save()
    if segment.previous_segment:
        segment.previous_segment.segment_status_id = 4
        segment.previous_segment.save()
    print("MA pre update:",moderation_assignment.__dict__)
    moderation_assignment.isitclosed = True
    moderation_assignment.save()
    print("MA post update:",moderation_assignment.__dict__)

### OVERALL FUNCTION ###
 
'''
def create_submit_and_approve_segment(content,
                                      author_creator,
                                      author_moderator,
                                      previous_segment_id=None,
                                      ):
    try:
        previoussegment = get_previous_segment_if_exists(previous_segment_id)
        segment = add_segment_to_story_by_author(author_creator,previoussegment=previoussegment,valid_check=previous_segment_id)
        update_segment_content(segment,content)
        move_to_moderation(segment)
        assign_a_moderator(segment,author_moderator,valid_check=previous_segment_id)
        approve_moderation(segment)
    except KeyError:
        segment = create_submit_and_approve_segment(content,author_creator,author_moderator,None)
    return segment

def create_segment_from_dict(dict,offset=0):
    segment = create_submit_and_approve_segment(dict["content"],
                                                dict["author_creator"],
                                                dict["author_moderator"],
                                                dict["previous_segment_id"] if dict["previous_segment_id"] is None else dict["previous_segment_id"]+offset,
                                                
    )
    return segment
'''

def new_create_submit_and_approve_segment(author,content):    
    print(1)
    segment = join_to_random_open_segment(author)["segment"]
    print(2, " segment " + segment + " created")
    update_segment_content(segment,content)
    print(3, segment + "updated")
    move_to_moderation(segment)
    print(4)
    author_and_assignment = find_and_assign_moderator(segment)
    print(5)
    approve_moderation(segment,author_and_assignment["assignment"])
    print(6)
    print(segment.__dict__)
    return segment

def new_create_segment_from_dict(dict):
    new_create_submit_and_approve_segment(dict["author_creator"],dict["content"])

def create_random_segment_tree(number_of_authors,number_of_segments, segment_char_length=200):

    if number_of_authors is None:
        author_array = list(Author.objects.all())
    else:
        author_array = create_random_author_array(number_of_authors,10)

    print("AUTHOR ARRAY",author_array)
    # array_of_previous_segment_ids = create_array_of_previous_segment_ids(number_of_segments)

    list_of_segment_dicts = [{
        "author_creator" : random.choice(author_array),
        "content" : create_random_string_of_length(segment_char_length,up_to_this_length=True),
        } for i in range(number_of_segments)]


    print("LIST OF SEGMENT  DICTS",list_of_segment_dicts)
    count = 0
    for dict in list_of_segment_dicts: 
        count += 1
        print(count,dict)
        segment = new_create_segment_from_dict(dict)
        
        if segment:
            print("SEGMENT:",segment)
            print("Compare to count / ", count,  segment.id)
        else: print ("Compare to count / ",count, "None")

#########################################################################################












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




'''
def create_array_of_previous_segment_ids(number_of_segments):
    array_of_previous_segment_ids = []
    for i in range(number_of_segments):
        random_earlier_id = random.randint(1,i+1)
        if (random_earlier_id == i+1):
            random_earlier_id = None
        array_of_previous_segment_ids.append(random_earlier_id)
    print(array_of_previous_segment_ids)

    
    return array_of_previous_segment_ids

def check_segment_available_to_author(author,previoussegment):
    print("entered availablecheck",type(author),previoussegment)
    if previoussegment is not None:
        print("ID",previoussegment.id)
        query = AvailableSegmentByauthor.objects.all().query
        print(query)
        try:
            print("INTO TRY BRANCH")
            AvailableSegmentByauthor.objects.filter(author_id=author)\
                                        .get(segmentid=previoussegment.id)
        except AvailableSegmentByauthor.DoesNotExist:
            print("ERROR IN AVAILABLE")
            raise KeyError
    else: 
        print("previoussegment is None",previoussegment)
        return None

def check_segment_moderatable_to_author(author,previoussegment):
    if previoussegment is not None:
        print("past if not none")
        try:
            Segment.objects.filter(segment_status_id=2)\
                        .exclude(author_id=author)\
                        .get(pk=previoussegment.id)
        except Segment.DoesNotExist:
            print("ERROR IN MODERATABLE")
            raise KeyError
    else: 
        return None   


### BASIC EXPERIENCE FLOW ###


def get_previous_segment_if_exists(previous_segment_id):
    print("prevID",previous_segment_id)
    if previous_segment_id is not None:
        try:
            previoussegment = Segment.objects.get(pk=previous_segment_id)
        except Segment.DoesNotExist:
            print("exception in prev check")
            previoussegment = None
    else:
        previoussegment = None
    print("leaving prev check",type(previoussegment),previoussegment)
    return previoussegment

def add_segment_to_story_by_author(author,previoussegment=None,valid_check=None):
    if valid_check is not None:
        check_segment_available_to_author(author,previoussegment)

    if previoussegment is None:
        new_story = Story.objects.create(author_id=author)
        new_segment = Segment.objects.create(story_id=new_story,author_id=author,previous_segment_id=None,segment_status_id=1)
    else:
        new_segment = Segment.objects.create(story_id=previoussegment.story_id,author_id=author,previous_segment_id=previoussegment,segment_status_id=1)
        previoussegment.segment_status_id = 5
        previoussegment.save()
    return new_segment

    
def assign_a_moderator(segment,author,valid_check=None):
    if valid_check is not None:
        check_segment_moderatable_to_author(author,segment)

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
=======
    segment.segment_status_id = 3
    segment.save()
    return ModerationAssignment.objects.create(segmentid=segment,author_id=author)

def approve_moderation(segment):
    segment.segment_status_id = 4
    segment.save()
    if segment.previous_segment_id:
        segment.previous_segment_id.segment_status_id = 4
        segment.previous_segment_id.save()
    moderationassignment = ModerationAssignment.objects.get(segmentid=segment,isitclosed=False)
    moderationassignment.isitclosed = True
    moderationassignment.save()

'''

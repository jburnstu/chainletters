from rest_framework import viewsets
from django.db.models import F, Prefetch
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
import pandas as pd
import random


from .models import Story, Author, Segment, SegmentTrace, SegmentStatus, ModerationAssignment,\
 AvailableSegmentByAuthor, ModeratableSegmentByAuthor,\
 Comment,SegmentComment,StoryComment,CommentComment,CommentStatus,\
 AuthorRelation
from .serializers import StorySerializer, SegmentSerializer, AvailableSegmentByAuthorSerializer, AuthorIncludingAvailabilitySerializer, SegmentTraceBySegmentSerializer, ModerationAssignmentSerializer,  SegmentWithCommentsSerializer, FullStoryInfoSerializer, CompletedSegmentByAuthorSerializer, AuthorRelationSerializer, AuthorRelationByAuthorSerializer
# Create your views here.


def login_or_signup_page(request):
    template = "chainlettersstories/login_or_signup_page.html"
    return render(request,template,
                  {})


def login(request):
    template = "chainlettersstories/login_or_signup_page.html"
    try:
        login = request.POST["login-or-signup"]
        author_name_or_email = request.POST["author_name-or-email"]
        password = request.POST["password"]
        if "" in {author_name_or_email, password}:
            raise KeyError("neither field may be blank.")
    except KeyError as e:
        print(e)
        return render(request,template,{"message":"Please ensure both fields are filled in."})
    if bool(int(login)):
        print("login true")
        try:
            my_author = Author.objects.get(display_name=author_name_or_email,password=password)
            print(my_author.__dict__)
            author = my_author.id
        except Author.DoesNotExist:
            try:
                my_author = Author.objects.get(email=author_name_or_email,password=password)
            except Author.DoesNotExist:
                return render(request,
                            template,
                            {
                                "message":
                                "No account found matching this author_name / email and password. Please try again or sign up."
                            })
        return HttpResponseRedirect(reverse("chainlettersstories:home", args=(author,)))
    else:
        print("login false")
        try:
            my_author = Author.objects.get(display_name=author_name_or_email)
        except Author.DoesNotExist:
            new_author = Author(display_name=author_name_or_email,email=author_name_or_email+"@example.com",password=password)
            new_author.save()
            return render(request,template,{"message": "Login successfully added! Please now login."})
        return render (request,template,{"message":"Account already exists. Please log in instead."})


def get_story_dicts_from_QS(QS):
    if not QS:
        return []
    else:
        df = pd.DataFrame(QS)
        return [{"id":key,
                 "segment_trace":
                    [{"earlier_segment_id":id,
                    "earlier_segment_content":content,
                    "earlier_segment_author":model_to_dict(Segment.objects.get(pk=id).author,
                                           fields=["id","display_name"]),
                    "comments":get_all_comments_on_obj(Segment.objects.get(pk=id))
                    } for id,content in zip(
                        group["earlier_segment_id"],group["earlier_segment_content"])],
                  "story_data":model_to_dict(Segment.objects.get(pk=key).story)
                    # .update({"comments":get_all_comments_on_obj(Segment.objects.get(pk=key).story)})
                    }                              
                    for key, group in df.groupby("final_segment_id")
]

def get_all_comments_on_obj(obj,type="segment"):
    if type=="segment":
        comments_main_table_QS = Comment.objects.filter(segment_comment__parent_segment=obj)
    else:
        comments_main_table_QS = Comment.objects.filter(story_comment__parent_story=obj)

    comment_list = []
    for comment in comments_main_table_QS:
        comment_dict = model_to_dict(comment)
        # print(comment.author)
        comment_dict.update({"author": model_to_dict(comment.author,fields=["id","display_name"])})


        child_comment_list = []
        for child_comment in Comment.objects.filter(comment_comment__parent_comment=comment):
            child_comment_dict = model_to_dict(child_comment)
            child_comment_dict.update({"author": model_to_dict(comment.author,fields=["id","display_name"])})
            child_comment_list.append(child_comment_dict)
        
        comment_dict.update({"comments":child_comment_list})
        comment_list.append(comment_dict)
    # print(comment_list)
    return comment_list


def home(request,author_id,read_or_write=None,story_id=None):
    template = "chainlettersstories/dashboard.html"
    my_author = Author.objects.get(pk=author_id)
    my_author_name = my_author.display_name

    write_segment_trace_QS = SegmentTrace.objects.filter(final_author_id=author_id)\
                                .filter(final_segment_status_id=1)\
                                .values("earlier_segment_id","earlier_segment_content","final_segment_id")\
                                .order_by("earlier_segment_order")
    # print(write_segment_trace_QS)
    write_dicts = get_story_dicts_from_QS(write_segment_trace_QS)


    segment_ids_to_moderate = ModerationAssignment.objects\
                                                .filter(author=author_id)\
                                                .filter(is_it_closed=False)\
                                                .values_list("segment")

    if not segment_ids_to_moderate:
        read_dicts = []
    else:
        read_segment_trace_QS = SegmentTrace.objects.filter(final_segment_id__in = segment_ids_to_moderate)\
                                    .values("earlier_segment_id","earlier_segment_content","final_segment_id")\
                                    .order_by("earlier_segment_order")
        read_dicts = get_story_dicts_from_QS(read_segment_trace_QS)

    # print(read_dicts)
    starting_url_dict = {"read_or_write": read_or_write,
                         "story_id": story_id}
    print(starting_url_dict)

    return render(request,template, 
                  {
                      "author_id": author_id,
                      "display_name": my_author_name,
                      "read_dicts":read_dicts,
                      "write_dicts":write_dicts,
                      "starting_url_dict":starting_url_dict})


        
def home_write(request,author_id):
    print("going through home write")
    return HttpResponseRedirect(reverse("chainlettersstories:home", args=(author_id,"write")))

def home_read(request,author_id):
    return HttpResponseRedirect(reverse("chainlettersstories:home", args=(author_id,"read")))

def home_write_story(request,author_id,story_id):
    print("HOME WRITE STORY CALLED")
    test_for_valid_story = SegmentTrace.objects\
                            .filter(final_author_id=author_id)\
                            .filter(final_segment_status_id=1)\
                            .filter(final_segment_id=story_id)
    print(test_for_valid_story)
    if not test_for_valid_story:
        print("STORY NOT PRESENT")
        return HttpResponseRedirect(reverse("chainlettersstories:home_write", args=(author_id,"write")))
    return HttpResponseRedirect(reverse("chainlettersstories:home", args=(author_id,"write",story_id)))

def home_read_story(request,author_id,story_id):
    test_for_valid_story = ModerationAssignment.objects\
                            .filter(author=author_id)\
                            .filter(is_it_closed=False)\
                            .filter(segment_id=story_id)
    if not test_for_valid_story:
        return HttpResponseRedirect(reverse("chainlettersstories:home_read", args=(author_id,"read")))
    return HttpResponseRedirect(reverse("chainlettersstories:home", args=(author_id,"read",story_id)))



'''
Where to put the comment data?

write_dicts: 
[{"final_segment_id"::,
    "segment_trace":[{
                    "id"::, 
                    "content"::, 
                    "segment_info":{
                                    "author":{
                                            "id"::,
                                            "name":display_name}
                                            },
                                    "moderator":{
                                                "id"::,
                                                "name":display_name,
                                                "moderation_notes":notes
                                                 },
                                     },
                    "comments":[{
                                "commentID"::,
                                "author":{
                                        "id"::,
                                        "name":display_name}
                                        },
                                "content"::,
                                "child_comments":[{
                                                "commentID"::,
                                                "author":{
                                                        "id"::,
                                                        "name":display_name}
                                                        },
                                                "content"::,
                                                }]
                                }]
                    }],
    "story_data":{
                    "variousData"::,
                    "comments":},

    ]

    
What would a large, all-comment-info-for-a-given-segment dict look like?
{segmentID: 
        {authorID::, segmentCommentID: 
                {authorID::, content::, childComments: [commentCommentID: {authorID::}, ]}}}

'''

class SegmentViewSet(viewsets.ModelViewSet):
    queryset = Segment.objects.all()

    serializer_class = SegmentSerializer

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()

    serializer_class = StorySerializer

class AvailableSegmentByAuthorViewSet(viewsets.ModelViewSet):
    queryset = AvailableSegmentByAuthor.objects.all()
    serializer_class = AvailableSegmentByAuthorSerializer

class AuthorIncludingAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().prefetch_related(
        Prefetch(
            "available_segments",
            queryset=AvailableSegmentByAuthor.objects.only("author", "segment_id")
        ),
        Prefetch(
            "moderatable_segments",
            queryset=ModeratableSegmentByAuthor.objects.only("author", "segment_id")
        )
    )
    serializer_class = AuthorIncludingAvailabilitySerializer

class ModerationAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ModerationAssignment.objects.all()
    serializer_class = ModerationAssignmentSerializer

class SegmentTraceViewSet(viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentTraceBySegmentSerializer

class SegmentWithCommentsViewSet(viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class =  SegmentWithCommentsSerializer


class FullStoryInfoViewSet(viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = FullStoryInfoSerializer

class CompletedSegmentByAuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().prefetch_related(
        Prefetch(
            "segment",
            queryset=Segment.objects.only("id")
        )
    )
    serializer_class = CompletedSegmentByAuthorSerializer


class AuthorRelationViewSet(viewsets.ModelViewSet):
    queryset = AuthorRelation.objects.all()
    serializer_class = AuthorRelationSerializer

class AuthorRelationByAuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorRelationByAuthorSerializer
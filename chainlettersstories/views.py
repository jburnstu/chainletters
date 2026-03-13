from rest_framework import viewsets
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
import pandas as pd
import random


from .models import Story, Author, Segment, SegmentTrace, AvailableSegmentByAuthor, SegmentStatus, ModerationAssignment
from .serializers import StorySerializer, SegmentSerializer, AvailableSegmentByAuthorSerializer, AuthorIncludingAvailabilitySerializer, SegmentTraceBySegmentSerializer, ModerationAssignmentSerializer
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

def home(request,author_id):
    template = "chainlettersstories/dashboard.html"
    my_author = Author.objects.get(pk=author_id)
    my_author_name = my_author.display_name

    segment_ids_to_moderate = ModerationAssignment.objects\
                                                .filter(author=author_id)\
                                                .filter(is_it_closed=False)\
                                                .values_list("segment")
    if not segment_ids_to_moderate:
        read_separate_story_trace_dicts = []
    else:
        read_segment_trace_QS = SegmentTrace.objects.filter(final_segment_id__in = segment_ids_to_moderate)\
                                    .values("earlier_segment_id","earlier_segment_content","final_segment_id")\
                                    .order_by("earlier_segment_order")
        read_segment_trace_df = pd.DataFrame(read_segment_trace_QS)
        read_separate_story_trace_dicts = [{"id":key,"segment_trace":[{"earlier_segment_id":id,"earlier_segment_content":content} for id,content in zip(group["earlier_segment_id"],group["earlier_segment_content"])]}                              
                                           for key, group in read_segment_trace_df.groupby("final_segment")
        ]

    write_segment_trace_QS = SegmentTrace.objects.filter(final_author_id=author_id)\
                                .filter(final_segment_status_id=1)\
                                .values("earlier_segment_id","earlier_segment_content","final_segment")\
                                .order_by("earlier_segment_order")
    if not write_segment_trace_QS:
        write_separate_story_trace_dicts = []
    else:
        write_segment_trace_df = pd.DataFrame(write_segment_trace_QS)
        write_separate_story_trace_dicts = [{"id":key,"segment_trace":[{"earlier_segment_id":id,"earlier_segment_content":content} for id,content in zip(group["earlier_segment_id"],group["earlier_segment_content"])]}                              
                                           for key, group in write_segment_trace_df.groupby("final_segment")
        ]



    print(write_separate_story_trace_dicts)

    return render(request,template, 
                  {
                      "author_id": author_id,
                      "display_name": my_author_name,
                      "read_dicts":read_separate_story_trace_dicts,
                      "write_dicts":write_separate_story_trace_dicts})

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
    queryset = Author.objects.all()
    serializer_class = AuthorIncludingAvailabilitySerializer

class ModerationAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ModerationAssignment.objects.all()
    serializer_class = ModerationAssignmentSerializer

class SegmentTraceViewSet(viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentTraceBySegmentSerializer
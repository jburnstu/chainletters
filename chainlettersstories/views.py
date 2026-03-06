from rest_framework import viewsets
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
import pandas as pd
import random


from .models import Story, StoriesUser, Section, SectionTrace, AvailableSectionByUser, Sectionstatus, ModerationAssignment
from .serializers import StorySerializer, SectionSerializer, AvailableSectionByUserSerializer, StoriesUserIncludingAvailabilitySerializer, SectionTraceBySectionSerializer
# Create your views here.


def login_or_signup_page(request):
    template = "chainlettersstories/login_or_signup_page.html"
    return render(request,template,
                  {})


def login(request):
    try:
        login = request.POST["login-or-signup"]
        username_or_email = request.POST["username-or-email"]
        password = request.POST["password"]
        if "" in {username_or_email, password}:
            print('"" found')
            raise KeyError("neither field may be blank.")
    except KeyError as e:
        print(e)
        return render(request,
        "chainlettersstories/login_or_signup_page.html",
        {
            "message":
            "Please ensure both fields are filled in."
        })
    if bool(int(login)):
        print("login true")
        try:
            myuser = StoriesUser.objects.get(displayname=username_or_email,password=password)
            print(myuser.__dict__)
            userid = myuser.id
        except StoriesUser.DoesNotExist:
            try:
                myuser = StoriesUser.objects.get(email=username_or_email,password=password)
            except StoriesUser.DoesNotExist:
                return render(request,
                            "chainlettersstories/login_or_signup_page.html",
                            {
                                "message":
                                "No account found matching this username / email and password. Please try again or sign up."
                            })
        return HttpResponseRedirect(reverse("chainlettersstories:home", args=(userid,)))
    else:
        print("login false")
        try:
            myuser = StoriesUser.objects.get(displayname=username_or_email)
        except StoriesUser.DoesNotExist:
            newStoriesUser = StoriesUser(displayname=username_or_email,email=username_or_email+"@example.com",password=password)
            newStoriesUser.save()
            return render(request,
                        "chainlettersstories/login_or_signup_page.html",
                          {
                              "message":
                          "Login successfully added! Please now login."
                          }
            )
        return render (request,
                        "chainlettersstories/login_or_signup_page.html",
                          {
                              "message":
                          "Account already exists. Please log in instead."
                          }
            )

def home(request,userid):
    template = "chainlettersstories/dashboard.html"
    myuser = StoriesUser.objects.get(pk=userid)
    print("MYUSER",myuser)
    myusername = myuser.displayname
    print(myusername)

    section_ids_to_moderate = ModerationAssignment.objects\
                                                .filter(userid_id=userid)\
                                                .filter(isitclosed=False)\
                                                .values_list("sectionid")
    if not section_ids_to_moderate:
        read_separate_story_trace_dicts = []
    else:
        read_section_trace_QS = SectionTrace.objects.filter(finalsectionid__in = section_ids_to_moderate)\
                                    .values("earliersectionid","earliersectioncontent","finalsectionid")\
                                    .order_by("earliersectionorder")
        read_section_trace_df = pd.DataFrame(read_section_trace_QS)
        read_separate_story_trace_dicts = [{"id":key,"sectiontrace":[{"earliersectionid":id,"earliersectioncontent":content} for id,content in zip(group["earliersectionid"],group["earliersectioncontent"])]}                              
                                           for key, group in read_section_trace_df.groupby("finalsectionid")
        ]

    write_section_trace_QS = SectionTrace.objects.filter(finaluserid=userid)\
                                .filter(finalsectionstatusid=1)\
                                .values("earliersectionid","earliersectioncontent","finalsectionid")\
                                .order_by("earliersectionorder")
    if not write_section_trace_QS:
        write_separate_story_trace_dicts = []
    else:
        write_section_trace_df = pd.DataFrame(write_section_trace_QS)
        write_separate_story_trace_dicts = [{"id":key,"sectiontrace":[{"earliersectionid":id,"earliersectioncontent":content} for id,content in zip(group["earliersectionid"],group["earliersectioncontent"])]}                              
                                           for key, group in write_section_trace_df.groupby("finalsectionid")
        ]



    print(write_separate_story_trace_dicts)

    return render(request,template, 
                  {
                      "userid": userid,
                      "displayname": myusername,
                      "read_dicts":read_separate_story_trace_dicts,
                      "write_dicts":write_separate_story_trace_dicts})

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()

    serializer_class = SectionSerializer

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()

    serializer_class = StorySerializer

class AvailableSectionByUserViewSet(viewsets.ModelViewSet):
    queryset = AvailableSectionByUser.objects.all()
    serializer_class = AvailableSectionByUserSerializer

class StoriesUserIncludingAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = StoriesUser.objects.all()
    serializer_class = StoriesUserIncludingAvailabilitySerializer

class SectionTraceViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionTraceBySectionSerializer
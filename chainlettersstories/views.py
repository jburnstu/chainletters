from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
import pandas as pd
import random


from .models import Story, StoriesUser, Section, SectionTrace, AvailableSectionByUser, Sectionstatus, ModerationAssignment
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
        return HttpResponseRedirect(reverse("chainlettersstories:dashboard", args=(userid,)))
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



# def dashboard(request,userid):
#     template = "chainlettersstories/dashboard.html"
#     myuser = StoriesUser.objects.get(pk=userid)
#     myusername = myuser.displayname
#     return render(request,template, 
#                   {
#                       "userid": userid,
#                       "displayname": myusername})

from django.views.generic.detail import DetailView

class UserDetailView(DetailView):
    model = StoriesUser
    template_name = "chainlettersstories/dashboard.html"



def read_dashboard(request, userid):
    template = "chainlettersstories/read_dashboard.html"
    myuser = StoriesUser.objects.get(pk=userid)
    myusername = myuser.displayname

    section_ids_to_moderate = ModerationAssignment.objects\
                                                .filter(userid_id=userid)\
                                                .filter(isitclosed=False)\
                                                .values_list("sectionid")
    print("section_ids_to_moderate, ",section_ids_to_moderate)
    # section_trace_QS = SectionTrace.objects.filter(finalsectionid__in = section_ids_to_moderate)\
    #                                         .values("sectionorder","sectioncontent","finalsectionid")

    section_trace_QS = SectionTrace.objects.filter(finalsectionid__in = section_ids_to_moderate)\
                                            .values("sectionorder","sectioncontent","finalsectionid")
    print("1:", section_trace_QS)

    section_trace_df = pd.DataFrame(section_trace_QS)
    if not section_trace_df.empty:
        separate_story_trace_dicts = {key:{"previous":list(group["sectioncontent"])[:-1],
                                           "current": list(group["sectioncontent"])[-1]
                                           }
                                        for key, group in section_trace_df.groupby("finalsectionid")
        }

        return render(request,template,
                {
                    "userid":
                    userid,
                    "displayname":
                myusername,
                    "story_dicts":
                separate_story_trace_dicts})  
    else:
        return render(request,template,
                    {
                        "userid":
                        userid,
                        "displayname":
                    myusername,})



def get_random_moderatable_section(request,userid):
    available_sections = Section.objects\
                                .filter(sectionstatusid_id=2)\
                                .exclude(userid_id=userid)
    if not available_sections:
        return HttpResponseRedirect(reverse("chainlettersstories:read_dashboard", args=(userid,)))

    random_available_section = random.choice(available_sections)
    random_available_section.sectionstatusid_id = 3
    new_moderation_assignment = ModerationAssignment(sectionid_id=random_available_section.id,
                                                     userid_id = userid)
    new_moderation_assignment.save()

    return HttpResponseRedirect(reverse("chainlettersstories:read_dashboard", args=(userid,)))

def approve_new_section(request,userid,finalsectionid):

    approved_section = Section.objects.get(pk=finalsectionid)
    approved_section.sectionstatusid_id = 4
    approved_section.save()

    completed_assignment = ModerationAssignment.objects.get(sectionid=finalsectionid,userid=userid)
    completed_assignment.isitclosed = True
    completed_assignment.save()

    return HttpResponseRedirect(reverse("chainlettersstories:read_dashboard", args=(userid,)))



def write_dashboard(request,userid):
    template = "chainlettersstories/write_dashboard.html"
    myuser = StoriesUser.objects.get(pk=userid)
    myusername = myuser.displayname


    section_trace_QS = SectionTrace.objects.filter(userid=userid).filter(sectionstatusid=1).values("sectionorder","sectioncontent","finalsectionid")

    section_trace_df = pd.DataFrame(section_trace_QS)
    if not section_trace_df.empty:
        separate_story_trace_dicts = {key:{"previous":list(group["sectioncontent"])[:-1],
                                           "current": list(group["sectioncontent"])[-1]
                                           }
                                        for key, group in section_trace_df.groupby("finalsectionid")
        }


        return render(request,template,
                    {
                        "userid":
                        userid,
                        "displayname":
                    myusername,
                        "story_dicts":
                    separate_story_trace_dicts})  
    else:
        return render(request,template,
                    {
                        "userid":
                        userid,
                        "displayname":
                    myusername,})

def create_new_story(request,userid):
    new_story = Story(userid_id=userid,isitclosed=False,isitmature=True)
    new_story.save()
    first_section = Section(storyid_id=new_story.id,userid_id=userid,sectionstatusid_id=1)
    first_section.save()
    return  HttpResponseRedirect(reverse("chainlettersstories:write_dashboard", args=(userid,)))

def get_random_available_section(request,userid):
    available_sections = AvailableSectionByUser.objects.filter(userid = userid).values("sectionid")
    if not available_sections:
        return HttpResponseRedirect(reverse("chainlettersstories:write_dashboard", args=(userid,)))
    
    random_available_section_id = random.choice(available_sections)["sectionid"]
    previous_section_object = Section.objects.get(id=random_available_section_id)
    previous_section_object.sectionstatusid_id = 5
    new_section = Section(storyid=previous_section_object.storyid, userid_id=userid, sectionstatusid_id=1, content="",  previoussectionid_id=random_available_section_id)
    new_section.save()

    return  HttpResponseRedirect(reverse("chainlettersstories:write_dashboard", args=(userid,)))


def submit_section_to_story(request, userid, sectionid):
    section = Section.objects.get(pk=sectionid)

    content = request.POST["content"]
    save_or_submit = request.POST["save-or-submit"]
    if save_or_submit == "submit":
        section.sectionstatusid_id = 2
    elif save_or_submit == "abandon":
        section.sectionstatusid_id = 6
        section.previoussectionid.sectionstatusid_id = 4
    section.content = content
    section.save()

    return HttpResponseRedirect(reverse("chainlettersstories:write_dashboard", args=(userid,)))

def sectiontrace(sectionid):
    section_object_array = SectionTrace.objects.filter(finalsectionid=sectionid).order_by("sectionorder")
    section_content_array = list(section_object.sectioncontent for section_object in section_object_array)
    return HttpResponse
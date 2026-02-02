from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
import pandas as pd
import random


from .models import Story, StoriesUser, Section, SectionTrace, AvailableSectionByUser, Sectionstatus
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



def dashboard(request,userid):
    template = "chainlettersstories/dashboard.html"
    myuser = StoriesUser.objects.get(pk=userid)
    myusername = myuser.displayname
    return render(request,template, 
                  {
                      "userid": userid,
                      "displayname": myusername})


def write_dashboard(request,userid):
    template = "chainlettersstories/write_dashboard.html"
    myuser = StoriesUser.objects.get(pk=userid)
    myusername = myuser.displayname


    section_trace_QS = SectionTrace.objects.filter(userid=userid).filter(sectionstatusid=1).values("sectionorder","sectioncontent","finalsectionid")

    section_trace_df = pd.DataFrame(section_trace_QS)
    if not section_trace_df.empty:
        separate_story_trace_list = [[key, list(group["sectioncontent"])]
                                    for key, group in section_trace_df.groupby("finalsectionid")]
        return render(request,template,
                    {
                        "userid":
                        userid,
                        "displayname":
                    myusername,
                        "story_list":
                    separate_story_trace_list})  
    else:
        return render(request,template,
                    {
                        "userid":
                        userid,
                        "displayname":
                    myusername,})


def get_random_available_section(request,userid):
    # template = "chainlettersstories/write_dashboard.html"
    print(userid)
    available_sections = AvailableSectionByUser.objects.filter(userid = userid).values("sectionid")
    print(available_sections)
    random_available_section_id = random.choice(available_sections)["sectionid"]
    print(random_available_section_id)
    previous_section_object = Section.objects.get(id=random_available_section_id)
    lockedForAdditionStatus = Sectionstatus.objects.get(id=4)
    previous_section_object.sectionstatusid = lockedForAdditionStatus
    print("previous_section_object:",previous_section_object)

    new_section = Section(storyid=previous_section_object.storyid, userid_id=userid, sectionstatusid_id=1, content="",  previoussectionid_id=random_available_section_id)
    new_section.save()

    # return render(request,template,)

    return  HttpResponseRedirect(reverse("chainlettersstories:dashboard", args=(userid,)))

def create_new_story(request,userid):
    new_story = Story(userid_id=userid,isitclosed=False,isitmature=True)
    new_story.save()
    first_section = Section(storyid_id=new_story.id,userid_id=userid,sectionstatusid_id=1)
    first_section.save()
    return  HttpResponseRedirect(reverse("chainlettersstories:dashboard", args=(userid,)))


def submit_story_to_section(request,userid):
    content = request.POST["content"]
    previoussectionid = request.POST["previoussectionid"]
    old_section = Section.objects.get(pk=previoussectionid)
    new_section = Section(storyid=old_section.storyid,
                          userid=userid,
                          sectionstatusid=1,
                          content=content,
                          previoussectionid=previoussectionid)
    new_section.save()
    return HttpResponseRedirect(reverse("chainlettersstories:dashboard", args=(userid,)))

def sectiontrace(sectionid):
    section_object_array = SectionTrace.objects.filter(finalsectionid=sectionid).order_by("sectionorder")
    section_content_array = list(section_object.sectioncontent for section_object in section_object_array)
    return HttpResponse



'''
so, we want a full story in array form:
["it was a long night", "nobody could sleep", etc....]
 question:

 view contains content + this is pulled into object
 VS
 view doesn't contain content, further request per story part to pull this up

so when we INITIALLY load dashboard, that's when we want the stories 
 


'''
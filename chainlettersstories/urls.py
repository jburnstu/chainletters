from django.urls import path

from . import views

app_name = "chainlettersstories"
urlpatterns = [
    path("", views.login_or_signup_page, name="login_or_signup_page"),
    path("login", views.login, name="login"),
    
    path("<int:userid>/dashboard/", views.dashboard, name="dashboard"),

    path("<int:userid>/write_dashboard/",views.write_dashboard, name="write_dashboard"),
    path("<int:userid>/write_dashboard/get_random_available_story/", views. get_random_available_story,                name="get_random_available_story"),
    path("<int:userid>/write_dashboard/<int:previoussectionid>", views.submit_story_to_section,  name="submit_story_to_section"),

    path("sectiontrace<int:sectionid>",views.sectiontrace,name="sectiontrace")
]
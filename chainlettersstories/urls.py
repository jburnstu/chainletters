from django.urls import path

from . import views

app_name = "chainlettersstories"
urlpatterns = [
    path("", views.login_or_signup_page, name="login_or_signup_page"),
    path("login", views.login, name="login"),
    
    path("<pk>/dashboard/", views.UserDetailView.as_view(), name="dashboard"),

    path("<int:userid>/write_dashboard/",views.write_dashboard, name="write_dashboard"),
    path("<int:userid>/write_dashboard/create_new_story", 
         views.create_new_story,
         name="create_new_story"),
    path("<int:userid>/write_dashboard/get_random_available_section/", 
         views.get_random_available_section,  
         name="get_random_available_section"),
    path("<int:userid>/write_dashboard/submit_section_to_story/<int:sectionid>", 
         views.submit_section_to_story,   
         name="submit_section_to_story"),

    path("<int:userid>/read_dashboard/",views.read_dashboard, name="read_dashboard"),
    path("<int:userid>/read_dashboard/get_random_moderatable_section", 
         views.get_random_moderatable_section,
         name="get_random_moderatable_section"),
    path("<int:userid>/read_dashboard/approve_new_section/<int:sectionid>", 
         views.approve_new_section,
         name="approve_new_section"),
    

    path("sectiontrace<int:sectionid>",views.sectiontrace,name="sectiontrace")
]
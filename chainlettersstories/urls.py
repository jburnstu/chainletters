from django.urls import path, include

from . import views
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sections',views.SectionViewSet)
router.register(r'availablesectionsbyuser',views.AvailableSectionByUserViewSet)

app_name = "chainlettersstories"
urlpatterns = [
    path("", views.login_or_signup_page, name="login_or_signup_page"),
    path("login", views.login, name="login"),
    path("<int:userid>/", views.home, name="home"),

    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
     # Swagger UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Redoc UI:
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('',include(router.urls))

]




#     path("<int:userid>/write_dashboard/",views.write_dashboard, name="write_dashboard"),
#     path("<int:userid>/write_dashboard/create_new_story", 
#          views.create_new_story,
#          name="create_new_story"),
#     path("<int:userid>/write_dashboard/get_random_available_section/", 
#          views.get_random_available_section,  
#          name="get_random_available_section"),
#     path("<int:userid>/write_dashboard/submit_section_to_story/<int:sectionid>", 
#          views.submit_section_to_story,   
#          name="submit_section_to_story"),

#     path("<int:userid>/read_dashboard/",views.read_dashboard, name="read_dashboard"),
#     path("<int:userid>/read_dashboard/get_random_moderatable_section", 
#          views.get_random_moderatable_section,
#          name="get_random_moderatable_section"),
#     path("<int:userid>/read_dashboard/approve_new_section/<int:finalsectionid>", 
#          views.approve_new_section,
#          name="approve_new_section"),
    

#     path("sectiontrace<int:sectionid>",views.sectiontrace,name="sectiontrace")

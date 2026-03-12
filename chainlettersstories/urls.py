from django.urls import path, include

from . import views
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'segment',views.SegmentViewSet)
router.register(r'availablesegmentbyauthor',views.AvailableSegmentByAuthorViewSet)
router.register(r'story',views.StoryViewSet)
router.register(r'authorincludingavailability',views.AuthorIncludingAvailabilityViewSet)
router.register(r'moderationassignment', views.ModerationAssignmentViewSet)
router.register(r'segmenttrace', views.SegmentTraceViewSet, basename='segmenttrace')

app_name = "chainlettersstories"
urlpatterns = [
    path("", views.login_or_signup_page, name="login_or_signup_page"),
    path("login", views.login, name="login"),
    path(r"<int:author>/", views.home, name="home"),
    path(r"<int:author>/write", views.home, name="home"),
    path(r"<int:author>/read", views.home, name="home"),
    # path("<int:author>/write/", views.home, name="home"),
    # path("<int:author>/read/", views.home, name="home"),
    # path("<int:author>/write/<int:segment>", views.home, name="home"),
    #     path("<int:author>/read/<int:sedctionid>", views.home, name="home"),


    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
     # Swagger UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Redoc UI:
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('',include(router.urls))

]

# sdsds


#     path("<int:author>/write_dashboard/",views.write_dashboard, name="write_dashboard"),
#     path("<int:author>/write_dashboard/create_new_story", 
#          views.create_new_story,
#          name="create_new_story"),
#     path("<int:author>/write_dashboard/get_random_available_segment/", 
#          views.get_random_available_segment,  
#          name="get_random_available_segment"),
#     path("<int:author>/write_dashboard/submit_segment_to_story/<int:segment>", 
#          views.submit_segment_to_story,   
#          name="submit_segment_to_story"),

#     path("<int:author>/read_dashboard/",views.read_dashboard, name="read_dashboard"),
#     path("<int:author>/read_dashboard/get_random_moderatable_segment", 
#          views.get_random_moderatable_segment,
#          name="get_random_moderatable_segment"),
#     path("<int:author>/read_dashboard/approve_new_segment/<int:final_segment>", 
#          views.approve_new_segment,
#          name="approve_new_segment"),
    

#     path("segmenttrace<int:segment>",views.segmenttrace,name="segmenttrace")

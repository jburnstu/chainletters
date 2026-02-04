from django.contrib import admin

from .models import Story, StoriesUser, Section, Sectionstatus, ModerationAssignment
# Register your models here.
admin.site.register(Story)
admin.site.register(StoriesUser)
admin.site.register(Section)
admin.site.register(Sectionstatus)
admin.site.register(ModerationAssignment)

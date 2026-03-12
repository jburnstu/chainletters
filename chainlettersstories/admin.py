from django.contrib import admin

from .models import Story, Author, Segment, SegmentStatus, ModerationAssignment
# Register your models here.
admin.site.register(Story)
admin.site.register(Author)
admin.site.register(Segment)
admin.site.register(SegmentStatus)
admin.site.register(ModerationAssignment)

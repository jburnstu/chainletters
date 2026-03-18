from rest_framework import serializers
from .models import Story, Segment, AvailableSegmentByAuthor, Author,\
      SegmentTrace, ModerationAssignment, ModeratableSegmentByAuthor,\
          Comment, SegmentComment,StoryComment, CommentComment
from django.views.decorators.cache import cache_page

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class SegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segment
        fields = '__all__'

class AvailableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment_id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AvailableSegmentByAuthor
        fields = [
                'author_id',
                'segment_id'
        ] 

class ModeratableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment_id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ModeratableSegmentByAuthor
        fields = [
                'author_id',
                'segment_id'
        ] 

# @cache_page(60*15)
class AuthorIncludingAvailabilitySerializer(serializers.ModelSerializer):
    available_segments = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment_id")
    moderatable_segments = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment_id")

    class Meta:
        model = Author
        fields = [
            'id',
            'display_name',
            'available_segments',
            'moderatable_segments'
        ]

'''
Right now: AIA serializer must find all available segments (not even doign the moderatable ones right now)

'''

class SegmentTraceSerializer(serializers.ModelSerializer):

    class Meta: 
        model = SegmentTrace
        fields = [
                'earlier_segment_id',
                'earlier_segment_content'
                  ]

class SegmentTraceBySegmentSerializer(serializers.ModelSerializer):
    segment_trace = SegmentTraceSerializer(many=True,read_only=True)
    story_data = StorySerializer(read_only=True, source="story")


    class Meta:
        model = Segment
        fields = ['id',
                    'story_data',
                  'segment_trace'
        ]

class SegmentTraceWithCommentsSerializer(serializers.ModelSerializer):


    class Meta:
        model = SegmentTrace



class FullStoryInfoSerializer(serializers.ModelSerializer):
    segment_trace = SegmentTraceSerializer(many=True,read_only=True)
    story_data = StorySerializer(read_only=True, source="story")


    class Meta:
        model = Segment
        fields = ['id',
                    'story_data',
                  'segment_trace'
    ]


class ModerationAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModerationAssignment
        fields = '__all__'


class AuthorSerilializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ['id',
                  'display_name']

class CommentCommentSerializer(serializers.ModelSerializer):
    author = AuthorSerilializer(read_only=True,source="author")

    class Meta:
        model = CommentComment
        fields = []


class SegmentCommentWithChildrenSerializer(serializers.ModelSerializer):
    author = AuthorSerilializer(read_only=True,source="author")
    child_comments = CommentCommentSerializer(many=True,read_only=True,source="comment_comment")

    class Meta:
        model = SegmentComment
        fields = ['id',
                  'content',
                  'author',
                  'child_comments']
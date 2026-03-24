from rest_framework import serializers
from .models import Story, Segment, AvailableSegmentByAuthor, Author,\
      SegmentTrace, ModerationAssignment, ModeratableSegmentByAuthor,\
          Comment, SegmentComment,StoryComment, CommentComment,\
          SegmentCommentBySegment, SegmentCommentCommentByComment, \
            AuthorRelation, Circle, CircleAssignment
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

class ModerationAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModerationAssignment
        fields = '__all__'

class AuthorSerilializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ['id',
                  'display_name']


class SegmentCommentCommentByCommentSerializer(serializers.ModelSerializer):
    author = AuthorSerilializer(read_only=True)
    id = serializers.IntegerField(source="child_comment_id")

    class Meta:
        model = SegmentCommentCommentByComment
        fields = ['id',
                  'author',
                  'text_content']

class SegmentCommentBySegmentSerializer(serializers.ModelSerializer):
    comments = SegmentCommentCommentByCommentSerializer(read_only=True,many=True,source="segment_comment_comment_trace")
    author = AuthorSerilializer(read_only=True)
    id = serializers.IntegerField(source="comment_id")


    class Meta:
        model = SegmentCommentBySegment
        fields = ['id',
                  'author',
                  'text_content',
                  'comments']


class SegmentWithCommentsSerializer(serializers.ModelSerializer):
    comments = SegmentCommentBySegmentSerializer(read_only=True,many=True,source="segment_comment_trace")
    author = AuthorSerilializer(read_only=True)

    class Meta:
        model = Segment
        fields = ['id',
                  'author',
                  'content',
                  'comments']


class SegmentTraceIncludingCommentsSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    earlier_segment_author = AuthorSerilializer(read_only=True)

    class Meta: 
        model = SegmentTrace
        fields = [
                'earlier_segment_id',
                'earlier_segment_author',
                'earlier_segment_content',
                'comments'
                  ]
        
    def get_comments(self, obj):
        try:
            comments = SegmentCommentBySegment.objects.filter(segment_id=obj.earlier_segment_id)
        except SegmentCommentBySegment.DoesNotExist:
            return []    
        return [SegmentCommentBySegmentSerializer(comment).data for comment in comments]


class FullStoryInfoSerializer(serializers.ModelSerializer):
    segment_trace = SegmentTraceIncludingCommentsSerializer(many=True,read_only=True)
    story_data = StorySerializer(read_only=True, source="story")

    class Meta:
        model = Segment
        fields = ['id',
                    'story_data',
                  'segment_trace'
    ]


class AuthorRelationSerializer(serializers.ModelSerializer):
    pass


class CompletedSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment = serializers.PrimaryKeyRelatedField(many=True,
            queryset=Segment.objects.filter(segment_status_id__in =[4,5]))


    class Meta:
        model = Author
        fields = ['id',
                  'segment']



'''
What will we be doing with these serializers?

- adding (or removing) relations
- viewing lists of all authors who satisfy a relation
- viewing lists of circles
- viewing all authors who share an assigned circle

'''


# class StoryIncludingCommentsSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = Story
#         fields = '__all__'
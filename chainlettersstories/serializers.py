from rest_framework import serializers
from .models import Story, Segment, AvailableSegmentByAuthor, Author, SegmentTrace, ModerationAssignment, ModeratableSegmentByAuthor

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'author']

class SegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segment
        fields = '__all__'

class AvailableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AvailableSegmentByAuthor
        fields = [
                'author',
                'segment'
        ] 

class ModeratableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ModeratableSegmentByAuthor
        fields = [
                'author',
                'segment'
        ] 

class AuthorIncludingAvailabilitySerializer(serializers.ModelSerializer):
    availablesegment = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment")
    moderatablesegment = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment")
    segment = serializers.PrimaryKeyRelatedField(many=True,read_only=True)

    class Meta:
        model = Author
        fields = [
            'id',
            'display_name',
            'segment',
            'availablesegment',
            'moderatablesegment'
        ]

class SegmentTraceSerializer(serializers.ModelSerializer):

    class Meta: 
        model = SegmentTrace
        fields = [
                    # 'earlier_segment_ordering'
                    'earlier_segment',
                  'earlier_segment_content'
                  ]

class SegmentTraceBySegmentSerializer(serializers.ModelSerializer):
    segmenttrace = SegmentTraceSerializer(many=True,read_only=True)

    class Meta:
        model = Segment
        fields = ['id',
                  'segmenttrace'
        ]

class ModerationAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModerationAssignment
        fields = '__all__'

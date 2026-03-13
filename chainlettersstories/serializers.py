from rest_framework import serializers
from .models import Story, Segment, AvailableSegmentByAuthor, Author, SegmentTrace, ModerationAssignment, ModeratableSegmentByAuthor

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'author_id']

class SegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segment
        fields = '__all__'

class AvailableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AvailableSegmentByAuthor
        fields = [
                'author_id',
                'segment_id'
        ] 

class ModeratableSegmentByAuthorSerializer(serializers.ModelSerializer):
    segment = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ModeratableSegmentByAuthor
        fields = [
                'author_id',
                'segment_id'
        ] 

class AuthorIncludingAvailabilitySerializer(serializers.ModelSerializer):
    available_segment_id = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment")
    moderatable_segment_id = serializers.SlugRelatedField(many=True,read_only=True,slug_field="segment")
    segment = serializers.PrimaryKeyRelatedField(many=True,read_only=True)

    class Meta:
        model = Author
        fields = [
            'id',
            'display_name',
            'segment_id',
            'available_segment_id',
            'moderatable_segment_id'
        ]

class SegmentTraceSerializer(serializers.ModelSerializer):

    class Meta: 
        model = SegmentTrace
        fields = [
                    # 'earlier_segment_ordering'
                    'earlier_segment_id',
                  'earlier_segment_content'
                  ]

class SegmentTraceBySegmentSerializer(serializers.ModelSerializer):
    segment_trace = SegmentTraceSerializer(many=True,read_only=True)

    class Meta:
        model = Segment
        fields = ['id',
                  'segment_trace'
        ]

class ModerationAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModerationAssignment
        fields = '__all__'

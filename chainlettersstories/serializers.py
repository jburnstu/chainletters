from rest_framework import serializers
from .models import Story, Section, AvailableSectionByUser, StoriesUser, SectionTrace, ModerationAssignment, ModeratableSectionByUser

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'userid']

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class AvailableSectionByUserSerializer(serializers.ModelSerializer):
    sectionid = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AvailableSectionByUser
        fields = [
                'userid',
                'sectionid'
        ] 

class ModeratableSectionByUserSerializer(serializers.ModelSerializer):
    sectionid = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ModeratableSectionByUser
        fields = [
                'userid',
                'sectionid'
        ] 

class StoriesUserIncludingAvailabilitySerializer(serializers.ModelSerializer):
    availablesection = serializers.SlugRelatedField(many=True,read_only=True,slug_field="sectionid")
    moderatablesection = serializers.SlugRelatedField(many=True,read_only=True,slug_field="sectionid")
    section = serializers.PrimaryKeyRelatedField(many=True,read_only=True)

    class Meta:
        model = StoriesUser
        fields = [
            'id',
            'displayname',
            'section',
            'availablesection',
            'moderatablesection'
        ]

class SectionTraceSerializer(serializers.ModelSerializer):

    class Meta: 
        model = SectionTrace
        fields = [
                    # 'earliersectionordering'
                    'earliersectionid',
                  'earliersectioncontent'
                  ]

class SectionTraceBySectionSerializer(serializers.ModelSerializer):
    sectiontrace = SectionTraceSerializer(many=True,read_only=True)

    class Meta:
        model = Section
        fields = ['id',
                  'sectiontrace'
        ]

class ModerationAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModerationAssignment
        fields = '__all__'

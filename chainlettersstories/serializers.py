from rest_framework import serializers
from .models import Story, Section, AvailableSectionByUser, StoriesUser, SectionTrace

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
    # sectionid = SectionSerializer(many=True)

    class Meta:
        model = AvailableSectionByUser
        fields = [
                'userid',
                'sectionid'
        ] 

class StoriesUserIncludingAvailabilitySerializer(serializers.ModelSerializer):
    availablesections = serializers.PrimaryKeyRelatedField(many=True,read_only=True)
    sections = serializers.PrimaryKeyRelatedField(many=True,read_only=True)

    class Meta:
        model = StoriesUser
        fields = [
            'id',
            'displayname',
            'sections',
            'availablesections'
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
    sectiontraces = SectionTraceSerializer(many=True,read_only=True)

    class Meta:
        model = Section
        fields = ['id',
                  'sectiontraces'
        ]
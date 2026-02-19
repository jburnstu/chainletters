from rest_framework import serializers
from .models import Story, Section, AvailableSectionByUser

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'userid']

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class AvailableSectionByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableSectionByUser
        fields = [
                'userid',
                  'sectionid'
        ]


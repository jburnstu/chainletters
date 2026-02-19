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
    sectionid = serializers.PrimaryKeyRelatedField(many=True,read_only=True)

    class Meta:
        model = AvailableSectionByUser
        fields = [
            # 'id',
                'userid',
                'sectionid'
        ] 


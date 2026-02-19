from rest_framework import serializers
from .models import Section, AvailableSectionByUser

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class AvailableSectionByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id',
                'userid',
                  'sectionid'
        ]


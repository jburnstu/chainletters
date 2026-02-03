# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Comment(models.Model):
    userid = models.ForeignKey('StoriesUser', models.DO_NOTHING, db_column='userid')
    commenttypeid = models.ForeignKey('Commenttype', models.DO_NOTHING, db_column='commenttypeid')
    textcontent = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'comment'
        unique_together = (('id', 'commenttypeid'),)


    def __str__(self):
        return self.textcontent


class Commentcomment(models.Model):
    commentid = models.ForeignKey(Comment, models.DO_NOTHING, db_column='commentid')
    commenttypeid = models.IntegerField()
    parentcommentid = models.ForeignKey(Comment, models.DO_NOTHING, db_column='parentcommentid', related_name='commentcomment_parentcommentid_set')

    class Meta:
        db_table = 'commentcomment'


class Commenttype(models.Model):
    description = models.CharField(max_length=20)

    class Meta:
        db_table = 'commenttype'

class ModerationAssignment(models.Model):
    sectionid = models.ForeignKey('Section', models.DO_NOTHING,db_column='sectionid')
    userid = models.ForeignKey('StoriesUser', models.DO_NOTHING,db_column='userid')
    isitclosed = models.BooleanField(default=False)


    

class Section(models.Model):
    storyid = models.ForeignKey('Story', models.DO_NOTHING, db_column='storyid')
    userid = models.ForeignKey('StoriesUser', models.DO_NOTHING, db_column='userid')
    sectionstatusid = models.ForeignKey('Sectionstatus', models.DO_NOTHING, db_column='sectionstatusid')
    content = models.TextField(blank=True, null=True)
    previoussectionid = models.ForeignKey('Section',models.DO_NOTHING,db_column='previoussectionid', null=True)

    class Meta:
        db_table = 'section'

    def __str__(self):
        return self.content


class Sectioncomment(models.Model):
    commentid = models.ForeignKey(Comment, models.DO_NOTHING, db_column='commentid')
    commenttypeid = models.IntegerField()
    parentsectionid = models.ForeignKey(Section, models.DO_NOTHING, db_column='parentsectionid')

    class Meta:
        db_table = 'sectioncomment'


class Sectionstatus(models.Model):
    description = models.CharField(max_length=20)

    class Meta:
        db_table = 'sectionstatus'


class Story(models.Model):
    userid = models.ForeignKey('StoriesUser', models.DO_NOTHING, db_column='userid')
    isitclosed = models.BooleanField(default=False)
    title = models.CharField(max_length=100, blank=True, null=True)
    isitmature = models.BooleanField(default=False)
    maxstorylength = models.SmallIntegerField(blank=True, null=True)
    maxsectionlength = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'story'


class Storycomment(models.Model):
    commentid = models.ForeignKey(Comment, models.DO_NOTHING, db_column='commentid')
    commenttypeid = models.IntegerField()
    parentstoryid = models.ForeignKey(Story, models.DO_NOTHING, db_column='parentstoryid')

    class Meta:
        db_table = 'storycomment'


class Tag(models.Model):
    description = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'tag'

    def __str__(self):
        return self.description


class Tagassingment(models.Model):
    storyid = models.ForeignKey(Story, models.DO_NOTHING, db_column='storyid')
    tagid = models.ForeignKey(Tag, models.DO_NOTHING, db_column='tagid')

    class Meta:
        db_table = 'tagassingment'


class StoriesUser(models.Model):
    displayname = models.CharField(max_length=30)
    email = models.CharField(max_length=30)
    password = models.CharField(max_length=30)

    class Meta:
        db_table = 'user'


    def __str__(self):
        if self.displayname is "":
            return self.email
        else:
            return self.displayname

class SectionTrace(models.Model):
    finalsectionid = models.CharField()
    sectionid = models.IntegerField()
    sectionorder = models.IntegerField()
    sectioncontent = models.CharField()
    userid = models.IntegerField()
    sectionstatusid = models.IntegerField()

    class Meta:
        db_table = 'sectiontrace'
        managed = False


class AvailableSectionByUser(models.Model):
    userid = models.IntegerField()
    sectionid = models.IntegerField()

    class Meta:
        db_table = 'availablesectionbyuser'
        managed = False
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Author(models.Model):
    display_name = models.CharField(max_length=30)
    email = models.CharField(max_length=30)
    password = models.CharField(max_length=30)

    def __str__(self):
        if self.display_name == "":
            return self.email
        else:
            return self.display_name
        
    class Meta:
        db_table = "author"


class Story(models.Model):
    author = models.ForeignKey('Author', models.DO_NOTHING)
    is_it_closed = models.BooleanField(default=False)
    title = models.CharField(max_length=100, blank=True, null=True)
    min_segment_length = models.SmallIntegerField(blank=True, null=True)
    max_segment_length = models.SmallIntegerField(blank=True, null=True)
    max_number_of_segments = models.SmallIntegerField(blank=True, null=True)
    max_number_of_branches = models.SmallIntegerField(blank=True, null=True)
    is_it_mature = models.BooleanField(default=False)

    class Meta:
        db_table = "story"


class Segment(models.Model):
    story = models.ForeignKey('Story', models.DO_NOTHING, related_name="story_data")
    author = models.ForeignKey('Author', models.DO_NOTHING)
    segment_status = models.ForeignKey('SegmentStatus', models.DO_NOTHING)
    content = models.TextField(default="")
    previous_segment = models.ForeignKey('Segment',models.DO_NOTHING,null=True)

    def __str__(self):
        return self.content
    
    class Meta:
        db_table = "segment"


class SegmentStatus(models.Model):
    description = models.CharField(max_length=20)

    class Meta:
        db_table = "segment_status"


class Tag(models.Model):
    description = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.description
    
    class Meta:
        db_table = "tag"


class Tagassingment(models.Model):
    story = models.ForeignKey('Story', models.DO_NOTHING)
    tagid = models.ForeignKey('Tag', models.DO_NOTHING)

    class Meta:
        db_table = "tag_assignment"


class ModerationAssignment(models.Model):
    segment = models.ForeignKey('Segment', models.DO_NOTHING)
    author = models.ForeignKey('Author', models.DO_NOTHING)
    is_it_closed = models.BooleanField(default=False)


    class Meta:
        db_table = "moderation_assignment"


class SegmentTrace(models.Model):
    pk = models.CompositePrimaryKey("final_segment","earlier_segment_id")
    final_segment = models.ForeignKey(Segment, models.DO_NOTHING, related_name="segment_trace")
    earlier_segment_id = models.IntegerField()
    earlier_segment_order = models.IntegerField()
    earlier_segment_content = models.CharField()
    final_author_id = models.IntegerField()
    final_segment_status_id = models.IntegerField()
    story_id = models.IntegerField()
    earlier_segment_author = models.ForeignKey("Author", models.DO_NOTHING)

    class Meta:
        db_table = "segment_trace"
        managed = False
        

class AvailableSegmentByAuthor(models.Model):
    # id = models.IntegerField
    pk = models.CompositePrimaryKey("author","segment_id")
    author = models.ForeignKey(Author, models.DO_NOTHING, related_name="available_segments")
    segment_id = models.IntegerField()


    class Meta:
        db_table = "available_segment_by_author"
        managed = False


class ModeratableSegmentByAuthor(models.Model):    # id = models.IntegerField
    pk = models.CompositePrimaryKey("author","segment_id")
    author = models.ForeignKey(Author, models.DO_NOTHING, related_name="moderatable_segments")
    segment_id = models.IntegerField()

    class Meta:
        db_table = "moderatable_segment_by_author"
        managed = False


class Comment(models.Model):
    author = models.ForeignKey('Author', models.DO_NOTHING)
    comment_parent_type = models.ForeignKey('CommentParentType', models.DO_NOTHING)
    comment_status = models.ForeignKey('CommentStatus',models.DO_NOTHING,default=1)
    text_content = models.TextField(default="")

    def __str__(self):
        return self.text_content
    
    class Meta:
        db_table = "comment"

class CommentParentType(models.Model):
    description = models.CharField(max_length=20)

    class Meta:
        db_table = "comment_parent_type"

class CommentStatus(models.Model):
    description = models.CharField(max_length=30)

    class Meta:
        db_table = "comment_status"


class CommentComment(models.Model):
    comment = models.ForeignKey('Comment', models.DO_NOTHING,related_name="comment_comment")
    comment_parent_type = models.ForeignKey('CommentParentType', models.DO_NOTHING,default=3)
    parent_comment = models.ForeignKey('Comment', models.DO_NOTHING,related_name="parent_comment_comment")

    class Meta:
        db_table = "comment_comment"


class SegmentComment(models.Model):
    comment = models.ForeignKey('Comment', models.DO_NOTHING,related_name="segment_comment")
    comment_parent_type = models.ForeignKey('CommentParentType', models.DO_NOTHING,default=2)
    parent_segment = models.ForeignKey('Segment', models.DO_NOTHING,related_name="parent_segment_comment")

    class Meta:
        db_table = "segment_comment"

class StoryComment(models.Model):
    comment = models.ForeignKey('Comment', models.DO_NOTHING,related_name="story_comment")
    comment_parent_type = models.ForeignKey('CommentParentType', models.DO_NOTHING,default=1)
    parent_story = models.ForeignKey('Story', models.DO_NOTHING,related_name="parent_story_comment")

    class Meta:
        db_table = "story_comment"


class SegmentCommentBySegment(models.Model):
    # pk = models.CompositePrimaryKey("segment","comment")
    segment = models.ForeignKey("Segment",models.DO_NOTHING,related_name="segment_comment_trace")
    comment = models.ForeignKey("Comment", models.DO_NOTHING, primary_key=True)
    author = models.ForeignKey("Author", models.DO_NOTHING)
    text_content = models.CharField()

    class Meta:
        db_table = "segment_comment_by_segment"
        managed=False

class SegmentCommentCommentByComment(models.Model):
    # pk = models.CompositePrimaryKey("comment","child_comment")
    comment = models.ForeignKey("SegmentCommentBySegment",models.DO_NOTHING,related_name="segment_comment_comment_trace")
    child_comment = models.ForeignKey("Comment", models.DO_NOTHING,primary_key=True)
    author = models.ForeignKey("Author", models.DO_NOTHING)
    text_content = models.CharField()

    class Meta:
        db_table = "segment_comment_comment_by_comment"
        managed=False
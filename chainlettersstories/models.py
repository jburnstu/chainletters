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
    story = models.ForeignKey('Story', models.DO_NOTHING)
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
    final_segment = models.ForeignKey(Segment, models.DO_NOTHING, related_name="segment_trace")
    earlier_segment_id = models.IntegerField()
    earlier_segment_order = models.IntegerField()
    earlier_segment_content = models.CharField()
    final_author_id = models.IntegerField()
    final_segment_status_id = models.IntegerField()

    class Meta:
        db_table = "segment_trace"
        managed = False
        


class AvailableSegmentByAuthor(models.Model):
    # id = models.IntegerField
    author = models.ForeignKey(Author, models.DO_NOTHING, related_name="available_segment_id")
    segment = models.IntegerField()

    class Meta:
        db_table = "available_segment_by_user"
        managed = False


class ModeratableSegmentByAuthor(models.Model):
    author = models.ForeignKey(Author, models.DO_NOTHING, related_name="moderatable_segment_id")
    segment = models.IntegerField()

    class Meta:
        db_table = "moderatable_segment_by_user"
        managed = False




# class Comment(models.Model):
#     author = models.ForeignKey('Author', models.DO_NOTHING)
#     comment_type = models.ForeignKey('CommentType', models.DO_NOTHING)
#     text_content = models.TextField(default="")


#     def __str__(self):
#         return self.text_content

# class CommentType(models.Model):
#     description = models.CharField(max_length=20)

# class CommentComment(models.Model):
#     comment = models.ForeignKey('Comment', models.DO_NOTHING)
#     comment_type = models.ForeignKey('CommentType', models.DO_NOTHING)
#     parent_comment = models.ForeignKey('Comment', models.DO_NOTHING)


# class SegmentComment(models.Model):
#     comment = models.ForeignKey('Comment', models.DO_NOTHING)
#     comment_type = models.ForeignKey('CommentType', models.DO_NOTHING)
#     parent_segment = models.ForeignKey('Segment', models.DO_NOTHING)

# class StoryComment(models.Model):
#     comment = models.ForeignKey('Comment', models.DO_NOTHING)
#     comment_type = models.ForeignKey('CommentType', models.DO_NOTHING)
#     parent_story = models.ForeignKey('Story', models.DO_NOTHING)
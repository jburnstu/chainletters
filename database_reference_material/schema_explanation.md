# chainlettersstoriesschema structure

This document exists to explain the structure of the Postgres database schema i've created and used for my project. It's mostly kept the same structure from earliest drafts (for now).

The main change was when I went from creating the DB in Postgres, and then uploading to Django, to later "reverse-engineering" and creating models in Django to then make the DB. This wasn't really my ideal choice -- I prefer working in SQL than using Django's ORM, which feels like it's deisgned for people who don't like SQL (I do) -- but the way Django was reading foreign key column names was causing issues, and I felt it was necessary to avoid swimming upstream with the ORM, especially once I started setting up the API layer.
A couple of implications of this:
- Some many-to-many tables nevertheless have a (somewhat redundant) primary key, as composite primary keys in Django arn't super well-supported.
- Views are written in a way that allows them to be accessed via a Django "model", which requires a (somewhat arbitrary) primary key assignment.
- In some of the views' Django models, there are inconsistent-*looking* column names, where some have id appended and others don't. This is because Django needs foreign key relations (and hence actual object names, not their ids) to serialize data, and for now I've just changed the ones that needed a foreign key, rather than add a load of foreign key relations that aren't really there. This will probably cause bugs down the line, so it's "on my list".

## Key Tables
There are three key tables in the database schema -- author, story, and segment.
In short, authors (users) create stories, and then add segments (separate sections, or "chapters" if you like) to other stories.

### author
Users on the app. Each author has a dedicated access point and hence URL stub (although not authenticated yet -- coming soon!) which they never leave for their time on the site. For now, the author object doesn't actually have much data associated with it.

Created When: a user uses the "sign up" functionality to create a new account.

### story
Users create a "story" object when they create a new story on the app. This object controls story-wide features, such as the min/max words per segment "belonging" to that story.
Note that when a story is created, its first segment will also necessarily be created.

Created When: an author (user) uses the "New" button to create a new story (with first segment).

### segment
When a user adds text to a story, this is saved in a "segment" object (hence, all the actual "story content" in the site is saved in segments). Most of the fields on segment are references or content -- the "behaviour" of its text content (eg length) is validated via its story object. Each segment references:
- The user who wrote it;
- The story it belongs to;
- The segment that it directly follows.

Created When: an author uses either the "New" or the "Join" buttons. Segments are created empty, with the "In Progress" status, then have their content (and status) updated when they are submitted.

## Support Tables and the segment "life cycle".
A couple of tables provide state management for segments as they move through their "life cycle".

### moderation_assignment
After a segment is written, but before it becomes visible to be added to further, it must be moderated by a random unrelated author. This many-to-many table assigns segments to authors who can moderate them.

Created When: an author uses the "moderate" button to request a random segment awaiting moderation.

### segment_status
A segment passes through the following status values in order, depending on interactions with users (both the one who wrote it, and others):
1. inProgress. The segment has been created (by New or Join) but not yet submitted (by Submit or Abandon).
2. availableForModeration. The segment has been submitted. When an author selects a segment to moderate, this status will flag it as available.
3. inModeration. The segment is currently on an author's moderation panel, where it remains until that author approves it. Every segment must be moderated before it is available to add to.
4. availableForAddition. The segment is available to be added to. When a user goes to join a random story, this status is one of the conditions for a segment to be offered.
5. lockedForAddition. An author has selected this segment via join and is adding a new segment on top of it. (Only one user can add to a given previous segment at once.) This status will revert to 4 (availableForAddition) if/when that latter segment is approved or abandoned.
6. abandoned. The segment has been abandoned while being written.

## Helper Views
Although not shown on the ERD, I have created some views to support the access of data from the database. These vary in complexity and how central they are to use of the app (some are just there to reshape data in a way that would be annoying in Django).

The most important:

### segment_trace
A recursive query-view that relates each segment to all the segments that preceded it in its story. (It does this by looping over the previous_segment_id column in segment.) This is how the app actually loads up a story in its current state "in writing". It is also used when an author wants to join an existing story -- authors may not join a segment with one of their own semgents in its trace (IE, each author should only appear once in a story "chain").

### moderatable_segment_by_user, available_segment_by_user
These views are used when a user wants to moderate, or add to, an existing segment; as such, they include the logic of which segments are viable for these uses. (This is likely to see major change in the future, eg a sub-ranking of availability to each of these things.)

## Other Tables
There are other app functionalities still under construction, for which I have begun to assemble database infrastructure.

### comment, story_comment, segment_comment, comment_comment, comment_type, comment_status
A commenting system with a class-table-hierarchy (IE, all comments are present in the comment table, and then referenced from their relevant sub-table per type). Comments may be made on segments, stories, or other comments. Still in progress.

### author_relation, author_relation_type
These will handle relations such as following, blocking other users etc.

### tab, tab_assignment
These will eventually establish universal "tags" (eg "horror", "romance" etc) and assign them to stories and segments.

### circle, circle_assignment
Circles are a planned functionality where a group of users can pass stories excclusively between one another. IE, a circle creates an enclosed version of the app, where only users assigned to that circle may access stories assigned to that circle.



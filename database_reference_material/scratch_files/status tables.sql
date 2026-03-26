set search_path = "chainlettersstoriesschema"

SELECT * FROM chainlettersstoriesschema.segment_status
ORDER BY id ASC 

select * from segment


pg_dump postgres  chainlettersstoriesschema > 'backup.sql'

insert into  chainlettersstoriesschema.segment_status
values (1,'lockedForSubmission'),
		(2,'availableForModeration'),
		(3,'lockedForModeration'),
		(4,'availableForAddition'),
		(5,'lockedForAddition'),
		(6,'abandoned')

insert into comment_status
values (1,'lockedForSubmission'),
		(2,'availableForAddition'),
		(3,'abandoned')

insert into comment_parent_type
values (1,'story'),
		(2,'segment'),
		(3,'comment')


select * from chainlettersstoriesschema.comment

delete from comment

create or replace view chainlettersstoriesschema.available_segment_by_user as

 SELECT a.id AS author_id,
    s.id AS segment_id
   FROM chainlettersstoriesschema.author a
     CROSS JOIN chainlettersstoriesschema.segment s
  WHERE s.segment_status_id = 4 AND NOT (EXISTS ( SELECT 1
           FROM chainlettersstoriesschema.segment_trace st
             JOIN chainlettersstoriesschema.segment s2 ON st.earlier_segment_id = s2.id
          WHERE s2.author_id = a.id AND st.final_segment_id = s.id));

select author_id, se from available_segment_by_author
group by author_id
order by author_id

select count(*) from segment

select author_id, count(previous_segment_id) from segment
where previous_segment_id is not null
group by author_id
order by author_id


alter 
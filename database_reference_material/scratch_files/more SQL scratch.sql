set search_path = "chainlettersstoriesschema"

SELECT * FROM chainlettersstoriesschema.segment_status
ORDER BY id ASC 


insert into  chainlettersstoriesschema.segment_status
values (1,'lockedForSubmission'),
		(2,'availableForModeration'),
		(3,'lockedForModeration'),
		(4,'availableForAddition'),
		(5,'lockedForAddition'),
		(6,'abandoned')


select * from chainlettersstoriesschema.available_segment_by_author

create or replace view chainlettersstoriesschema.available_segment_by_user as
 SELECT a.id AS author_id,
    s.id AS segment_id
   FROM chainlettersstoriesschema.author a
     CROSS JOIN chainlettersstoriesschema.segment s
  WHERE s.segment_status_id = 4 AND NOT (EXISTS ( SELECT 1
           FROM chainlettersstoriesschema.segment_trace st
             JOIN chainlettersstoriesschema.segment s2 ON st.earlier_segment_id = s2.id
          WHERE s2.author_id = a.id AND st.final_segment_id = s.id));

select s.author_id
from segment s join segment_trace st on st.earliersegment_id = s.id


select count(*) from segment where previous_segment_id is null


alter 
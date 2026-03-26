set search_path = "chainlettersstoriesschema"

create or replace view segment_trace as 
 WITH RECURSIVE r(story_id, final_segment_id, segment_id, previous_segment_id, recursion_depth) AS (
         SELECT s_1.story_id,
            s_1.id,
            s_1.id,
            s_1.previous_segment_id,
            1 AS "?column?"
           FROM chainlettersstoriesschema.segment s_1
        UNION ALL
         SELECT r_1.story_id,
            r_1.final_segment_id,
            r_1.previous_segment_id,
            s2_1.previous_segment_id,
            r_1.recursion_depth + 1
           FROM chainlettersstoriesschema.segment s2_1
             JOIN r r_1 ON r_1.story_id = s2_1.story_id AND r_1.previous_segment_id = s2_1.id
        )
 SELECT r.final_segment_id,
    r.segment_id AS earlier_segment_id,
    1 + (( SELECT max(r2.recursion_depth) AS max
           FROM r r2
          WHERE r2.final_segment_id = r.final_segment_id)) - r.recursion_depth AS earlier_segment_order,
    s.content AS earlier_segment_content,
    s2.author_id AS final_author_id,
    s2.segment_status_id AS final_segment_status_id,
	r.story_id as story_id,
	s.author_id as earlier_segment_author_id
   FROM r
     JOIN chainlettersstoriesschema.segment s ON r.segment_id = s.id
     JOIN chainlettersstoriesschema.segment s2 ON r.final_segment_id = s2.id
  ORDER BY r.final_segment_id, (1 + (( SELECT max(r2.recursion_depth) AS max
           FROM r r2
          WHERE r2.final_segment_id = r.final_segment_id)) - r.recursion_depth);


alter view segment_trace
rename column "content" to "segment_content"

select * from segment_trace

select * from segment

select * from story

select * from chainlettersstoriesschema.user

delete from storysc
delete from segment

set search_path = "chainlettersstoriesschema"


insert into segment_status
values (3,'available'),(4,'lockedForAddition'),(5,'deleted')

select s.id
from segment s 
where user_id = 1
and segment_status_id = 1

select s.id as "segment_id",
concat()

create or replace view segment_comment_by_segment as 
select s.id as segment_id,
		sc.comment_id as comment_id,
		c.author_id,
		c.text_content as text_content
from segment s
join segment_comment sc on sc.parent_segment_id = s.id
join comment c on c.id = sc.comment_id

-- create or replace view segment_comment_comment_by_comment as
select
		scbs.segment_id,
		scbs.comment_id,
		cc.comment_id as child_comment_id,
		c.author_id,
		c.text_content
from segment_comment_by_segment scbs
join comment_comment cc on cc.parent_comment_id = scbs.comment_id
join comment c on c.id = cc.comment_id






union all
select  s.id,  sc.comment_id, null, c.content, a.id, a.name





insert into segment (storyid,user_id,segment_status_id,content, previous_segment_id)
values (5, 1, 1, 'Nobody could sleep.',2)


select * from segment

select * from availablesegmentbyuser


SELECT nextval('segment_id_seq');

insert into segment ()


select * from segment s
join segment_trace st on st.segment_id = s.id
where s.segment_status_id = 3


select u.id
from chainlettersstoriesschema.user u
join segment_trace st o


select * from segment_status


create or replace view availablesegmentbyuser as 
select distinct u.id as user_id, st.final_segment_id as segment_id
from 
segment_trace st
cross join
chainlettersstoriesschema.user u
where st.segment_status_id = 4
and ( select count (*) from segment_trace st2
		join segment s on st2.segment_id = s.id
		where st.final_segment_id = st2.final_segment_id and u.id = s.user_id ) = 0
and ( select count (*) from segment_trace st2
		join segment s on st2.final_segment_id = s.id
		where st.final_segment_id = st2.segment_id and u.id = s.user_id ) = 0
order by user_id, final_segment_id

-- include no id from final_segment_id that has this user_id anywhere in its past
-- include no id from the past of a final_segment_id that matches this user_id

and not exists (select count(*) from )

select * from segment s
where (select count(*) from segment_trace st
	where st.final_segment_id = s.id) = 0

-- create or replace view availablesegmentbymoderator as
select distinct st.final_segment_id, u.id 
from segment_trace st
cross join chainlettersstoriesschema.user u
where st.segment_status_id = 2
and (select count(distinct st2.final_segment_id, st2.user_id )
		from segment_trace st2
		where st.segment_status_id = 2
		and st2.final_segment_id = st.final_segment_id
		and st2.user_id = u.user_id) = 0



select distinct final_segment_id, user_id 
from segment_trace st
where st.segment_status_id = 2




select * from segment_status


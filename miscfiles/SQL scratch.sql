-- create or replace view segmenttrace as 
with recursive segmentTrace (final_segmentid, segmentid, previoussegmentid, recursiondepth) as (
	select
		s.id,
		s.id,
		s.previoussegmentid,
		1
	from segment s
	union 
	select
		st.final_segmentid,
		st.previoussegmentid,
		s2.previoussegmentid,
		st.recursiondepth + 1
	from segment s2
	join segmentTrace st on st.previoussegmentid = s2.id
)
select  
		st.final_segmentid,
		st.segmentid,
		1 + (select max(st2.recursiondepth) from segmentTrace st2 where st2.final_segmentid = st.final_segmentid) - st.recursiondepth as segmentorder,
		s.content as segmentcontent,
		s2.authorid as authorid,
		s2.segmentstatusid
		from segmentTrace st
		join segment s on st.segmentid = s.id
		join segment s2 on st.final_segmentid = s2.id
order by st.final_segmentid, segmentorder;


alter view segmenttrace
rename column "content" to "segmentcontent"

select * from segmenttrace

select * from segment

select * from story

select * from storyschema.author

delete from storysc
delete from segment

set search_path = "storyschema"


insert into segmentstatus
values (3,'available'),(4,'lockedForAddition'),(5,'deleted')

select s.id
from segment s 
where authorid = 1
and segmentstatusid = 1

select s.id as "segmentid",
concat()



insert into segment (storyid,authorid,segmentstatusid,content, previoussegmentid)
values (5, 1, 1, 'Nobody could sleep.',2)


select * from segment

select * from availablesegmentbyauthor


SELECT nextval('segment_id_seq');

insert into segment ()


select * from segment s
join segmenttrace st on st.segmentid = s.id
where s.segmentstatusid = 3


select u.id
from storyschema.author u
join segmenttrace st o


select * from segmentstatus


create or replace view availablesegmentbyauthor as 
select distinct u.id as authorid, st.final_segmentid as segmentid
from 
segmenttrace st
cross join
storyschema.author u
where st.segmentstatusid = 4
and ( select count (*) from segmenttrace st2
		join segment s on st2.segmentid = s.id
		where st.final_segmentid = st2.final_segmentid and u.id = s.authorid ) = 0
and ( select count (*) from segmenttrace st2
		join segment s on st2.final_segmentid = s.id
		where st.final_segmentid = st2.segmentid and u.id = s.authorid ) = 0
order by authorid, final_segmentid

-- include no id from final_segmentid that has this authorid anywhere in its past
-- include no id from the past of a final_segmentid that matches this authorid

and not exists (select count(*) from )

select * from segment s
where (select count(*) from segmenttrace st
	where st.final_segmentid = s.id) = 0

-- create or replace view availablesegmentbymoderator as
select distinct st.final_segmentid, u.id 
from segmenttrace st
cross join storyschema.author u
where st.segmentstatusid = 2
and (select count(distinct st2.final_segmentid, st2.authorid )
		from segmenttrace st2
		where st.segmentstatusid = 2
		and st2.final_segmentid = st.final_segmentid
		and st2.authorid = u.authorid) = 0



select distinct final_segmentid, authorid 
from segmenttrace st
where st.segmentstatusid = 2




select * from segmentstatus


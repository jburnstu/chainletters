-- create or replace view sectiontrace as 
with recursive sectionTrace (finalsectionid, sectionid, previoussectionid, recursiondepth) as (
	select
		s.id,
		s.id,
		s.previoussectionid,
		1
	from section s
	union 
	select
		st.finalsectionid,
		st.previoussectionid,
		s2.previoussectionid,
		st.recursiondepth + 1
	from section s2
	join sectionTrace st on st.previoussectionid = s2.id
)
select  
		st.finalsectionid,
		st.sectionid,
		1 + (select max(st2.recursiondepth) from sectionTrace st2 where st2.finalsectionid = st.finalsectionid) - st.recursiondepth as sectionorder,
		s.content as sectioncontent,
		s2.userid as userid,
		s2.sectionstatusid
		from sectionTrace st
		join section s on st.sectionid = s.id
		join section s2 on st.finalsectionid = s2.id
order by st.finalsectionid, sectionorder;


alter view sectiontrace
rename column "content" to "sectioncontent"

select * from sectiontrace

select * from section

select * from story

select * from storyschema.user

delete from storysc
delete from section

set search_path = "storyschema"


insert into sectionstatus
values (3,'available'),(4,'lockedForAddition'),(5,'deleted')

select s.id
from section s 
where userid = 1
and sectionstatusid = 1

select s.id as "sectionid",
concat()



insert into section (storyid,userid,sectionstatusid,content, previoussectionid)
values (5, 1, 1, 'Nobody could sleep.',2)


select * from section

select * from availablesectionbyuser


SELECT nextval('section_id_seq');

insert into section ()


select * from section s
join sectiontrace st on st.sectionid = s.id
where s.sectionstatusid = 3


select u.id
from storyschema.user u
join sectiontrace st o


select * from sectionstatus


create or replace view availablesectionbyuser as 
select distinct u.id as userid, st.finalsectionid as sectionid
from 
sectiontrace st
cross join
storyschema.user u
where st.sectionstatusid = 4
and ( select count (*) from sectiontrace st2
		join section s on st2.sectionid = s.id
		where st.finalsectionid = st2.finalsectionid and u.id = s.userid ) = 0
and ( select count (*) from sectiontrace st2
		join section s on st2.finalsectionid = s.id
		where st.finalsectionid = st2.sectionid and u.id = s.userid ) = 0
order by userid, finalsectionid

-- include no id from finalsectionid that has this userid anywhere in its past
-- include no id from the past of a finalsectionid that matches this userid

and not exists (select count(*) from )

select * from section s
where (select count(*) from sectiontrace st
	where st.finalsectionid = s.id) = 0

-- create or replace view availablesectionbymoderator as
select distinct st.finalsectionid, u.id 
from sectiontrace st
cross join storyschema.user u
where st.sectionstatusid = 2
and (select count(distinct st2.finalsectionid, st2.userid )
		from sectiontrace st2
		where st.sectionstatusid = 2
		and st2.finalsectionid = st.finalsectionid
		and st2.userid = u.userid) = 0



select distinct finalsectionid, userid 
from sectiontrace st
where st.sectionstatusid = 2




select * from sectionstatus


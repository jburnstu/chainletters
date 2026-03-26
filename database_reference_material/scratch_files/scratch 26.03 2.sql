set search_path = "chainlettersstoriesschema"


select * from chainlettersstoriesschema.author_relation

select * from chainlettersstoriesschema.moderation_assignment

insert into chainlettersstoriesschema.author_relation_type 
values (1 , 'follows'


select count(ar.related_author_id), ar.related_author_id
from author_relation ar
group by ar.related_author_id
order by count desc, ar.related_author_id

select count(ar.author_id), ar.author_id
from author_relation ar
group by ar.author_id
order by count desc, ar.author_id


select * from author_relation
order by author_id
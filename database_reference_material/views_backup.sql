-- SQL Queries for creating the views used by the app
-- Each of these is represented by a "Model" in Django, and accessed (directly or indirectly) through the DRF API.

CREATE VIEW chainlettersstoriesschema.segment_trace AS
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
            (r_1.recursion_depth + 1)
           FROM (chainlettersstoriesschema.segment s2_1
             JOIN r r_1 ON (((r_1.story_id = s2_1.story_id) AND (r_1.previous_segment_id = s2_1.id))))
        )
 SELECT r.final_segment_id,
    r.segment_id AS earlier_segment_id,
    ((1 + ( SELECT max(r2.recursion_depth) AS max
           FROM r r2
          WHERE (r2.final_segment_id = r.final_segment_id))) - r.recursion_depth) AS earlier_segment_order,
    s.content AS earlier_segment_content,
    s2.author_id AS final_author_id,
    s2.segment_status_id AS final_segment_status_id,
    r.story_id,
    s.author_id AS earlier_segment_author_id
   FROM ((r
     JOIN chainlettersstoriesschema.segment s ON ((r.segment_id = s.id)))
     JOIN chainlettersstoriesschema.segment s2 ON ((r.final_segment_id = s2.id)))
  ORDER BY r.final_segment_id, ((1 + ( SELECT max(r2.recursion_depth) AS max
           FROM r r2
          WHERE (r2.final_segment_id = r.final_segment_id))) - r.recursion_depth);


--
-- TOC entry 300 (class 1259 OID 26374)
-- Name: available_segment_by_author; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.available_segment_by_author AS
 SELECT a.id AS author_id,
    s.id AS segment_id
   FROM (chainlettersstoriesschema.author a
     CROSS JOIN chainlettersstoriesschema.segment s)
  WHERE ((s.segment_status_id = 4) AND (NOT (EXISTS ( SELECT 1
           FROM (chainlettersstoriesschema.segment_trace st
             JOIN chainlettersstoriesschema.segment s2 ON ((st.earlier_segment_id = s2.id)))
          WHERE ((s2.author_id = a.id) AND (st.final_segment_id = s.id))))))
  ORDER BY a.id, s.id;


--
-- TOC entry 316 (class 1259 OID 27284)
-- Name: segment_comment_by_segment; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.segment_comment_by_segment AS
 SELECT s.id AS segment_id,
    sc.comment_id,
    c.author_id,
    c.text_content
   FROM ((chainlettersstoriesschema.segment s
     JOIN chainlettersstoriesschema.segment_comment sc ON ((sc.parent_segment_id = s.id)))
     JOIN chainlettersstoriesschema.comment c ON ((c.id = sc.comment_id)));


--
-- TOC entry 317 (class 1259 OID 27288)
-- Name: comment_comment_by_comment; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.comment_comment_by_comment AS
 SELECT scbs.segment_id,
    scbs.comment_id,
    cc.comment_id AS child_comment_id,
    c.author_id,
    c.text_content
   FROM ((chainlettersstoriesschema.segment_comment_by_segment scbs
     JOIN chainlettersstoriesschema.comment_comment cc ON ((cc.parent_comment_id = scbs.comment_id)))
     JOIN chainlettersstoriesschema.comment c ON ((c.id = cc.comment_id)));


--
-- TOC entry 318 (class 1259 OID 27292)
-- Name: comment_comment_by_segment; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.comment_comment_by_segment AS
 SELECT scbs.comment_id,
    cc.comment_id AS child_comment_id,
    c.author_id,
    c.text_content
   FROM ((chainlettersstoriesschema.segment_comment_by_segment scbs
     JOIN chainlettersstoriesschema.comment_comment cc ON ((cc.parent_comment_id = scbs.comment_id)))
     JOIN chainlettersstoriesschema.comment c ON ((c.id = cc.comment_id)));


--
-- TOC entry 301 (class 1259 OID 26379)
-- Name: moderatable_segment_by_author; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.moderatable_segment_by_author AS
 SELECT a.id AS author_id,
    s.id AS segment_id
   FROM (chainlettersstoriesschema.author a
     CROSS JOIN chainlettersstoriesschema.segment s)
  WHERE ((s.segment_status_id = 2) AND (s.author_id <> a.id));


--
-- TOC entry 319 (class 1259 OID 27296)
-- Name: segment_comment_comment_by_comment; Type: VIEW; Schema: chainlettersstoriesschema; Owner: -
--

CREATE VIEW chainlettersstoriesschema.segment_comment_comment_by_comment AS
 SELECT scbs.comment_id,
    cc.comment_id AS child_comment_id,
    c.author_id,
    c.text_content
   FROM ((chainlettersstoriesschema.segment_comment_by_segment scbs
     JOIN chainlettersstoriesschema.comment_comment cc ON ((cc.parent_comment_id = scbs.comment_id)))
     JOIN chainlettersstoriesschema.comment c ON ((c.id = cc.comment_id)));

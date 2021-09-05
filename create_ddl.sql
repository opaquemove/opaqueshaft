--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: opaque
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO opaque;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: opaque
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.accounts (
    acc_id character varying(64) NOT NULL,
    acc_name character varying(64),
    password character varying(64),
    range_id integer
);


ALTER TABLE public.accounts OWNER TO opaque;

--
-- Name: children; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.children (
    child_id integer NOT NULL,
    child_name character varying(64),
    child_grade integer,
    child_type character(1),
    kana character varying(64),
    imagefile character varying(64),
    range_id integer,
    remark text
);


ALTER TABLE public.children OWNER TO opaque;

--
-- Name: children2_child_id_seq; Type: SEQUENCE; Schema: public; Owner: opaque
--

CREATE SEQUENCE public.children2_child_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.children2_child_id_seq OWNER TO opaque;

--
-- Name: children2_child_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: opaque
--

ALTER SEQUENCE public.children2_child_id_seq OWNED BY public.children.child_id;


--
-- Name: ranges; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.ranges (
    range_id integer NOT NULL,
    sotd date,
    eotd date
);


ALTER TABLE public.ranges OWNER TO opaque;

--
-- Name: reserves; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.reserves (
    reserve_id integer NOT NULL,
    day date,
    sott time without time zone,
    eott time without time zone,
    child_id integer,
    escort integer,
    remark text
);


ALTER TABLE public.reserves OWNER TO opaque;

--
-- Name: reserves2_reserve_id_seq; Type: SEQUENCE; Schema: public; Owner: opaque
--

CREATE SEQUENCE public.reserves2_reserve_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reserves2_reserve_id_seq OWNER TO opaque;

--
-- Name: reserves2_reserve_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: opaque
--

ALTER SEQUENCE public.reserves2_reserve_id_seq OWNED BY public.reserves.reserve_id;


--
-- Name: results; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.results (
    result_id integer NOT NULL,
    child_id integer,
    day date,
    checkin time without time zone,
    checkout time without time zone,
    absent integer,
    remark text,
    escort integer,
    direction character varying(6),
    lastupdate timestamp without time zone,
    child_name character varying(64),
    child_grade integer,
    child_type character(1),
    acc_id character varying(64),
    estimate time without time zone,
    coordi_top integer,
    coordi_left numeric(5,2),
    kana character varying(64)
);


ALTER TABLE public.results OWNER TO opaque;

--
-- Name: results2_result_id_seq; Type: SEQUENCE; Schema: public; Owner: opaque
--

CREATE SEQUENCE public.results2_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.results2_result_id_seq OWNER TO opaque;

--
-- Name: results2_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: opaque
--

ALTER SEQUENCE public.results2_result_id_seq OWNED BY public.results.result_id;


--
-- Name: whiteboards; Type: TABLE; Schema: public; Owner: opaque
--

CREATE TABLE public.whiteboards (
    whiteboard_id integer NOT NULL,
    day date NOT NULL,
    whiteboard text,
    whiteboard_absent text,
    lastupdate timestamp without time zone,
    description text
);


ALTER TABLE public.whiteboards OWNER TO opaque;

--
-- Name: whiteboards_whiteboard_id_seq; Type: SEQUENCE; Schema: public; Owner: opaque
--

CREATE SEQUENCE public.whiteboards_whiteboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.whiteboards_whiteboard_id_seq OWNER TO opaque;

--
-- Name: whiteboards_whiteboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: opaque
--

ALTER SEQUENCE public.whiteboards_whiteboard_id_seq OWNED BY public.whiteboards.whiteboard_id;


--
-- Name: children child_id; Type: DEFAULT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.children ALTER COLUMN child_id SET DEFAULT nextval('public.children2_child_id_seq'::regclass);


--
-- Name: reserves reserve_id; Type: DEFAULT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.reserves ALTER COLUMN reserve_id SET DEFAULT nextval('public.reserves2_reserve_id_seq'::regclass);


--
-- Name: results result_id; Type: DEFAULT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.results ALTER COLUMN result_id SET DEFAULT nextval('public.results2_result_id_seq'::regclass);


--
-- Name: whiteboards whiteboard_id; Type: DEFAULT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.whiteboards ALTER COLUMN whiteboard_id SET DEFAULT nextval('public.whiteboards_whiteboard_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (acc_id);


--
-- Name: children children2_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children2_pkey PRIMARY KEY (child_id);


--
-- Name: ranges ranges_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.ranges
    ADD CONSTRAINT ranges_pkey PRIMARY KEY (range_id);


--
-- Name: reserves reserves2_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.reserves
    ADD CONSTRAINT reserves2_pkey PRIMARY KEY (reserve_id);


--
-- Name: results results2_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results2_pkey PRIMARY KEY (result_id);


--
-- Name: whiteboards whiteboards_pkey; Type: CONSTRAINT; Schema: public; Owner: opaque
--

ALTER TABLE ONLY public.whiteboards
    ADD CONSTRAINT whiteboards_pkey PRIMARY KEY (whiteboard_id);


--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: emojis; Type: TABLE; Schema: public; 
--

CREATE TABLE public.emojis (
    name text NOT NULL,
    image text NOT NULL
);

--
-- Data for Name: emojis; Type: TABLE DATA; Schema: public; 
--

COPY public.emojis (name, image) FROM stdin;
oncewow	https://cdn.discordapp.com/attachments/143248520621719552/558373553062281238/oncewow.png
\.


--
-- Name: emojis emojis_pkey; Type: CONSTRAINT; Schema: public; 
--

ALTER TABLE ONLY public.emojis
    ADD CONSTRAINT emojis_pkey PRIMARY KEY (name);


--
-- PostgreSQL database dump complete
--


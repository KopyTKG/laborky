--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-13 15:31:57 CEST

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
-- TOC entry 3407 (class 1262 OID 16384)
-- Name: railway; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE railway WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE railway OWNER TO postgres;

\connect railway

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16385)
-- Name: historie_terminu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historie_terminu (
    id uuid NOT NULL,
    student_id character(40),
    termin_id uuid,
    datum_splneni timestamp without time zone
);


ALTER TABLE public.historie_terminu OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16388)
-- Name: predmet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predmet (
    kod_predmetu text NOT NULL,
    zkratka_predmetu text,
    katedra text,
    pocet_cviceni integer
);


ALTER TABLE public.predmet OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16393)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id character(40) NOT NULL,
    datum_vytvoreni timestamp without time zone NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16396)
-- Name: termin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.termin (
    id uuid NOT NULL,
    ucebna text,
    datum_start timestamp without time zone,
    aktualni_kapacita integer,
    max_kapacita integer,
    vypsal_id character(40) NOT NULL,
    vyucuje_id character(40) NOT NULL,
    kod_predmet text NOT NULL,
    jmeno text,
    cislo_cviceni integer,
    datum_konec timestamp without time zone,
    popis text
);


ALTER TABLE public.termin OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16401)
-- Name: vyucujici; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vyucujici (
    id character(40) NOT NULL
);


ALTER TABLE public.vyucujici OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16404)
-- Name: vyucujici_predmety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vyucujici_predmety (
    vyucujici_id character varying(40),
    kod_predmetu text,
    id integer NOT NULL
);


ALTER TABLE public.vyucujici_predmety OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16409)
-- Name: vyucujici_predmety_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vyucujici_predmety_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vyucujici_predmety_id_seq OWNER TO postgres;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 221
-- Name: vyucujici_predmety_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vyucujici_predmety_id_seq OWNED BY public.vyucujici_predmety.id;


--
-- TOC entry 222 (class 1259 OID 16410)
-- Name: zapsane_predmety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zapsane_predmety (
    id uuid NOT NULL,
    student_id character(40) NOT NULL,
    kod_predmet text NOT NULL
);


ALTER TABLE public.zapsane_predmety OWNER TO postgres;

--
-- TOC entry 3227 (class 2604 OID 16415)
-- Name: vyucujici_predmety id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety ALTER COLUMN id SET DEFAULT nextval('public.vyucujici_predmety_id_seq'::regclass);


--
-- TOC entry 3394 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: historie_terminu; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3395 (class 0 OID 16388)
-- Dependencies: 216
-- Data for Name: predmet; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3396 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3397 (class 0 OID 16396)
-- Dependencies: 218
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3398 (class 0 OID 16401)
-- Dependencies: 219
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3399 (class 0 OID 16404)
-- Dependencies: 220
-- Data for Name: vyucujici_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3401 (class 0 OID 16410)
-- Dependencies: 222
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 221
-- Name: vyucujici_predmety_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vyucujici_predmety_id_seq', 49, true);


--
-- TOC entry 3229 (class 2606 OID 16417)
-- Name: historie_terminu historie_terminu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT historie_terminu_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 16419)
-- Name: predmet predmet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT predmet_pkey PRIMARY KEY (kod_predmetu);


--
-- TOC entry 3233 (class 2606 OID 16421)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 16423)
-- Name: termin terminy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT terminy_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 16425)
-- Name: vyucujici vyucujici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici
    ADD CONSTRAINT vyucujici_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 16427)
-- Name: vyucujici_predmety vyucujici_predmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 16429)
-- Name: zapsane_predmety zapsanepredmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT zapsanepredmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 16430)
-- Name: termin fk_kod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3249 (class 2606 OID 16435)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3250 (class 2606 OID 16440)
-- Name: zapsane_predmety fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3242 (class 2606 OID 16445)
-- Name: historie_terminu fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- TOC entry 3245 (class 2606 OID 16450)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3243 (class 2606 OID 16455)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON DELETE CASCADE;


--
-- TOC entry 3246 (class 2606 OID 16460)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3247 (class 2606 OID 16465)
-- Name: vyucujici_predmety vyucujici_predmety_kod_predmetu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_kod_predmetu_fkey FOREIGN KEY (kod_predmetu) REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE;


--
-- TOC entry 3248 (class 2606 OID 16470)
-- Name: vyucujici_predmety vyucujici_predmety_vyucujici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_vyucujici_id_fkey FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id) ON DELETE CASCADE;


-- Completed on 2024-10-13 15:31:57 CEST

--
-- PostgreSQL database dump complete
--


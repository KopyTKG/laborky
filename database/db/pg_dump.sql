--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-05 13:28:48 CEST

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
-- TOC entry 3396 (class 1262 OID 16384)
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
-- TOC entry 3397 (class 0 OID 0)
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
    student_id character(40) NOT NULL,
    termin_id uuid NOT NULL,
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
    vyucujici_id character(40) NOT NULL,
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
    popis text,
    cislo_cviceni integer,
    datum_konec timestamp without time zone
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
-- Name: zapsane_predmety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zapsane_predmety (
    id uuid NOT NULL,
    zapsano timestamp without time zone,
    student_id character(40) NOT NULL,
    kod_predmet text NOT NULL
);


ALTER TABLE public.zapsane_predmety OWNER TO postgres;

--
-- TOC entry 3385 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: historie_terminu; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3386 (class 0 OID 16388)
-- Dependencies: 216
-- Data for Name: predmet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.predmet VALUES ('ROOT', 'Aktivita', 'Volná', '577c9662b393f96deddfd02dfc50650e0916926b', 0);
INSERT INTO public.predmet VALUES (' KFIPRHN ', 'PRHN', 'KFI', '1f92a11172f3109d2529461a19e49dbace23fb32', 2);


--
-- TOC entry 3387 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3388 (class 0 OID 16396)
-- Dependencies: 218
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3389 (class 0 OID 16401)
-- Dependencies: 219
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici VALUES ('577c9662b393f96deddfd02dfc50650e0916926b');
INSERT INTO public.vyucujici VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32');


--
-- TOC entry 3390 (class 0 OID 16404)
-- Dependencies: 220
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3223 (class 2606 OID 16410)
-- Name: historie_terminu historie_terminu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT historie_terminu_pkey PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 16412)
-- Name: predmet predmet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT predmet_pkey PRIMARY KEY (kod_predmetu);


--
-- TOC entry 3227 (class 2606 OID 16414)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 16416)
-- Name: termin terminy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT terminy_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 16418)
-- Name: vyucujici vyucujici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici
    ADD CONSTRAINT vyucujici_pkey PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 16420)
-- Name: zapsane_predmety zapsanepredmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT zapsanepredmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 16421)
-- Name: termin fk_kod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE;


--
-- TOC entry 3240 (class 2606 OID 16426)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE;


--
-- TOC entry 3241 (class 2606 OID 16431)
-- Name: zapsane_predmety fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3234 (class 2606 OID 16436)
-- Name: historie_terminu fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3235 (class 2606 OID 16441)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON DELETE CASCADE;


--
-- TOC entry 3238 (class 2606 OID 16446)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id) ON DELETE CASCADE;


--
-- TOC entry 3236 (class 2606 OID 16451)
-- Name: predmet fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id) ON DELETE CASCADE;


--
-- TOC entry 3239 (class 2606 OID 16456)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id) ON DELETE CASCADE;


-- Completed on 2024-10-05 13:28:48 CEST

--
-- PostgreSQL database dump complete
--


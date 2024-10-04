--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-04 19:51:42 CEST

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

INSERT INTO public.historie_terminu VALUES ('a4278566-8961-4a84-a808-093dd061b372', '0d162f64-61dd-446d-a3e2-404a994e9a9f    ', 'ea295562-4eed-4396-af57-f483115bedbd', NULL);
INSERT INTO public.historie_terminu VALUES ('fd7830e2-c4fa-4160-8264-17912e3efe48', '0d162f64-61dd-446d-a3e2-404a994e9a9f    ', '65bb47c4-b7a0-4716-a0ae-8e45894ed39a', NULL);
INSERT INTO public.historie_terminu VALUES ('3a3c6f6b-dc36-4ef4-969c-f4c7bd709f66', '4a71df77a1acbbe459be5cca49038fece4f49a6f', '26a60f78-fa04-45d3-87be-953752e5054f', '2024-09-30 22:45:20.163');
INSERT INTO public.historie_terminu VALUES ('838b99cd-7d1f-41fb-ab83-641563fcab53', '2ef1dbfa3c6e2084cc34313bb50a40853f82bdfc', '6922a4be-6053-4fcc-9edb-e5417119b6b1', NULL);


--
-- TOC entry 3386 (class 0 OID 16388)
-- Dependencies: 216
-- Data for Name: predmet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.predmet VALUES ('CS102', 'CS102', 'Informatics', 'bf750282-e6ef-4769-bde4-65f116a7cc2b    ', NULL);
INSERT INTO public.predmet VALUES ('CS101', 'CS101', 'Informatics', '10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    ', 2);
INSERT INTO public.predmet VALUES ('MATH202', 'MATH202', 'Mathematics', '6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    ', 3);
INSERT INTO public.predmet VALUES ('KIPCA', 'PCA', 'KI', '1f92a11172f3109d2529461a19e49dbace23fb32', 3);
INSERT INTO public.predmet VALUES ('KPPPO2R', 'PO2R', 'KPP', '1f92a11172f3109d2529461a19e49dbace23fb32', 2);
INSERT INTO public.predmet VALUES ('KMPMPS1', 'MPS1', 'KMP', '1f92a11172f3109d2529461a19e49dbace23fb32', 4);
INSERT INTO public.predmet VALUES ('KSRSTP', 'STP', 'KSR', '17a2bc3db091388b150a652a90623558ca7ee8ea', 1);
INSERT INTO public.predmet VALUES ('KFEOBP', 'OBP', 'KFE', 'a3b644c7413985be43e9e27c98bf8d46e95bbf44', 2);
INSERT INTO public.predmet VALUES ('KFEADJ', 'ADJ', 'KFE', '1f92a11172f3109d2529461a19e49dbace23fb32', 4);
INSERT INTO public.predmet VALUES ('KMOMMT', 'MMT', 'KMO', '1f92a11172f3109d2529461a19e49dbace23fb32', 5);


--
-- TOC entry 3387 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES ('5554da30-325d-4da0-b43c-079d56f990c7    ', '2024-09-28 20:27:57.093952');
INSERT INTO public.student VALUES ('d423e661-e43e-4fee-913c-8218394fa545    ', '2024-09-28 20:32:49.683885');
INSERT INTO public.student VALUES ('0d162f64-61dd-446d-a3e2-404a994e9a9f    ', '2024-09-28 20:32:49.683885');
INSERT INTO public.student VALUES ('4a71df77a1acbbe459be5cca49038fece4f49a6f', '2024-09-30 23:12:40.426546');
INSERT INTO public.student VALUES ('e2fe775cb0c5578b2ed64dfd73be9acb5ad2e123', '2024-10-02 14:45:00.013458');
INSERT INTO public.student VALUES ('72d93dcb44c56fc46f98921ee8e8299eeb112443', '2024-10-03 17:05:58.522309');
INSERT INTO public.student VALUES ('60755d0b951b482d35100bebdf9185c7cdbdc772', '2024-10-03 17:07:41.461032');
INSERT INTO public.student VALUES ('cfb3a9b4dbbcf26aa874dcf64709eb41eaa97217', '2024-10-03 18:14:17.13704');
INSERT INTO public.student VALUES ('2ef1dbfa3c6e2084cc34313bb50a40853f82bdfc', '2024-10-04 15:48:11.879294');


--
-- TOC entry 3388 (class 0 OID 16396)
-- Dependencies: 218
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.termin VALUES ('6922a4be-6053-4fcc-9edb-e5417119b6b1', 'Room 200', '2024-10-07 14:00:00', 1, 20, '1f92a11172f3109d2529461a19e49dbace23fb32', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMOMMT', 'KMO/MMT','', 3, '2024-10-07 16:00:00');
INSERT INTO public.termin VALUES ('26a60f78-fa04-45d3-87be-953752e5054f', '202', '2024-11-06 14:00:00', 193, 200, '17a2bc3db091388b150a652a90623558ca7ee8ea', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 1, '2024-11-06 16:00:00');
INSERT INTO public.termin VALUES ('f3caa750-e3df-4673-9e88-bce7c3a216b0', '201', '2024-11-04 14:00:00', 12, 15, '17a2bc3db091388b150a652a90623558ca7ee8ea', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 2, '2024-11-04 16:00:00');
INSERT INTO public.termin VALUES ('6922a4be-6053-4fcc-9edb-e5417119b6bb', 'Room 200', '2024-11-07 14:00:00', 16, 20, '1f92a11172f3109d2529461a19e49dbace23fb32', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 3, '2024-11-07 16:00:00');
INSERT INTO public.termin VALUES ('65bb47c4-b7a0-4716-a0ae-8e45894ed39a', 'pp poo poo', '2024-10-06 14:00:00', 2, 42, '1f92a11172f3109d2529461a19e49dbace23fb32', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 2, '2024-10-06 16:00:00');
INSERT INTO public.termin VALUES ('ea295562-4eed-4396-af57-f483115bedbd', 'R2D2', '2024-10-03 14:00:00', 2, 40, '1f92a11172f3109d2529461a19e49dbace23fb32', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 1, '2024-10-03 16:00:00');
INSERT INTO public.termin VALUES ('3b8a9caf-d7cd-4585-ae35-299d486f6a85', 'R2D2', '2024-11-07 14:00:00', 0, 5, '1f92a11172f3109d2529461a19e49dbace23fb32', '1f92a11172f3109d2529461a19e49dbace23fb32', 'KMPMPS1', 'KMP/MPS1','', 1, '2024-11-07 16:00:00');


--
-- TOC entry 3389 (class 0 OID 16401)
-- Dependencies: 219
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici VALUES ('10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    ');
INSERT INTO public.vyucujici VALUES ('bf750282-e6ef-4769-bde4-65f116a7cc2b    ');
INSERT INTO public.vyucujici VALUES ('6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    ');
INSERT INTO public.vyucujici VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32');
INSERT INTO public.vyucujici VALUES ('17a2bc3db091388b150a652a90623558ca7ee8ea');
INSERT INTO public.vyucujici VALUES ('a3b644c7413985be43e9e27c98bf8d46e95bbf44');
INSERT INTO public.vyucujici VALUES ('43a635bae4e50471c41f874f5cf02a136706c60e');


--
-- TOC entry 3390 (class 0 OID 16404)
-- Dependencies: 220
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.zapsane_predmety VALUES ('f979e45c-ad7f-47bd-9385-767107098e4c', '2024-09-28 20:27:57.093952', '5554da30-325d-4da0-b43c-079d56f990c7    ', 'CS101');
INSERT INTO public.zapsane_predmety VALUES ('cd9765dc-96b7-418d-a9a4-ef6623612e6d', '2024-09-28 20:32:49.683885', 'd423e661-e43e-4fee-913c-8218394fa545    ', 'CS102');
INSERT INTO public.zapsane_predmety VALUES ('2118702d-df8b-4b03-83ed-6b62c8449b67', '2024-09-28 20:32:49.683885', '0d162f64-61dd-446d-a3e2-404a994e9a9f    ', 'MATH202');
INSERT INTO public.zapsane_predmety VALUES ('9998702d-df8b-4b03-83ed-6b62c8449b67', '2024-09-29 20:32:49.683885', '4a71df77a1acbbe459be5cca49038fece4f49a6f', 'KMPMPS1');


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
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3240 (class 2606 OID 16426)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


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
-- TOC entry 3238 (class 2606 OID 16441)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3235 (class 2606 OID 16446)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON DELETE CASCADE;


--
-- TOC entry 3236 (class 2606 OID 16451)
-- Name: predmet fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3239 (class 2606 OID 16456)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id);


-- Completed on 2024-10-04 19:51:42 CEST

--
-- PostgreSQL database dump complete
--


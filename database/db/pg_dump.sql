--
-- PostgreSQL database cluster dump
--

-- Started on 2024-10-04 10:18:25 CEST

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;


--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-04 10:18:26 CEST

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

-- Completed on 2024-10-04 10:18:39 CEST

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-04 10:18:39 CEST

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

-- Completed on 2024-10-04 10:18:53 CEST

--
-- PostgreSQL database dump complete
--

--
-- Database "railway" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-04 10:18:53 CEST

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16420)
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
-- TOC entry 216 (class 1259 OID 16394)
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
-- TOC entry 215 (class 1259 OID 16389)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id character(40) NOT NULL,
    datum_vytvoreni timestamp without time zone NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16401)
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
    datum_konec timestamp without time zone
);


ALTER TABLE public.termin OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16408)
-- Name: vyucujici; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vyucujici (
    id character(40) NOT NULL
);


ALTER TABLE public.vyucujici OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16415)
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
-- TOC entry 3390 (class 0 OID 16420)
-- Dependencies: 220
-- Data for Name: historie_terminu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historie_terminu (id, student_id, termin_id, datum_splneni) FROM stdin;
cb696670-6d69-4c10-9a5d-caf004e4b6ef	0d162f64-61dd-446d-a3e2-404a994e9a9f    	8d92a4b5-adca-40cc-aa10-74727ea3cc49	\N
25f7fc8a-8922-456b-9ce2-f91c67d42d12	5554da30-325d-4da0-b43c-079d56f990c7    	665cb766-1460-439b-bfad-bfef63a3fd24	2024-09-27 12:13:20.868051
1235e123-ecdd-40a0-83e9-3ad1faa5ec0c	5554da30-325d-4da0-b43c-079d56f990c7    	6882d71a-42ab-4fb8-8134-87a72982dd42	2024-09-30 15:33:20.868051
8877e123-ecdd-40a0-83e9-3ad1faa5ec0c	5554da30-325d-4da0-b43c-079d56f990c7    	993cb766-1460-439b-bfad-bfef63a3fd24	2024-09-17 10:43:20.868051
93913f7d-3660-473d-9670-6c13dfa530e3	0d162f64-61dd-446d-a3e2-404a994e9a9f    	f431944a-eb16-402f-81ee-47d72699d947	\N
4be67b89-5e22-4678-b755-438c7bc3a9d4	d423e661-e43e-4fee-913c-8218394fa545    	f431944a-eb16-402f-81ee-47d72699d947	2024-09-30 22:45:20.163015
a4278566-8961-4a84-a808-093dd061b372	0d162f64-61dd-446d-a3e2-404a994e9a9f    	ea295562-4eed-4396-af57-f483115bedbd	\N
fd7830e2-c4fa-4160-8264-17912e3efe48	0d162f64-61dd-446d-a3e2-404a994e9a9f    	65bb47c4-b7a0-4716-a0ae-8e45894ed39a	\N
08395c9a-c4e1-42c7-80ff-135b45f7c665	72d93dcb44c56fc46f98921ee8e8299eeb112443	561d723d-60a7-49b1-8dd4-19addd5651e8	\N
4e1a9bb7-e689-4a46-935d-8e25a5cf86dd	72d93dcb44c56fc46f98921ee8e8299eeb112443	561d723d-60a7-49b1-8dd4-19addd5651e8	\N
506bc922-bc84-456e-ba78-4cdf6d506bbb	60755d0b951b482d35100bebdf9185c7cdbdc772	7a2f40e8-ab61-4911-99cd-8cf7b0d0065b	\N
3a3c6f6b-dc36-4ef4-969c-f4c7bd709f66	4a71df77a1acbbe459be5cca49038fece4f49a6f	26a60f78-fa04-45d3-87be-953752e5054f	2024-09-30 22:45:20.163
af713d82-a50e-4f91-b418-7b8878952622	4a71df77a1acbbe459be5cca49038fece4f49a6f	9820910e-cb2a-435c-8dec-3852aaac0af8	\N
\.


--
-- TOC entry 3386 (class 0 OID 16394)
-- Dependencies: 216
-- Data for Name: predmet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.predmet (kod_predmetu, zkratka_predmetu, katedra, vyucujici_id, pocet_cviceni) FROM stdin;
CS102	CS102	Informatics	bf750282-e6ef-4769-bde4-65f116a7cc2b    	\N
CS101	CS101	Informatics	10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    	2
MATH202	MATH202	Mathematics	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	3
KIPCA	PCA	KI	1f92a11172f3109d2529461a19e49dbace23fb32	3
KPPPO2R	PO2R	KPP	1f92a11172f3109d2529461a19e49dbace23fb32	2
KMPMPS1	MPS1	KMP	1f92a11172f3109d2529461a19e49dbace23fb32	4
KSRSTP	STP	KSR	17a2bc3db091388b150a652a90623558ca7ee8ea	1
KFEOBP	OBP	KFE	a3b644c7413985be43e9e27c98bf8d46e95bbf44	2
KFEADJ	ADJ	KFE	1f92a11172f3109d2529461a19e49dbace23fb32	4
\.


--
-- TOC entry 3385 (class 0 OID 16389)
-- Dependencies: 215
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, datum_vytvoreni) FROM stdin;
5554da30-325d-4da0-b43c-079d56f990c7    	2024-09-28 20:27:57.093952
d423e661-e43e-4fee-913c-8218394fa545    	2024-09-28 20:32:49.683885
0d162f64-61dd-446d-a3e2-404a994e9a9f    	2024-09-28 20:32:49.683885
4a71df77a1acbbe459be5cca49038fece4f49a6f	2024-09-30 23:12:40.426546
e2fe775cb0c5578b2ed64dfd73be9acb5ad2e123	2024-10-02 14:45:00.013458
72d93dcb44c56fc46f98921ee8e8299eeb112443	2024-10-03 17:05:58.522309
60755d0b951b482d35100bebdf9185c7cdbdc772	2024-10-03 17:07:41.461032
cfb3a9b4dbbcf26aa874dcf64709eb41eaa97217	2024-10-03 18:14:17.13704
\.


--
-- TOC entry 3387 (class 0 OID 16401)
-- Dependencies: 217
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.termin (id, ucebna, datum_start, aktualni_kapacita, max_kapacita, vypsal_id, vyucuje_id, kod_predmet, jmeno, cislo_cviceni, datum_konec) FROM stdin;
f431944a-eb16-402f-81ee-47d72699d947	Pepovo Díra	2023-09-17 09:00:00	14	69	bf750282-e6ef-4769-bde4-65f116a7cc2b    	bf750282-e6ef-4769-bde4-65f116a7cc2b    	CS102	penis	3	2023-09-17 11:00:00
561d723d-60a7-49b1-8dd4-19addd5651e8	ucebna	2024-10-09 18:00:00	4	5	a3b644c7413985be43e9e27c98bf8d46e95bbf44	a3b644c7413985be43e9e27c98bf8d46e95bbf44	KFEOBP	Cviceni pro dva studenty - 1	1	2024-10-09 19:00:00
18c4f82d-d8cf-4402-a6b4-3d2312d72d91	neco	2023-10-07 14:00:00	0	12	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KPPPO2R	cviko	1	2023-10-07 16:00:00
0132a4be-6053-4fcc-9edb-e5417119b6bb	Something	2023-10-07 14:00:00	0	12	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	pokus_numero_duo	1	2023-10-07 16:00:00
7a2f40e8-ab61-4911-99cd-8cf7b0d0065b	ucebna numero duo	2024-10-10 01:00:00	1	5	a3b644c7413985be43e9e27c98bf8d46e95bbf44	a3b644c7413985be43e9e27c98bf8d46e95bbf44	KFEOBP	Cviceni pro dva studenty - 2	2	2024-10-10 02:00:00
26a60f78-fa04-45d3-87be-953752e5054f	202	2024-11-06 14:00:00	193	200	17a2bc3db091388b150a652a90623558ca7ee8ea	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	Matematika 1	1	2024-11-06 16:00:00
f3caa750-e3df-4673-9e88-bce7c3a216b0	201	2024-11-04 14:00:00	12	15	17a2bc3db091388b150a652a90623558ca7ee8ea	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	Matematika 2	2	2024-11-04 16:00:00
6922a4be-6053-4fcc-9edb-e5417119b6bb	Room 200	2024-11-07 14:00:00	16	20	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	Matematika 3	3	2024-11-07 16:00:00
65bb47c4-b7a0-4716-a0ae-8e45894ed39a	pp poo poo	2024-10-06 14:00:00	2	42	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	something something	2	2024-10-06 16:00:00
665cb766-1460-439b-bfad-bfef63a3fd24	Room 101	2024-09-28 20:27:57.093952	10	20	10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    	10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    	CS101	Introduction to Programming	2	2024-09-28 22:27:57.093
9820910e-cb2a-435c-8dec-3852aaac0af8	K-1.01	2024-10-08 14:00:00	1	10	17a2bc3db091388b150a652a90623558ca7ee8ea	17a2bc3db091388b150a652a90623558ca7ee8ea	KSRSTP	test emailu	1	2024-10-08 14:00:02
6882d71a-42ab-4fb8-8134-87a72982dd42	6.13	2024-09-29 15:33:20.868051	0	30	10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    	10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    	CS101	Object oriented programming principles	1	2024-09-29 17:33:20.868
8d92a4b5-adca-40cc-aa10-74727ea3cc49	Room 204	2023-10-07 14:00:00	18	25	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	MATH202	Linear Algebra	1	2023-10-07 16:00:00
123cb766-1460-439b-bfad-bfef63a3fd24	Room 200	2025-09-29 15:33:20.868051	12	15	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	MATH202	Zabavny pocty	2	2025-09-29 17:33:20.868
993cb766-1460-439b-bfad-bfef63a3fd24	Room 150	2025-10-29 15:33:20.868051	9	10	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	MATH202	Diferencialni srance	3	2025-10-29 17:33:20.868
2d515ead-8710-44c1-9270-a53ff973fffb	C-6.11	2024-09-28 20:27:57.093952	0	12	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KIPCA	Bilkova	\N	2024-09-28 22:27:57.093
354edb94-2407-4373-8fb9-3a989e7335f2	C-6.11	2024-09-28 20:27:57.093952	0	12	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KIPCA	Bilkova	\N	2024-09-28 22:27:57.093
66e20037-339b-4d27-ae00-d5f2e4aec3b3	Alexova Díra	2024-10-03 14:00:00	0	69	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KIPCA	Prozkoumávání	1	2024-10-03 16:00:00
bd535593-4b99-4c33-8897-7b966c84df33	FZS protoze proc ne	2024-10-05 14:00:00	0	420	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KIPCA	Bilkova nemá ráda leg day	2	2024-10-05 16:00:00
4f5bead8-f268-434c-8911-05ba700dc241	Strekovska Kavarna	2024-10-10 14:00:00	0	404	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KIPCA	Chapete 404 protoze ji nikdo nenasel	3	2024-10-10 16:00:00
ea295562-4eed-4396-af57-f483115bedbd	R2D2	2024-10-03 14:00:00	2	40	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	here I am once again	1	2024-10-03 16:00:00
3b8a9caf-d7cd-4585-ae35-299d486f6a85	R2D2	2024-11-07 14:00:00	0	5	1f92a11172f3109d2529461a19e49dbace23fb32	1f92a11172f3109d2529461a19e49dbace23fb32	KMPMPS1	Test vyucujiciho 1	1	2024-11-07 16:00:00
970236a6-ab0f-4a01-a139-a5349f0ecc60	DROP TABLE *	2025-09-29 15:33:20.868	0	1000	43a635bae4e50471c41f874f5cf02a136706c60e	6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    	MATH202	1f92a11172f3109d2529461a19e49dbace23fb32	1	2025-09-29 16:33:20.868
\.


--
-- TOC entry 3388 (class 0 OID 16408)
-- Dependencies: 218
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vyucujici (id) FROM stdin;
10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63    
bf750282-e6ef-4769-bde4-65f116a7cc2b    
6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a    
1f92a11172f3109d2529461a19e49dbace23fb32
17a2bc3db091388b150a652a90623558ca7ee8ea
a3b644c7413985be43e9e27c98bf8d46e95bbf44
43a635bae4e50471c41f874f5cf02a136706c60e
\.


--
-- TOC entry 3389 (class 0 OID 16415)
-- Dependencies: 219
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zapsane_predmety (id, zapsano, student_id, kod_predmet) FROM stdin;
f979e45c-ad7f-47bd-9385-767107098e4c	2024-09-28 20:27:57.093952	5554da30-325d-4da0-b43c-079d56f990c7    	CS101
cd9765dc-96b7-418d-a9a4-ef6623612e6d	2024-09-28 20:32:49.683885	d423e661-e43e-4fee-913c-8218394fa545    	CS102
2118702d-df8b-4b03-83ed-6b62c8449b67	2024-09-28 20:32:49.683885	0d162f64-61dd-446d-a3e2-404a994e9a9f    	MATH202
9998702d-df8b-4b03-83ed-6b62c8449b67	2024-09-29 20:32:49.683885	4a71df77a1acbbe459be5cca49038fece4f49a6f	KMPMPS1
\.


--
-- TOC entry 3233 (class 2606 OID 16424)
-- Name: historie_terminu historie_terminu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT historie_terminu_pkey PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 16400)
-- Name: predmet predmet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT predmet_pkey PRIMARY KEY (kod_predmetu);


--
-- TOC entry 3223 (class 2606 OID 16498)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3227 (class 2606 OID 16407)
-- Name: termin terminy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT terminy_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 16504)
-- Name: vyucujici vyucujici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici
    ADD CONSTRAINT vyucujici_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 16419)
-- Name: zapsane_predmety zapsanepredmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT zapsanepredmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 16476)
-- Name: termin fk_kod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3238 (class 2606 OID 16575)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3239 (class 2606 OID 16549)
-- Name: zapsane_predmety fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3240 (class 2606 OID 16554)
-- Name: historie_terminu fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3236 (class 2606 OID 16565)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3241 (class 2606 OID 16580)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON DELETE CASCADE;


--
-- TOC entry 3234 (class 2606 OID 16539)
-- Name: predmet fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3237 (class 2606 OID 16544)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id);


-- Completed on 2024-10-04 10:19:08 CEST

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-10-04 10:19:08 CEST

--
-- PostgreSQL database cluster dump complete
--


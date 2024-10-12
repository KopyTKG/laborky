--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-12 13:17:38 CEST

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
-- TOC entry 220 (class 1259 OID 16420)
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
-- TOC entry 216 (class 1259 OID 16394)
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
    datum_konec timestamp without time zone,
    popis text
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
-- TOC entry 221 (class 1259 OID 24594)
-- Name: vyucujici_predmety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vyucujici_predmety (
    vyucujici_id character varying(40),
    kod_predmetu text,
    id integer NOT NULL
);


ALTER TABLE public.vyucujici_predmety OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 32777)
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
-- Dependencies: 222
-- Name: vyucujici_predmety_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vyucujici_predmety_id_seq OWNED BY public.vyucujici_predmety.id;


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
-- TOC entry 3227 (class 2604 OID 32778)
-- Name: vyucujici_predmety id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety ALTER COLUMN id SET DEFAULT nextval('public.vyucujici_predmety_id_seq'::regclass);


--
-- TOC entry 3399 (class 0 OID 16420)
-- Dependencies: 220
-- Data for Name: historie_terminu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.historie_terminu VALUES ('ccc25718-a783-4b65-b268-7ceec023dd2e', 'a37582dbc0e22578882b0daca288e984773c2b53', 'c5d0c8c6-3c0b-4cac-b053-5f6d301a2f43', '2024-10-11 00:02:11.260845');
INSERT INTO public.historie_terminu VALUES ('8f4353cf-a26e-47a8-800c-72bb8c889a6a', '172055682efec4388b8dc47c9778a446e6d310a6', 'c4ac4f7e-fc2a-42d3-9685-f437a11b00e1', '2024-10-11 00:13:43.845964');
INSERT INTO public.historie_terminu VALUES ('3db94dc8-a3cf-4d7d-929f-62029bb607f7', 'c1c1277db51aae1535fb9a1692c555d44c38b9c9', '9f2200f8-a3a5-4c12-960e-155cdf8113cc', '2024-10-11 20:37:22.848768');
INSERT INTO public.historie_terminu VALUES ('d4c03c6d-148a-42b4-9935-65662e449ad8', '33078e3a64b53becea86673761452ff1ec13c300', '9b56ef12-f2b0-49c7-9354-d6d3ea9ad207', NULL);


--
-- TOC entry 3395 (class 0 OID 16394)
-- Dependencies: 216
-- Data for Name: predmet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.predmet VALUES ('KAP/PF', 'PF', 'KAP', 3);
INSERT INTO public.predmet VALUES ('KIV/BOPX', 'BOPX', 'KIV', 2);
INSERT INTO public.predmet VALUES ('KIV/PRJ5', 'PRJ5', 'KIV', 4);
INSERT INTO public.predmet VALUES ('KAU/PO7', 'PO7', 'KAU', 3);
INSERT INTO public.predmet VALUES ('KTD/BPUT', 'BPUT', 'KTD', 3);
INSERT INTO public.predmet VALUES ('KAU/AUKPA', 'AUKPA', 'KAU', 3);
INSERT INTO public.predmet VALUES ('KFE/FP', 'FP', 'KFE', 3);
INSERT INTO public.predmet VALUES ('UJP/FPE3', 'FPE3', 'UJP', 2);
INSERT INTO public.predmet VALUES ('KEM/MAM', 'MAM', 'KEM', 2);
INSERT INTO public.predmet VALUES ('KAU/FO7', 'FO7', 'KAU', 2);
INSERT INTO public.predmet VALUES ('KVU/BPVT', 'BPVT', 'KVU', 2);
INSERT INTO public.predmet VALUES ('AKTIVITA', 'NIC', 'NIC', 0);
INSERT INTO public.predmet VALUES ('KFI/BPS1F', 'BPS1F', 'KFI', 2);
INSERT INTO public.predmet VALUES ('KFI/URKHB', 'URKHB', 'KFI', 2);
INSERT INTO public.predmet VALUES ('KČJ/L1M2', 'L1M2', 'KČJ', 2);


--
-- TOC entry 3394 (class 0 OID 16389)
-- Dependencies: 215
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES ('7d073e9adf78b01944978381a8c61a6a3459f042', '2024-10-07 20:49:07.014483');
INSERT INTO public.student VALUES ('a37582dbc0e22578882b0daca288e984773c2b53', '2024-10-08 20:18:23.24682');
INSERT INTO public.student VALUES ('1db6ec57820c5e9f5ecb79192a896c1cb47fc778', '2024-10-08 21:45:45.578511');
INSERT INTO public.student VALUES ('c1c1277db51aae1535fb9a1692c555d44c38b9c9', '2024-10-08 21:46:27.506094');
INSERT INTO public.student VALUES ('33078e3a64b53becea86673761452ff1ec13c300', '2024-10-09 14:43:18.582652');
INSERT INTO public.student VALUES ('172055682efec4388b8dc47c9778a446e6d310a6', '2024-10-10 22:56:40.087831');


--
-- TOC entry 3396 (class 0 OID 16401)
-- Dependencies: 217
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.termin VALUES ('d5d13001-daa7-483c-b13c-d4b3854152dc', 'Nespecifikovano', '2024-10-09 13:12:36.126', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAP/PF', 'Uznání předmětu', -1, '2024-10-09 15:12:36.126', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('905ebfff-9f17-4652-baf5-ca9525807ad4', 'Nespecifikovano', '2024-10-07 14:16:50.955796', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX', 'Uznání předmětu', -1, '2024-10-07 16:16:50.955796', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('72bab092-0629-4988-8294-e2782d4c4e1a', 'Nespecifikovano', '2024-10-07 14:21:35.061441', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/PRJ5', 'Uznání předmětu', -1, '2024-10-07 16:21:35.061441', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('f7f95921-3d92-43a5-b33d-add1cf52c20a', 'Nespecifikovano', '2024-10-07 19:20:44.763299', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Uznání předmětu', -1, '2024-10-07 21:20:44.763299', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('ef0df890-540b-4219-a4d7-0bb37d478898', 'Nespecifikovano', '2024-10-10 20:21:09.089989', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFI/BPS1F', 'Uznání předmětu', -1, '2024-10-10 22:21:09.089989', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('68b0be9a-0cfd-4f4e-91bd-1df287949380', 'Nespecifikovano', '2024-10-10 21:16:26.872537', 0, 1, 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'KČJ/L1M2', 'Uznání předmětu', -1, '2024-10-10 23:16:26.872537', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('c4ac4f7e-fc2a-42d3-9685-f437a11b00e1', 'CP-1.04', '2024-10-15 15:00:00', 1, 10, 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'KČJ/L1M2', '', 2, '2024-10-15 17:00:00', 'Automat');
INSERT INTO public.termin VALUES ('695051ab-dd9a-4c2c-8aa6-b3ea4cdca670', 'CPTO 7.13', '2024-10-11 14:00:00', 0, 10, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Fyzio', 1, '2024-10-11 16:00:00', 'fyzioterapie dětí');
INSERT INTO public.termin VALUES ('5a4156fa-0fde-48f9-94a0-40659b88c53d', 'CPTO 7.13', '2024-10-11 14:00:00', 0, 10, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Fyzio', 2, '2024-10-11 16:00:00', 'fyzioterapie dětí 2');
INSERT INTO public.termin VALUES ('c5d0c8c6-3c0b-4cac-b053-5f6d301a2f43', 'CPTO 1.1', '2024-10-11 14:00:00', 1, 20, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX', 'Konzultace k BP pokračování', 2, '2024-10-11 16:00:00', 'bude se konzultovat podruhé');
INSERT INTO public.termin VALUES ('a1755181-5135-4e76-a3c1-3f6b1057661b', 'Nespecifikovano', '2024-10-08 21:45:29.335226', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM', 'Uznání předmětu', -1, '2024-10-08 23:45:29.335226', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('579db326-2360-490d-8a68-7b964be09f76', 'a', '2024-10-16 18:41:00', 0, 21, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM', '', 1, '2024-10-16 21:38:00', 'a');
INSERT INTO public.termin VALUES ('3d25c0ef-4a02-487e-aa0b-42ad1055db7c', 'Nespecifikovano', '2024-10-07 18:27:58.266418', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/PO7', 'Uznání předmětu', -1, '2024-10-07 20:27:58.266418', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('4fcac62c-1410-4a16-a0e4-fe7b515d9337', 'Nespecifikovano', '2024-10-07 18:28:28.006206', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KTD/BPUT', 'Uznání předmětu', -1, '2024-10-07 20:28:28.006206', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('d146748b-7951-48f1-a552-6ce8cf1c1e4a', 'Nespecifikovano', '2024-10-07 18:28:47.018412', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/AUKPA', 'Uznání předmětu', -1, '2024-10-07 20:28:47.018412', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('61f50519-63bc-41ac-a247-3a9c57993ccc', 'Nespecifikovano', '2024-10-09 13:34:51.031034', 0, 1, '1b842cc94877cd138c6023533c6172808fb655a5', '1b842cc94877cd138c6023533c6172808fb655a5', 'KVU/BPVT', 'Uznání předmětu', -1, '2024-10-09 15:34:51.031034', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('9b56ef12-f2b0-49c7-9354-d6d3ea9ad207', 'Nespecifikovano', '2024-10-07 20:47:58.409267', 1, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'UJP/FPE3', 'Uznání předmětu', -1, '2024-10-07 22:47:58.409267', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('419875fa-49f0-445f-894e-950618041ec1', 'Nespecifikovano', '2024-10-10 20:24:21.638906', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFI/URKHB', 'Uznání předmětu', -1, '2024-10-10 22:24:21.638906', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('51a7ac88-181b-4940-8d90-cfdc462fa209', 'UK', '2024-10-13 17:00:00', 0, 20, 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'a0f3cbb12ea304476892aa3f48798a291420c9e1', 'KČJ/L1M2', '', 1, '2024-10-13 19:00:00', 'Auto');
INSERT INTO public.termin VALUES ('9f2200f8-a3a5-4c12-960e-155cdf8113cc', 'a', '2024-10-13 18:38:00', 1, 120, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM', '', 1, '2024-10-13 18:35:00', 'a');


--
-- TOC entry 3397 (class 0 OID 16408)
-- Dependencies: 218
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32');
INSERT INTO public.vyucujici VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d');
INSERT INTO public.vyucujici VALUES ('1b842cc94877cd138c6023533c6172808fb655a5');
INSERT INTO public.vyucujici VALUES ('a0f3cbb12ea304476892aa3f48798a291420c9e1');
INSERT INTO public.vyucujici VALUES ('31d847a30373266b9ee5550bc8a39803d2493527');


--
-- TOC entry 3400 (class 0 OID 24594)
-- Dependencies: 221
-- Data for Name: vyucujici_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KIV/BOPX', 1);
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KIV/PRJ5', 2);
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KAU/PO7', 3);
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KTD/BPUT', 4);
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KAU/AUKPA', 5);
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KFE/FP', 6);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAP/PF', 7);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX', 8);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/PRJ5', 9);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/PO7', 10);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KTD/BPUT', 11);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/AUKPA', 12);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 13);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'UJP/FPE3', 14);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM', 15);
INSERT INTO public.vyucujici_predmety VALUES ('1b842cc94877cd138c6023533c6172808fb655a5', 'KVU/BPVT', 16);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFI/BPS1F', 17);
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFI/URKHB', 18);
INSERT INTO public.vyucujici_predmety VALUES ('a0f3cbb12ea304476892aa3f48798a291420c9e1', 'KČJ/L1M2', 19);


--
-- TOC entry 3398 (class 0 OID 16415)
-- Dependencies: 219
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 222
-- Name: vyucujici_predmety_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vyucujici_predmety_id_seq', 19, true);


--
-- TOC entry 3239 (class 2606 OID 16424)
-- Name: historie_terminu historie_terminu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT historie_terminu_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 16400)
-- Name: predmet predmet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT predmet_pkey PRIMARY KEY (kod_predmetu);


--
-- TOC entry 3229 (class 2606 OID 16498)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 16407)
-- Name: termin terminy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT terminy_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 16504)
-- Name: vyucujici vyucujici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici
    ADD CONSTRAINT vyucujici_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 32786)
-- Name: vyucujici_predmety vyucujici_predmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 16419)
-- Name: zapsane_predmety zapsanepredmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT zapsanepredmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16476)
-- Name: termin fk_kod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3245 (class 2606 OID 16575)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3246 (class 2606 OID 16549)
-- Name: zapsane_predmety fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3247 (class 2606 OID 24611)
-- Name: historie_terminu fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- TOC entry 3243 (class 2606 OID 16565)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3248 (class 2606 OID 24626)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON DELETE CASCADE;


--
-- TOC entry 3244 (class 2606 OID 16544)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3249 (class 2606 OID 40961)
-- Name: vyucujici_predmety vyucujici_predmety_kod_predmetu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_kod_predmetu_fkey FOREIGN KEY (kod_predmetu) REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE;


--
-- TOC entry 3250 (class 2606 OID 40966)
-- Name: vyucujici_predmety vyucujici_predmety_vyucujici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_vyucujici_id_fkey FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id) ON DELETE CASCADE;


-- Completed on 2024-10-12 13:17:55 CEST

--
-- PostgreSQL database dump complete
--


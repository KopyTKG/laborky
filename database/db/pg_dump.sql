--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-10 11:12:11 CEST

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
-- TOC entry 3404 (class 1262 OID 16384)
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
-- TOC entry 3405 (class 0 OID 0)
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
    vyucujici_id character varying(40) NOT NULL,
    kod_predmetu text NOT NULL
);


ALTER TABLE public.vyucujici_predmety OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16409)
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
-- TOC entry 3392 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: historie_terminu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.historie_terminu VALUES ('825744ba-8b5e-45b0-b8a4-9cb725b3260b', 'c1c1277db51aae1535fb9a1692c555d44c38b9c9', 'a1755181-5135-4e76-a3c1-3f6b1057661b', '2024-10-08 21:48:35.582598');
INSERT INTO public.historie_terminu VALUES ('c83ddd58-4b03-4b08-8b0b-be90fc6577a3', 'a37582dbc0e22578882b0daca288e984773c2b53', 'a9a93168-af9d-447a-9c77-d40d79a20b4e', NULL);
INSERT INTO public.historie_terminu VALUES ('d4c03c6d-148a-42b4-9935-65662e449ad8', '33078e3a64b53becea86673761452ff1ec13c300', '9b56ef12-f2b0-49c7-9354-d6d3ea9ad207', '2024-10-09 14:45:36.965077');
INSERT INTO public.historie_terminu VALUES ('ccc25718-a783-4b65-b268-7ceec023dd2e', 'a37582dbc0e22578882b0daca288e984773c2b53', NULL, NULL);


--
-- TOC entry 3393 (class 0 OID 16388)
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


--
-- TOC entry 3394 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES ('7d073e9adf78b01944978381a8c61a6a3459f042', '2024-10-07 20:49:07.014483');
INSERT INTO public.student VALUES ('a37582dbc0e22578882b0daca288e984773c2b53', '2024-10-08 20:18:23.24682');
INSERT INTO public.student VALUES ('1db6ec57820c5e9f5ecb79192a896c1cb47fc778', '2024-10-08 21:45:45.578511');
INSERT INTO public.student VALUES ('c1c1277db51aae1535fb9a1692c555d44c38b9c9', '2024-10-08 21:46:27.506094');
INSERT INTO public.student VALUES ('33078e3a64b53becea86673761452ff1ec13c300', '2024-10-09 14:43:18.582652');


--
-- TOC entry 3395 (class 0 OID 16396)
-- Dependencies: 218
-- Data for Name: termin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.termin VALUES ('d5d13001-daa7-483c-b13c-d4b3854152dc', 'Nespecifikovano', '2024-10-09 13:12:36.126', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAP/PF', 'Uznání předmětu', -1, '2024-10-09 15:12:36.126', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('905ebfff-9f17-4652-baf5-ca9525807ad4', 'Nespecifikovano', '2024-10-07 14:16:50.955796', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX', 'Uznání předmětu', -1, '2024-10-07 16:16:50.955796', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('72bab092-0629-4988-8294-e2782d4c4e1a', 'Nespecifikovano', '2024-10-07 14:21:35.061441', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/PRJ5', 'Uznání předmětu', -1, '2024-10-07 16:21:35.061441', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('f7f95921-3d92-43a5-b33d-add1cf52c20a', 'Nespecifikovano', '2024-10-07 19:20:44.763299', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Uznání předmětu', -1, '2024-10-07 21:20:44.763299', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('695051ab-dd9a-4c2c-8aa6-b3ea4cdca670', 'CPTO 7.13', '2024-10-11 14:00:00', 0, 10, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Fyzio', 1, '2024-10-11 16:00:00', 'fyzioterapie dětí');
INSERT INTO public.termin VALUES ('5a4156fa-0fde-48f9-94a0-40659b88c53d', 'CPTO 7.13', '2024-10-11 14:00:00', 0, 10, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP', 'Fyzio', 2, '2024-10-11 16:00:00', 'fyzioterapie dětí 2');
INSERT INTO public.termin VALUES ('a1755181-5135-4e76-a3c1-3f6b1057661b', 'Nespecifikovano', '2024-10-08 21:45:29.335226', 1, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM', 'Uznání předmětu', -1, '2024-10-08 23:45:29.335226', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('a9a93168-af9d-447a-9c77-d40d79a20b4e', 'CPTO 1.1', '2024-10-10 14:00:00', 1, 20, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX', 'Konzultace k BP', 1, '2024-10-10 16:00:00', 'bude se konzultovat');
INSERT INTO public.termin VALUES ('3d25c0ef-4a02-487e-aa0b-42ad1055db7c', 'Nespecifikovano', '2024-10-07 18:27:58.266418', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/PO7', 'Uznání předmětu', -1, '2024-10-07 20:27:58.266418', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('4fcac62c-1410-4a16-a0e4-fe7b515d9337', 'Nespecifikovano', '2024-10-07 18:28:28.006206', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KTD/BPUT', 'Uznání předmětu', -1, '2024-10-07 20:28:28.006206', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('d146748b-7951-48f1-a552-6ce8cf1c1e4a', 'Nespecifikovano', '2024-10-07 18:28:47.018412', 0, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/AUKPA', 'Uznání předmětu', -1, '2024-10-07 20:28:47.018412', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('e78b337c-ef57-40b3-befa-467d50d14a07', 'MF 205', '2024-10-09 14:00:00', 0, 20, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAP/PF', 'KAP/PF', 1, '2024-10-09 16:00:00', 'Úvod do předmětu');
INSERT INTO public.termin VALUES ('61f50519-63bc-41ac-a247-3a9c57993ccc', 'Nespecifikovano', '2024-10-09 13:34:51.031034', 0, 1, '1b842cc94877cd138c6023533c6172808fb655a5', '1b842cc94877cd138c6023533c6172808fb655a5', 'KVU/BPVT', 'Uznání předmětu', -1, '2024-10-09 15:34:51.031034', 'Cvičení pro uznání všech cvičení v rámci předmětu');
INSERT INTO public.termin VALUES ('9b56ef12-f2b0-49c7-9354-d6d3ea9ad207', 'Nespecifikovano', '2024-10-07 20:47:58.409267', 1, 1, 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'UJP/FPE3', 'Uznání předmětu', -1, '2024-10-07 22:47:58.409267', 'Cvičení pro uznání všech cvičení v rámci předmětu');


--
-- TOC entry 3396 (class 0 OID 16401)
-- Dependencies: 219
-- Data for Name: vyucujici; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32');
INSERT INTO public.vyucujici VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d');
INSERT INTO public.vyucujici VALUES ('                                        ');
INSERT INTO public.vyucujici VALUES ('1b842cc94877cd138c6023533c6172808fb655a5');


--
-- TOC entry 3397 (class 0 OID 16404)
-- Dependencies: 220
-- Data for Name: vyucujici_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KIV/BOPX');
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KIV/PRJ5');
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KAU/PO7');
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KTD/BPUT');
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KAU/AUKPA');
INSERT INTO public.vyucujici_predmety VALUES ('1f92a11172f3109d2529461a19e49dbace23fb32', 'KFE/FP');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAP/PF');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/BOPX');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KIV/PRJ5');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/PO7');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KTD/BPUT');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KAU/AUKPA');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KFE/FP');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'UJP/FPE3');
INSERT INTO public.vyucujici_predmety VALUES ('dab963ab63e7e4f2a6f32c334bf839513928ff5d', 'KEM/MAM');
INSERT INTO public.vyucujici_predmety VALUES ('1b842cc94877cd138c6023533c6172808fb655a5', 'KVU/BPVT');


--
-- TOC entry 3398 (class 0 OID 16409)
-- Dependencies: 221
-- Data for Name: zapsane_predmety; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3227 (class 2606 OID 16415)
-- Name: historie_terminu historie_terminu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT historie_terminu_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 16417)
-- Name: predmet predmet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predmet
    ADD CONSTRAINT predmet_pkey PRIMARY KEY (kod_predmetu);


--
-- TOC entry 3231 (class 2606 OID 16419)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 16421)
-- Name: termin terminy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT terminy_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 16423)
-- Name: vyucujici vyucujici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici
    ADD CONSTRAINT vyucujici_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 16425)
-- Name: vyucujici_predmety vyucujici_predmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_pkey PRIMARY KEY (vyucujici_id, kod_predmetu);


--
-- TOC entry 3239 (class 2606 OID 16427)
-- Name: zapsane_predmety zapsanepredmety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT zapsanepredmety_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16428)
-- Name: termin fk_kod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_kod FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3247 (class 2606 OID 16433)
-- Name: zapsane_predmety fk_predmet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_predmet FOREIGN KEY (kod_predmet) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3248 (class 2606 OID 16438)
-- Name: zapsane_predmety fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zapsane_predmety
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3240 (class 2606 OID 16443)
-- Name: historie_terminu fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3243 (class 2606 OID 16448)
-- Name: termin fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_termin FOREIGN KEY (vypsal_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3241 (class 2606 OID 16477)
-- Name: historie_terminu fk_termin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historie_terminu
    ADD CONSTRAINT fk_termin FOREIGN KEY (termin_id) REFERENCES public.termin(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3244 (class 2606 OID 16458)
-- Name: termin fk_vyucuje; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termin
    ADD CONSTRAINT fk_vyucuje FOREIGN KEY (vyucuje_id) REFERENCES public.vyucujici(id);


--
-- TOC entry 3245 (class 2606 OID 16463)
-- Name: vyucujici_predmety vyucujici_predmety_kod_predmetu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_kod_predmetu_fkey FOREIGN KEY (kod_predmetu) REFERENCES public.predmet(kod_predmetu);


--
-- TOC entry 3246 (class 2606 OID 16468)
-- Name: vyucujici_predmety vyucujici_predmety_vyucujici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vyucujici_predmety
    ADD CONSTRAINT vyucujici_predmety_vyucujici_id_fkey FOREIGN KEY (vyucujici_id) REFERENCES public.vyucujici(id);


-- Completed on 2024-10-10 11:12:11 CEST

--
-- PostgreSQL database dump complete
--


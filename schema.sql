--
-- PostgreSQL database dump
--

\restrict 1wMp0R3syVXeMjMavslqqHhjOa5EJhp27qEw5hXTphUmq2yUhG04KtKbZdivxXr

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: disclosure_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.disclosure_category AS ENUM (
    'city-ordinance',
    'city-resolution',
    'executive-order',
    'bids-awards',
    'financial-aid',
    'full-disclosure',
    'city-ordinance-&-resolution'
);


--
-- Name: audit_summary(timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_summary(from_date timestamp with time zone, to_date timestamp with time zone) RETURNS json
    LANGUAGE sql
    AS $$
  SELECT json_build_object(
    'by_action',      (SELECT json_object_agg(action, count) FROM (SELECT action, COUNT(*) FROM audit_log WHERE created_at BETWEEN from_date AND to_date GROUP BY action) t),
    'by_entity_type', (SELECT json_object_agg(entity_type, count) FROM (SELECT entity_type, COUNT(*) FROM audit_log WHERE created_at BETWEEN from_date AND to_date AND entity_type IS NOT NULL GROUP BY entity_type) t),
    'by_user',        (SELECT json_object_agg(user_id, count) FROM (SELECT user_id, COUNT(*) FROM audit_log WHERE created_at BETWEEN from_date AND to_date AND user_id IS NOT NULL GROUP BY user_id) t)
  )
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_us; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_us (
    photo_id uuid DEFAULT gen_random_uuid() NOT NULL,
    file_path text NOT NULL,
    caption text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    article_id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    excerpt text,
    body text,
    featured_media_id integer,
    category_id integer,
    status character varying(20) DEFAULT 'draft'::character varying,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    author character varying(255),
    CONSTRAINT articles_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'review'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


--
-- Name: articles_article_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.articles_article_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: articles_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.articles_article_id_seq OWNED BY public.articles.article_id;


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    log_id integer NOT NULL,
    user_id integer,
    action character varying(50) NOT NULL,
    entity_type character varying(50),
    entity_id integer,
    changes jsonb,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT now(),
    user_agent text
);


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_log_id_seq OWNED BY public.audit_log.log_id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    banner_id integer NOT NULL,
    title character varying(255),
    file_path character varying(500),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    description text,
    image_media_id integer,
    link_url character varying(255),
    order_index integer DEFAULT 0,
    active boolean DEFAULT true
);


--
-- Name: banners_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_banner_id_seq OWNED BY public.banners.banner_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    parent_category_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text NOT NULL,
    email text,
    phone text,
    subject text NOT NULL,
    message text NOT NULL,
    source_node text,
    status text DEFAULT 'unread'::text NOT NULL,
    ip_address inet,
    closed_at timestamp with time zone,
    assigned_to integer,
    visitor_token text,
    CONSTRAINT conversations_status_check CHECK ((status = ANY (ARRAY['open'::text, 'assigned'::text, 'closed'::text])))
);


--
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.conversations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    sender_type text NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id integer,
    CONSTRAINT chat_messages_sender_type_check CHECK ((sender_type = ANY (ARRAY['visitor'::text, 'agent'::text])))
);

ALTER TABLE ONLY public.chat_messages REPLICA IDENTITY FULL;


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: disclosure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disclosure (
    document_id integer NOT NULL,
    category public.disclosure_category NOT NULL,
    title character varying(500) NOT NULL,
    date_passed date,
    document_path text,
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    uploaded_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT disclosure_documents_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'repealed'::character varying])::text[])))
);


--
-- Name: disclosure_documents_document_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.disclosure_documents_document_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: disclosure_documents_document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.disclosure_documents_document_id_seq OWNED BY public.disclosure.document_id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    event_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    location character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    faq_id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faqs_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_faq_id_seq OWNED BY public.faqs.faq_id;


--
-- Name: forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms (
    id bigint NOT NULL,
    title text NOT NULL,
    date_issued date,
    file_url text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    category text,
    CONSTRAINT forms_status_check CHECK ((status = ANY (ARRAY['active'::text, 'archived'::text])))
);


--
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    media_id integer NOT NULL,
    file_path character varying(500) NOT NULL,
    media_type character varying(20),
    caption text,
    uploaded_by integer,
    related_article_id integer,
    related_event_id integer,
    related_banner_id integer,
    order_index integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying, 'audio'::character varying])::text[])))
);


--
-- Name: media_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_media_id_seq OWNED BY public.media.media_id;


--
-- Name: publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publications (
    publication_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: publications_publication_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.publications_publication_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publications_publication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.publications_publication_id_seq OWNED BY public.publications.publication_id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    service_id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    requirements text,
    fees text,
    processing_time character varying(100),
    online_application_url character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: services_service_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_service_id_seq OWNED BY public.services.service_id;


--
-- Name: user_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_accounts (
    user_id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'uploader'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    permissions text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT valid_permissions CHECK ((permissions <@ ARRAY['dashboard'::text, 'banners'::text, 'news'::text, 'disclosure-portal'::text, 'downloadable-forms'::text, 'publications'::text, 'chatbot'::text, 'categories'::text, 'activity-logs'::text, 'user-management'::text]))
);


--
-- Name: user_accounts_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_accounts_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_accounts_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_accounts_user_id_seq OWNED BY public.user_accounts.user_id;


--
-- Name: articles article_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles ALTER COLUMN article_id SET DEFAULT nextval('public.articles_article_id_seq'::regclass);


--
-- Name: audit_log log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN log_id SET DEFAULT nextval('public.audit_logs_log_id_seq'::regclass);


--
-- Name: banners banner_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN banner_id SET DEFAULT nextval('public.banners_banner_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: disclosure document_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disclosure ALTER COLUMN document_id SET DEFAULT nextval('public.disclosure_documents_document_id_seq'::regclass);


--
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- Name: faqs faq_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN faq_id SET DEFAULT nextval('public.faqs_faq_id_seq'::regclass);


--
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- Name: media media_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN media_id SET DEFAULT nextval('public.media_media_id_seq'::regclass);


--
-- Name: publications publication_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications ALTER COLUMN publication_id SET DEFAULT nextval('public.publications_publication_id_seq'::regclass);


--
-- Name: services service_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN service_id SET DEFAULT nextval('public.services_service_id_seq'::regclass);


--
-- Name: user_accounts user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts ALTER COLUMN user_id SET DEFAULT nextval('public.user_accounts_user_id_seq'::regclass);


--
-- Data for Name: about_us; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_us (photo_id, file_path, caption, created_at, updated_at) FROM stdin;
6c683bbc-2a35-4c0d-9ef0-f72abc61fd5c	about-us/bonifacio-monument.webp	The Andres Bonifacio Monument	2026-05-12 01:26:48.221543+00	2026-05-13 05:22:42.121663+00
0b7a253a-6809-4ee1-81cc-056a4c4e5616	about-us/hagdang-bato.webp	Hagdang Bato	2026-05-12 01:26:48.221543+00	2026-05-13 05:27:21.602093+00
545933de-b4cf-44af-be59-637b25e943f8	about-us/city-hall.webp	City Hall of San Pablo	2026-05-12 01:26:48.221543+00	2026-05-13 05:27:24.51476+00
595e5b4a-59e2-420b-b7f1-2304a66de19c	about-us/sampalok-lake.webp	Sampaloc Lake	2026-05-12 01:26:48.221543+00	2026-05-13 05:27:28.192706+00
6aea729b-2739-4e5f-8223-80892d314f25	about-us/welcome-sanpablo.webp	Welcome to San Pablo City	2026-05-12 00:44:09.193834+00	2026-05-13 05:27:30.912847+00
e0544fe5-4f30-4654-98d5-3a14fb037949	about-us/cathedral.webp	Saint Paul the First Hermit Cathedral	2026-05-12 01:26:48.221543+00	2026-05-13 05:27:33.602008+00
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.articles (article_id, title, slug, excerpt, body, featured_media_id, category_id, status, published_at, created_at, updated_at, author) FROM stdin;
21	Mayor Najie, Nagpasalamat sa mga kawani at San Pableño	mayor-najie-nagpasalamat-sa-mga-kawani-at-san-pable-o	Pinasalamatan ni Mayor Najie Gapangada Jr. ang mga kawani ng Lokal na Pamahalaan ng San Pablo sa kanilang mabilis, episyente, at may ngiting paglilingkod sa mga mamamayan.\n\nIto ay kanyang binigyang-diin matapos maging bahagi ng Mayors for Good Governance, isang hakbang tungo sa mas matapat at mahusay na pamamahala.	## Mensahe ni Mayor Najie\nMaipatutupad ang mabuting pamamahala kung may dedikasyon at pagtutulungan ang mga kawani.\nAng tunay na susi sa good governance ay ang kusang-loob na paglilingkod ng bawat empleyado, anumang posisyon o rango.\n\n## Guinness World Record\nKasabay nito, ipinaabot ng Punong Lungsod ang kanyang pasasalamat sa lahat ng nakiisa sa pagtatamo ng Guinness World Record para sa pinakamaraming sama-samang nagtanim ng niyog.\n\nTinawag niya silang mga tunay na bayani — gumawa ng hakbang upang buhayin ang industriya ng niyog sa lungsod, na magbubukas ng mas maraming oportunidad at kabuhayan para sa mga susunod na henerasyon.	41	13	published	2025-09-15 04:19:04.519	2025-09-15 04:17:25.757	2025-09-15 04:20:30.981	2
22	P3.5M Aid, 619 San Pableños Assisted	p3-5m-aid-619-san-pable-os-assisted	Patuloy ang paghahatid ng serbisyong pangkalusugan at pinansyal na tulong ng Pamahalaang Lungsod sa ilalim ng Comprehensive Indigency Assistance Program sa pamumuno ni Mayor Najie B. Gapangada, Jr.\n\nSa kabuuan, umabot sa ₱3.5M ang naipagkaloob na medical at burial assistance sa 619 residente ng lungsod mula Hulyo–Agosto 2025.	\n## Breakdown ng Assistance\n🏥 Medical Assistance – ₱2,073,422.89 ⚰️ Burial Assistance – ₱1,493,000.00 🩺 Medical Equipment – mga tungkod, walker, wheelchair.\n\n\n> "Ang pagpapatupad ng programang ito ay bahagi ng aking pangako na matiyak ang maayos na serbisyong pangkalusugan at sapat na tulong para sa bawat San Pableño, lalo na sa oras ng pangangailangan."	42	14	published	2025-11-11 04:19:04.519	2025-11-11 04:17:25.757	2025-11-11 04:20:30.981	2
23	Sampaloc Lake to Undergo Temporary Rest Period	sampaloc-lake-to-undergo-temporary-rest-period	Pansamantalang ipapapahinga ang Sampaloc Lake area sa San Pablo City mula Oktubre 1 hanggang Nobyembre 15, 2025 upang bigyang panahon ang lawa at kapaligiran nito na makabawi at mapangalagaan.	\n## Layunin\nTiyakin ang kaligtasan ng publiko\nPanatilihin ang kaayusan at kalinisan\nIhanda ang Sampaloc Lake bilang pangunahing yaman at atraksyon.	43	15	published	2025-11-11 04:19:04.519	2025-11-11 04:17:25.757	2025-11-11 04:20:30.981	2
24	Mga Naipong Basura ng Undas Binigyang Aksyon	mga-naipong-basura-ng-undas-binigyang-aksyon	Sa atas ni Mayor Najie B. Gapangada at sa pagtutulungan ng City Cemetery Division, Solid Waste and Management Office, Barangay Officials, at mga pribadong manggagawa sa San Pablo City Public Cemetery ay agad nakolekta ang mga naipong basura ng nakaraang Undas.\n\nNanawagan naman ang pamunuan ng Public Cemetery sa ilang mga residente sa barangay na nakapalibot dito na huwag itapon o iwanan sa harap ng old public cemetery ang mga basurang nagmumula sa kanilang mga tahanan upang mapanatili ang kaayusan at kalinisan ng nasabing lugar.	Sa atas ni Mayor Najie B. Gapangada at sa pagtutulungan ng City Cemetery Division, Solid Waste and Management Office, Barangay Officials, at mga pribadong manggagawa sa San Pablo City Public Cemetery ay agad nakolekta ang mga naipong basura ng nakaraang Undas.\n\nNanawagan naman ang pamunuan ng Public Cemetery sa ilang mga residente sa barangay na nakapalibot dito na huwag itapon o iwanan sa harap ng old public cemetery ang mga basurang nagmumula sa kanilang mga tahanan upang mapanatili ang kaayusan at kalinisan ng nasabing lugar.	44	15	published	2025-11-13 04:19:04.519	2025-11-13 04:17:25.757	2026-05-26 04:44:50.54	2
25	Government Services to Reach Barangays via UGNAYANG NBG	government-services-to-reach-barangays-via-ugnayang-nbg	Mayor Najie B. Gapangada Jr. launches "UGNAYANG NBG" to bring government services closer to barangays.	\n## Serbisyong Gobyerno sa Barangay 🏛️\nIpinahayag ni Mayor Najie B. Gapangada Jr. na ihahatid sa mga barangay ang mga serbisyo ng Pamahalaang Lokal sa pamamagitan ng UGNAYANG NBG: Nasa Barangay ang Gobyerno.	56	13	published	2025-11-14 04:19:04.519	2025-11-14 04:17:25.757	2026-05-26 09:50:52.472	2
26	Centenarian may P20,000 cash benefit mula LGU	centenarian-may-p20-000-cash-benefit-mula-lgu	Tumanggap ng ₱20,000 cash benefit mula sa Pamahalaang Lungsod ng San Pablo si Gng. Soledad Alvero Aninias, centenarian mula sa Brgy. III – B, na nagdiwang ng kanyang ika – 100 kaarawan noong Nobyembre 8, 2025.	\n## CENTENARIAN NG BRGY. III–B NG SAN PABLO CITY, MAY P20,000 CASH BENEFIT MULA LGU\nTumanggap ng ₱20,000 cash benefit mula sa Pamahalaang Lungsod ng San Pablo si Gng. Soledad Alvero Aninias, centenarian mula sa Brgy. III – B, na nagdiwang ng kanyang ika – 100 kaarawan noong Nobyembre 8, 2025.\n\nAng cash benefit ay iniabot sa pangunguna ng Office of the Senior Citizens Affairs (OSCA) sa pamumuno ni OSCA Head, Engr. Odilon Aquino, kasama ang mga kawani ng tanggapan na sina Reylinda Q. Sy, Kristine A. Ty, Rowena A. Alvarez; at si Leo Exconde mula sa Office of the City Treasurer.\n\nAng cash benefit ay inisyatibo ng Pamahalaang Lokal sa pangunguna ni Mayor Najie B. Gapangada *na nagpapakita ng patuloy na pagkalinga at suporta sa mga nakatatanda sa lungsod.\n\nSa pamamagitan ng programang ito, kinikilala ng Pamahalaang Lungsod ang kahalagahan ng mga senior citizen bilang huwaran ng sipag, tiyaga, at inspirasyon para sa mga susunod na henerasyon. Photo Credits: Cmo-osca Spc	55	14	published	2025-11-17 04:19:04.519	2025-11-17 04:17:25.757	2026-05-26 09:45:04.616	2
27	KALAYAAN SA PAGSASALITA AT BAKIT MAHALAGA ITO SA GOVERNANCE TRANSPARENCY SA SAN PABLO	kalayaan-sa-pagsasalita-at-bakit-mahalaga-ito-sa-governance-transparency-sa-san-pablo	Sa kasalukuyang pamunuan ng Lokal na Pamahalaan ng San Pablo, ay naibalik ang makabuluhang espasyo para sa malaya, bukas, at responsableng pagpapahayag ng bawat mamamayan.	\n## Kalayaan sa Pagsasalita at Bakit Mahalaga Ito sa Governance Transparency sa San Pablo\nAng kalayaan sa pagsasalita ay mahalagang haligi ng demokratikong lipunan.\n\nSa kasalukuyang pamunuan ng Lokal na Pamahalaan ng San Pablo, ay naibalik ang makabuluhang espasyo para sa malaya, bukas, at responsableng pagpapahayag ng bawat mamamayan.\n\nKung noong mga nakaraang panahon ay nangibabaw ang pag-aalinlangan at pagkatakot na magpahayag, sa ngayon ay naghahari ang isang kapaligirang nagbibigay garantiya sa karapatang magsalita—isang adbokasiyang mariing itinataguyod ni Mayor Najie B. Gapangada.\n\nAng kalayaan sa pamamahayag ay mahalaga sa pagtataguyod ng transparency, integridad, at pananagutan sa serbisyo publiko. Sa pamamagitan nito, nagkakaroon ng pagkakataon ang mga mamamayan na maipahayag ang kanilang puna, obserbasyon, at suhestiyon na may layuning mapabuti ang mga sistema, proseso, at programang ipinatutupad ng pamahalaan.\n\nAng anumang kritisismong ipinahahayag nang may paggalang at mabuting hangarin ay hindi itinuturing na pag-atake, kundi bilang isang makabuluhang kontribusyon tungo sa mas maayos, episyente, at tapat na pamamahala.\n\nPara sa mga tunay na lingkod-bayan, ang pagtanggap sa puna ay bahagi ng tungkulin at responsibilidad sa sambayanan. Ang pagpuna ay nagsisilbing paalala upang maitama ang pagkakamali, mapahusay ang serbisyo, at mapanatili ang tiwala ng publiko.\n\nGayunpaman, mahalagang bigyang-diin na ang kalayaang ito ay hindi dapat gamitin sa paraang may layuning manira, manlait, o sadyang dungisan ang dangal at pagkatao ng sinuman.\n\nAng karapatang ito ay dapat gamitin nang may pananagutan, paggalang, at integridad.\n\nSa pamahalaang nagbibigay-halaga sa bukas na komunikasyon at tapat na pakikipag-ugnayan sa publiko, patuloy na isinusulong ang isang kapaligirang nagtataguyod ng demokrasya, katarungan, at patas na pagtrato.\n\nSa ganitong pamumuno, ang ating lungsod ay nananatiling halimbawa ng isang pamahalaang handang makinig, tumugon, at gumawa ng kinakailangang hakbang upang maitama ang anumang kakulangan para sa ikabubuti ng lahat.	47	13	published	2026-02-03 04:19:04.519	2026-02-03 04:17:25.757	2026-02-03 04:20:30.981	2
30	KONSULTASYON, ISINAGAWA KAUGNAY NG CITY ORDINANCE NO. 2011-01 PARA SA SEKTOR NG TRICYCLE	konsultasyon-isinagawa-kaugnay-ng-city-ordinance-no-2011-01-para-sa-sektor-ng-tricycle	\N	\N	52	\N	published	2026-02-06 04:19:04.519	2026-02-06 04:17:25.757	2026-05-26 09:33:40.776	2
29	BAGONG INVESTMENT SA SPORTS, 2 TENNIS COURTS, BINUKSAN SA SAN PABLO CITY	bagong-investment-sa-sports-2-tennis-courts-binuksan-sa-san-pablo-city	\N	\N	53	\N	published	2026-02-06 04:19:04.519	2026-02-06 04:17:25.757	2026-05-26 09:40:35.398	2
28	BOYSEN AT DAVIES, KINILALA NI MAYOR NAJIE	boysen-at-davies-kinilala-ni-mayor-najie	\N	\N	54	\N	published	2026-02-06 04:19:04.519	2026-02-06 04:17:25.757	2026-05-26 09:42:22.48	2
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_log (log_id, user_id, action, entity_type, entity_id, changes, ip_address, created_at, user_agent) FROM stdin;
819	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-21 08:23:21.586+00	\N
822	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-21 08:23:39.484+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
823	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.133	2026-05-22 01:13:32.706+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
824	2	CREATE	chat_message	52	{"sent_by": 2, "conversation_id": 41}	\N	2026-05-22 01:13:46.071+00	\N
825	2	UPDATE	conversation	41	{"changes": {"status": "closed", "closed_at": "2026-05-22T01:13:54.171Z"}, "updated_by": 2}	\N	2026-05-22 01:13:54.266+00	\N
826	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-22 01:21:08.409+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
827	2	UPDATE	conversation	41	{"changes": {"status": "open"}, "updated_by": 2}	\N	2026-05-22 01:24:04.142+00	\N
828	2	UPDATE	conversation	44	{"changes": {"status": "closed", "closed_at": "2026-05-22T01:52:29.461Z"}, "updated_by": 2}	\N	2026-05-22 01:52:29.581+00	\N
829	2	UPDATE	conversation	43	{"changes": {"status": "closed", "closed_at": "2026-05-22T01:54:23.339Z"}, "updated_by": 2}	\N	2026-05-22 01:54:23.461+00	\N
830	2	UPDATE	conversation	42	{"changes": {"status": "closed", "closed_at": "2026-05-22T01:54:27.015Z"}, "updated_by": 2}	\N	2026-05-22 01:54:27.13+00	\N
831	2	FILE_UPLOAD	image	32	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/amylkzxpt-1779416643944.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2FteWxrenhwdC0xNzc5NDE2NjQzOTQ0LnBuZyIsImlhdCI6MTc3OTQxNjQ0NCwiZXhwIjoxODEwOTUyNDQ0fQ.KvniJYr-vQX5Z-kziasXKhAMQXCFd3B_36W0eOsyZwc"}	\N	2026-05-22 02:24:21.364+00	\N
832	2	CREATE	media	32	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/amylkzxpt-1779416643944.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2FteWxrenhwdC0xNzc5NDE2NjQzOTQ0LnBuZyIsImlhdCI6MTc3OTQxNjQ0NCwiZXhwIjoxODEwOTUyNDQ0fQ.KvniJYr-vQX5Z-kziasXKhAMQXCFd3B_36W0eOsyZwc", "created_by": 2, "media_type": "image"}	\N	2026-05-22 02:24:21.518+00	\N
833	2	CREATE	banner	19	{"title": null, "created_by": 2, "image_media_id": 32}	\N	2026-05-22 02:24:22.104+00	\N
834	2	FILE_UPLOAD	image	33	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/5wesfy3lf-1779416668468.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzV3ZXNmeTNsZi0xNzc5NDE2NjY4NDY4LnBuZyIsImlhdCI6MTc3OTQxNjQ2OCwiZXhwIjoxODEwOTUyNDY4fQ.lSptIxPiO-AC85x9qg1791aM4enFjOfJ_v-dlwzUXEM"}	\N	2026-05-22 02:24:34.815+00	\N
835	2	CREATE	media	33	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/5wesfy3lf-1779416668468.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzV3ZXNmeTNsZi0xNzc5NDE2NjY4NDY4LnBuZyIsImlhdCI6MTc3OTQxNjQ2OCwiZXhwIjoxODEwOTUyNDY4fQ.lSptIxPiO-AC85x9qg1791aM4enFjOfJ_v-dlwzUXEM", "created_by": 2, "media_type": "image"}	\N	2026-05-22 02:24:34.955+00	\N
836	2	CREATE	banner	20	{"title": null, "created_by": 2, "image_media_id": 33}	\N	2026-05-22 02:24:35.524+00	\N
837	2	FILE_UPLOAD	image	34	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/rvx7oiggb-1779416792014.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ydng3b2lnZ2ItMTc3OTQxNjc5MjAxNC5wbmciLCJpYXQiOjE3Nzk0MTY1OTEsImV4cCI6MTgxMDk1MjU5MX0.wJ6yYXl7DmL39bUuFLb3mpvHwRk1GZEfR-1uPdBd33w"}	\N	2026-05-22 02:26:42.534+00	\N
838	2	CREATE	media	34	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/rvx7oiggb-1779416792014.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ydng3b2lnZ2ItMTc3OTQxNjc5MjAxNC5wbmciLCJpYXQiOjE3Nzk0MTY1OTEsImV4cCI6MTgxMDk1MjU5MX0.wJ6yYXl7DmL39bUuFLb3mpvHwRk1GZEfR-1uPdBd33w", "created_by": 2, "media_type": "image"}	\N	2026-05-22 02:26:42.64+00	\N
839	2	CREATE	article	18	{"slug": "test-news-article", "title": "Test news article"}	\N	2026-05-22 02:26:43.136+00	\N
840	2	STATUS_CHANGE	article	18	{"new_status": "published", "old_status": "draft"}	\N	2026-05-22 02:26:47.674+00	\N
841	2	FILE_UPLOAD	image	35	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/jxfz3pdi1-1779416813321.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9qeGZ6M3BkaTEtMTc3OTQxNjgxMzMyMS5wbmciLCJpYXQiOjE3Nzk0MTY2MTIsImV4cCI6MTgxMDk1MjYxMn0.55LqyHOZnhs4bRQJSQsMf965RZGFF7Ii2sKSXpMsGSY"}	\N	2026-05-22 02:27:07.756+00	\N
842	2	CREATE	media	35	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/jxfz3pdi1-1779416813321.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9qeGZ6M3BkaTEtMTc3OTQxNjgxMzMyMS5wbmciLCJpYXQiOjE3Nzk0MTY2MTIsImV4cCI6MTgxMDk1MjYxMn0.55LqyHOZnhs4bRQJSQsMf965RZGFF7Ii2sKSXpMsGSY", "created_by": 2, "media_type": "image"}	\N	2026-05-22 02:27:07.862+00	\N
843	2	CREATE	article	19	{"slug": "test-news-article-2", "title": "Test news article 2"}	\N	2026-05-22 02:27:08.327+00	\N
844	2	FILE_UPLOAD	image	36	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/a4rvpbmfr-1779416842153.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9hNHJ2cGJtZnItMTc3OTQxNjg0MjE1My5wbmciLCJpYXQiOjE3Nzk0MTY2NDEsImV4cCI6MTgxMDk1MjY0MX0._4S3WN121b0DeCQo6psJHB0dHAA-Q0aPi3CnYpiHfdA"}	\N	2026-05-22 02:27:37.514+00	\N
845	2	CREATE	media	36	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/a4rvpbmfr-1779416842153.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9hNHJ2cGJtZnItMTc3OTQxNjg0MjE1My5wbmciLCJpYXQiOjE3Nzk0MTY2NDEsImV4cCI6MTgxMDk1MjY0MX0._4S3WN121b0DeCQo6psJHB0dHAA-Q0aPi3CnYpiHfdA", "created_by": 2, "media_type": "image"}	\N	2026-05-22 02:27:37.651+00	\N
846	2	CREATE	article	20	{"slug": "test-news-article-3", "title": "Test news article 3"}	\N	2026-05-22 02:27:38.146+00	\N
847	2	STATUS_CHANGE	article	20	{"new_status": "published", "old_status": "draft"}	\N	2026-05-22 02:27:42.674+00	\N
848	2	STATUS_CHANGE	article	19	{"new_status": "published", "old_status": "draft"}	\N	2026-05-22 02:27:45.625+00	\N
849	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.133	2026-05-22 08:47:54.006+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
850	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-26 02:54:29.776+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
851	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-26 03:00:43.154+00	\N
852	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-26 03:00:48.606+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
853	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.41	2026-05-26 02:58:28.285+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
854	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-26 03:03:20.69+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
855	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.41	2026-05-26 03:06:34.025+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
856	2	FILE_UPLOAD	image	37	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/ojq85zrnz-1779765548766.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL29qcTg1enJuei0xNzc5NzY1NTQ4NzY2LndlYnAiLCJpYXQiOjE3Nzk3NjUzNDcsImV4cCI6MTgxMTMwMTM0N30.7DzUZmnBI0iJH3k8oovFzw31-JiFS_rARdcwCD7KbVw"}	\N	2026-05-26 03:19:16.798+00	\N
857	2	CREATE	media	37	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/ojq85zrnz-1779765548766.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL29qcTg1enJuei0xNzc5NzY1NTQ4NzY2LndlYnAiLCJpYXQiOjE3Nzk3NjUzNDcsImV4cCI6MTgxMTMwMTM0N30.7DzUZmnBI0iJH3k8oovFzw31-JiFS_rARdcwCD7KbVw", "created_by": 2, "media_type": "image"}	\N	2026-05-26 03:19:16.926+00	\N
858	2	CREATE	banner	21	{"title": "HONDA PCX 150", "created_by": 2, "image_media_id": 37}	\N	2026-05-26 03:19:17.685+00	\N
859	2	DELETE	banner	20	{"title": null, "deleted_by": 2}	\N	2026-05-26 03:19:27.333+00	\N
860	2	STATUS_CHANGE	article	20	{"new_status": "draft", "old_status": "published"}	\N	2026-05-26 03:19:34.369+00	\N
861	2	DELETE	article	20	{"slug": "test-news-article-3", "title": "Test news article 3"}	\N	2026-05-26 03:19:41.859+00	\N
862	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-05-26 03:28:21.109+00	curl/8.18.0
863	2	CREATE	disclosure	21	{"document": {"title": "test disclosure", "status": "active", "category": "full-disclosure", "date_passed": "2026-05-26", "document_path": "full_disclosure/hn9mmizkp-1779766556465.pdf"}}	\N	2026-05-26 03:35:58.729+00	\N
864	2	DELETE	disclosure	21	{"deleted_document": {"title": "test disclosure"}}	\N	2026-05-26 03:46:19.381+00	\N
865	2	CREATE	disclosure	22	{"document": {"title": "Test disclosure", "status": "active", "category": "full-disclosure", "date_passed": "2026-05-26", "document_path": "full_disclosure/xql9bcxo3-1779767190917.pdf"}}	\N	2026-05-26 03:46:34.395+00	\N
866	2	DELETE	disclosure	22	{"deleted_document": {"title": "Test disclosure"}}	\N	2026-05-26 03:50:13.507+00	\N
867	2	CREATE	disclosure	23	{"document": {"title": "test disclosure", "status": "active", "category": "full-disclosure", "date_passed": "2026-05-26", "document_path": "full_disclosure/9obek9t1d-1779767425496.pdf"}}	\N	2026-05-26 03:50:27.578+00	\N
868	2	DELETE	disclosure	19	{"deleted_document": {"title": "test ordinance again"}}	\N	2026-05-26 03:52:01.291+00	\N
820	\N	LOGIN_SUCCESS	user_account	36	{"username": "chatbot"}	::1	2026-05-21 08:23:27.2+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
821	\N	LOGOUT	user_account	36	{"reason": "manual"}	\N	2026-05-21 08:23:36.055+00	\N
869	2	FILE_UPLOAD	image	38	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/jbif57wru-1779768678486.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2piaWY1N3dydS0xNzc5NzY4Njc4NDg2LmpwZyIsImlhdCI6MTc3OTc2ODQ3OCwiZXhwIjoxODExMzA0NDc4fQ.cP77QfV5B-HCS6FUw8ZWkZ7y4IdRMCL_3-trD6sMf_Q"}	\N	2026-05-26 04:12:04.353+00	\N
870	2	CREATE	media	38	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/jbif57wru-1779768678486.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2piaWY1N3dydS0xNzc5NzY4Njc4NDg2LmpwZyIsImlhdCI6MTc3OTc2ODQ3OCwiZXhwIjoxODExMzA0NDc4fQ.cP77QfV5B-HCS6FUw8ZWkZ7y4IdRMCL_3-trD6sMf_Q", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:12:04.502+00	\N
871	2	CREATE	banner	22	{"title": "AIP AT 2026 BUDGET NG SAN PABLO LGU, INADOPT AT INAPRUBAHAN", "created_by": 2, "image_media_id": 38}	\N	2026-05-26 04:12:05.021+00	\N
872	2	FILE_UPLOAD	image	39	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/f7aovbhq6-1779768846475.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Y3YW92YmhxNi0xNzc5NzY4ODQ2NDc1LnBuZyIsImlhdCI6MTc3OTc2ODY0NiwiZXhwIjoxODExMzA0NjQ2fQ.ExN0e_LwqDZubUsDZvKo3sH-Bi-0adZXIaCquiSpW6g"}	\N	2026-05-26 04:14:11.358+00	\N
873	2	CREATE	media	39	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/f7aovbhq6-1779768846475.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Y3YW92YmhxNi0xNzc5NzY4ODQ2NDc1LnBuZyIsImlhdCI6MTc3OTc2ODY0NiwiZXhwIjoxODExMzA0NjQ2fQ.ExN0e_LwqDZubUsDZvKo3sH-Bi-0adZXIaCquiSpW6g", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:14:11.559+00	\N
874	2	CREATE	banner	23	{"title": null, "created_by": 2, "image_media_id": 39}	\N	2026-05-26 04:14:12.102+00	\N
875	2	UPDATE	banner	23	{"changes": {"active": true, "order_index": 1}, "updated_by": 2}	\N	2026-05-26 04:14:22.568+00	\N
876	2	UPDATE	banner	22	{"changes": {"active": true, "order_index": 0}, "updated_by": 2}	\N	2026-05-26 04:14:22.577+00	\N
877	2	FILE_UPLOAD	image	40	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fcixprvkd-1779768914788.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2ZjaXhwcnZrZC0xNzc5NzY4OTE0Nzg4LnBuZyIsImlhdCI6MTc3OTc2ODcxNCwiZXhwIjoxODExMzA0NzE0fQ.o8zDwU1Sjo7leUNvwGpEqNNjhtgFUc1M_3HeE86oNPg"}	\N	2026-05-26 04:15:46.274+00	\N
878	2	CREATE	media	40	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fcixprvkd-1779768914788.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2ZjaXhwcnZrZC0xNzc5NzY4OTE0Nzg4LnBuZyIsImlhdCI6MTc3OTc2ODcxNCwiZXhwIjoxODExMzA0NzE0fQ.o8zDwU1Sjo7leUNvwGpEqNNjhtgFUc1M_3HeE86oNPg", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:15:46.418+00	\N
879	2	CREATE	banner	24	{"title": "86th CHARTER ANNIVESARY OF CITY OF SAN PABLO", "created_by": 2, "image_media_id": 40}	\N	2026-05-26 04:15:46.923+00	\N
880	2	FILE_UPLOAD	image	41	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/295r01v7c-1779769000736.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yOTVyMDF2N2MtMTc3OTc2OTAwMDczNi5qcGciLCJpYXQiOjE3Nzk3Njg3OTksImV4cCI6MTgxMTMwNDc5OX0.BCrnLi4kIijQfhw7rYoaKpRFxpDHyUWXRfZpoG9Q4aM"}	\N	2026-05-26 04:17:25.328+00	\N
881	2	CREATE	media	41	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/295r01v7c-1779769000736.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yOTVyMDF2N2MtMTc3OTc2OTAwMDczNi5qcGciLCJpYXQiOjE3Nzk3Njg3OTksImV4cCI6MTgxMTMwNDc5OX0.BCrnLi4kIijQfhw7rYoaKpRFxpDHyUWXRfZpoG9Q4aM", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:17:25.469+00	\N
882	2	CREATE	article	21	{"slug": "mayor-najie-nagpasalamat-sa-mga-kawani-at-san-pable-o", "title": "Mayor Najie, Nagpasalamat sa mga kawani at San Pableño"}	\N	2026-05-26 04:17:25.997+00	\N
883	2	STATUS_CHANGE	article	21	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 04:17:41.455+00	\N
884	2	CREATE	category	13	{"name": "Governance", "slug": "governance", "created_by": 2}	\N	2026-05-26 04:18:25.498+00	\N
885	2	UPDATE	article	21	{"changes": {"category_id": 13}}	\N	2026-05-26 04:18:37.591+00	\N
886	2	STATUS_CHANGE	article	21	{"new_status": "draft", "old_status": "published"}	\N	2026-05-26 04:18:56.83+00	\N
887	2	STATUS_CHANGE	article	21	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 04:19:04.645+00	\N
888	2	UPDATE	article	21	{"changes": {"body": "## Mensahe ni Mayor Najie\\nMaipatutupad ang mabuting pamamahala kung may dedikasyon at pagtutulungan ang mga kawani.\\nAng tunay na susi sa good governance ay ang kusang-loob na paglilingkod ng bawat empleyado, anumang posisyon o rango.\\n\\n## Guinness World Record\\nKasabay nito, ipinaabot ng Punong Lungsod ang kanyang pasasalamat sa lahat ng nakiisa sa pagtatamo ng Guinness World Record para sa pinakamaraming sama-samang nagtanim ng niyog.\\n\\nTinawag niya silang mga tunay na bayani — gumawa ng hakbang upang buhayin ang industriya ng niyog sa lungsod, na magbubukas ng mas maraming oportunidad at kabuhayan para sa mga susunod na henerasyon.", "excerpt": "Pinasalamatan ni Mayor Najie Gapangada Jr. ang mga kawani ng Lokal na Pamahalaan ng San Pablo sa kanilang mabilis, episyente, at may ngiting paglilingkod sa mga mamamayan.\\n\\nIto ay kanyang binigyang-diin matapos maging bahagi ng Mayors for Good Governance, isang hakbang tungo sa mas matapat at mahusay na pamamahala."}}	\N	2026-05-26 04:20:31.516+00	\N
889	2	CREATE	category	14	{"name": "Financial Aid", "slug": "financial-aid", "created_by": 2}	\N	2026-05-26 04:21:15.303+00	\N
890	2	CREATE	category	15	{"name": "Environment", "slug": "environment", "created_by": 2}	\N	2026-05-26 04:21:20.877+00	\N
891	2	FILE_UPLOAD	image	42	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/wdffoxywk-1779769729917.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy93ZGZmb3h5d2stMTc3OTc2OTcyOTkxNy53ZWJwIiwiaWF0IjoxNzc5NzY5NTI4LCJleHAiOjE4MTEzMDU1Mjh9.lS9xCbdszz6FiVAv-6Bn0gwUssZqGsj5FggGaU2o0uU"}	\N	2026-05-26 04:31:27.075+00	\N
892	2	CREATE	media	42	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/wdffoxywk-1779769729917.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy93ZGZmb3h5d2stMTc3OTc2OTcyOTkxNy53ZWJwIiwiaWF0IjoxNzc5NzY5NTI4LCJleHAiOjE4MTEzMDU1Mjh9.lS9xCbdszz6FiVAv-6Bn0gwUssZqGsj5FggGaU2o0uU", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:31:27.209+00	\N
893	2	CREATE	article	22	{"slug": "p3-5m-aid-619-san-pable-os-assisted", "title": "P3.5M Aid, 619 San Pableños Assisted"}	\N	2026-05-26 04:31:27.784+00	\N
894	2	STATUS_CHANGE	article	22	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 04:32:17.304+00	\N
895	2	FILE_UPLOAD	image	43	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/2wl2usa5r-1779770243016.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yd2wydXNhNXItMTc3OTc3MDI0MzAxNi53ZWJwIiwiaWF0IjoxNzc5NzcwMDQyLCJleHAiOjE4MTEzMDYwNDJ9.pwZ8lmQMc1C8Mo12Ub54urQZW9AA6p5pkkat9B8AkI8"}	\N	2026-05-26 04:38:34.319+00	\N
896	2	CREATE	media	43	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/2wl2usa5r-1779770243016.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yd2wydXNhNXItMTc3OTc3MDI0MzAxNi53ZWJwIiwiaWF0IjoxNzc5NzcwMDQyLCJleHAiOjE4MTEzMDYwNDJ9.pwZ8lmQMc1C8Mo12Ub54urQZW9AA6p5pkkat9B8AkI8", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:38:34.462+00	\N
897	2	CREATE	article	23	{"slug": "sampaloc-lake-to-undergo-temporary-rest-period", "title": "Sampaloc Lake to Undergo Temporary Rest Period"}	\N	2026-05-26 04:38:35.123+00	\N
898	2	STATUS_CHANGE	article	23	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 04:38:39.668+00	\N
899	2	FILE_UPLOAD	image	44	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/99a1z0tno-1779770515841.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy85OWExejB0bm8tMTc3OTc3MDUxNTg0MS5qcGciLCJpYXQiOjE3Nzk3NzAzMTUsImV4cCI6MTgxMTMwNjMxNX0.zwuAr37TXYYUgI3Ie8L5GhUpDQp9-9L6oUjqSWrvQIM"}	\N	2026-05-26 04:42:51.053+00	\N
902	2	STATUS_CHANGE	article	24	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 04:42:54.553+00	\N
1013	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	160.20.41.11	2026-06-02 03:21:42.54+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
900	2	CREATE	media	44	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/99a1z0tno-1779770515841.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy85OWExejB0bm8tMTc3OTc3MDUxNTg0MS5qcGciLCJpYXQiOjE3Nzk3NzAzMTUsImV4cCI6MTgxMTMwNjMxNX0.zwuAr37TXYYUgI3Ie8L5GhUpDQp9-9L6oUjqSWrvQIM", "created_by": 2, "media_type": "image"}	\N	2026-05-26 04:42:51.283+00	\N
901	2	CREATE	article	24	{"slug": "mga-naipong-basura-ng-undas-binigyang-aksyon", "title": "Mga Naipong Basura ng Undas Binigyang Aksyon"}	\N	2026-05-26 04:42:51.844+00	\N
903	2	UPDATE	article	24	{"changes": {"excerpt": "Sa atas ni Mayor Najie B. Gapangada at sa pagtutulungan ng City Cemetery Division, Solid Waste and Management Office, Barangay Officials, at mga pribadong manggagawa sa San Pablo City Public Cemetery ay agad nakolekta ang mga naipong basura ng nakaraang Undas.\\n\\nNanawagan naman ang pamunuan ng Public Cemetery sa ilang mga residente sa barangay na nakapalibot dito na huwag itapon o iwanan sa harap ng old public cemetery ang mga basurang nagmumula sa kanilang mga tahanan upang mapanatili ang kaayusan at kalinisan ng nasabing lugar."}}	\N	2026-05-26 04:44:50.683+00	\N
904	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.41	2026-05-26 08:44:22.136+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
905	2	FILE_UPLOAD	image	45	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/yafppuf2e-1779786423375.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95YWZwcHVmMmUtMTc3OTc4NjQyMzM3NS5qcGciLCJpYXQiOjE3Nzk3ODYyMjIsImV4cCI6MTgxMTMyMjIyMn0.BMuRXaGrBlHiju5Bl3sNRNlUlWAsOh5ZtMpLynQzunQ"}	\N	2026-05-26 09:04:24.831+00	\N
906	2	CREATE	media	45	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/yafppuf2e-1779786423375.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95YWZwcHVmMmUtMTc3OTc4NjQyMzM3NS5qcGciLCJpYXQiOjE3Nzk3ODYyMjIsImV4cCI6MTgxMTMyMjIyMn0.BMuRXaGrBlHiju5Bl3sNRNlUlWAsOh5ZtMpLynQzunQ", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:04:24.947+00	\N
907	2	CREATE	article	25	{"slug": "government-services-to-reach-barangays-via-ugnayang-nbg", "title": "Government Services to Reach Barangays via UGNAYANG NBG"}	\N	2026-05-26 09:04:25.616+00	\N
908	2	STATUS_CHANGE	article	25	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:05:49.507+00	\N
909	2	STATUS_CHANGE	article	25	{"new_status": "published", "old_status": "published"}	\N	2026-05-26 09:05:50.442+00	\N
910	2	FILE_UPLOAD	image	46	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/t13bsco7m-1779786626137.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy90MTNic2NvN20tMTc3OTc4NjYyNjEzNy5wbmciLCJpYXQiOjE3Nzk3ODY0MjUsImV4cCI6MTgxMTMyMjQyNX0.Gif-Pwa6UGvW_nL98xwn84oj0E66jira3ANCUi2290k"}	\N	2026-05-26 09:07:45.782+00	\N
911	2	CREATE	media	46	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/t13bsco7m-1779786626137.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy90MTNic2NvN20tMTc3OTc4NjYyNjEzNy5wbmciLCJpYXQiOjE3Nzk3ODY0MjUsImV4cCI6MTgxMTMyMjQyNX0.Gif-Pwa6UGvW_nL98xwn84oj0E66jira3ANCUi2290k", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:07:45.908+00	\N
912	2	CREATE	article	26	{"slug": "centenarian-may-p20-000-cash-benefit-mula-lgu", "title": "Centenarian may P20,000 cash benefit mula LGU"}	\N	2026-05-26 09:07:46.522+00	\N
913	2	STATUS_CHANGE	article	26	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:07:51.064+00	\N
914	2	FILE_UPLOAD	image	47	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/x4syh9jzy-1779786800383.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy94NHN5aDlqenktMTc3OTc4NjgwMDM4My5qcGciLCJpYXQiOjE3Nzk3ODY1OTgsImV4cCI6MTgxMTMyMjU5OH0.csTkpjHu0KqxKKF-3v3RNMS3q0tEfuJOM2LpZYeqDak"}	\N	2026-05-26 09:11:08.837+00	\N
915	2	CREATE	media	47	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/x4syh9jzy-1779786800383.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy94NHN5aDlqenktMTc3OTc4NjgwMDM4My5qcGciLCJpYXQiOjE3Nzk3ODY1OTgsImV4cCI6MTgxMTMyMjU5OH0.csTkpjHu0KqxKKF-3v3RNMS3q0tEfuJOM2LpZYeqDak", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:11:08.951+00	\N
916	2	CREATE	article	27	{"slug": "kalayaan-sa-pagsasalita-at-bakit-mahalaga-ito-sa-governance-transparency-sa-san-pablo", "title": "KALAYAAN SA PAGSASALITA AT BAKIT MAHALAGA ITO SA GOVERNANCE TRANSPARENCY SA SAN PABLO"}	\N	2026-05-26 09:11:09.627+00	\N
917	2	STATUS_CHANGE	article	27	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:11:12.881+00	\N
918	2	FILE_UPLOAD	image	48	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/ukulbm677-1779787007966.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy91a3VsYm02NzctMTc3OTc4NzAwNzk2Ni5qcGciLCJpYXQiOjE3Nzk3ODY4MDYsImV4cCI6MTgxMTMyMjgwNn0.f1v5f4tNg_N5tDGhGB56-hiXGI8lYZQMXK7odOcF7Cs"}	\N	2026-05-26 09:13:39.586+00	\N
919	2	CREATE	media	48	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/ukulbm677-1779787007966.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy91a3VsYm02NzctMTc3OTc4NzAwNzk2Ni5qcGciLCJpYXQiOjE3Nzk3ODY4MDYsImV4cCI6MTgxMTMyMjgwNn0.f1v5f4tNg_N5tDGhGB56-hiXGI8lYZQMXK7odOcF7Cs", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:13:39.71+00	\N
920	2	CREATE	article	28	{"slug": "boysen-at-davies-kinilala-ni-mayor-najie", "title": "BOYSEN AT DAVIES, KINILALA NI MAYOR NAJIE"}	\N	2026-05-26 09:13:40.286+00	\N
921	2	STATUS_CHANGE	article	28	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:13:53.263+00	\N
922	2	FILE_UPLOAD	image	49	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/c71isduvf-1779787099960.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9jNzFpc2R1dmYtMTc3OTc4NzA5OTk2MC5qcGciLCJpYXQiOjE3Nzk3ODY4OTgsImV4cCI6MTgxMTMyMjg5OH0.lF-Axux9o2QrvqiXrjJfB3rNZ7Eujp7d2a3akFmL-DY"}	\N	2026-05-26 09:15:16.267+00	\N
1017	38	UPDATE	banner	23	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:22:53.823+00	\N
1055	38	UPDATE	banner	29	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 09:22:41.336+00	\N
923	2	CREATE	media	49	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/c71isduvf-1779787099960.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9jNzFpc2R1dmYtMTc3OTc4NzA5OTk2MC5qcGciLCJpYXQiOjE3Nzk3ODY4OTgsImV4cCI6MTgxMTMyMjg5OH0.lF-Axux9o2QrvqiXrjJfB3rNZ7Eujp7d2a3akFmL-DY", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:15:16.373+00	\N
924	2	CREATE	article	29	{"slug": "bagong-investment-sa-sports-2-tennis-courts-binuksan-sa-san-pablo-city", "title": "BAGONG INVESTMENT SA SPORTS, 2 TENNIS COURTS, BINUKSAN SA SAN PABLO CITY"}	\N	2026-05-26 09:15:16.932+00	\N
925	2	STATUS_CHANGE	article	29	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:15:21.275+00	\N
926	2	FILE_UPLOAD	image	50	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI"}	\N	2026-05-26 09:16:22.782+00	\N
927	2	CREATE	media	50	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:16:22.889+00	\N
928	2	FILE_UPLOAD	image	51	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI"}	\N	2026-05-26 09:16:47.032+00	\N
929	2	CREATE	media	51	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:16:47.14+00	\N
930	2	CREATE	article	30	{"slug": "konsultasyon-isinagawa-kaugnay-ng-city-ordinance-no-2011-01-para-sa-sektor-ng-tricycle", "title": "KONSULTASYON, ISINAGAWA KAUGNAY NG CITY ORDINANCE NO. 2011-01 PARA SA SEKTOR NG TRICYCLE"}	\N	2026-05-26 09:16:47.778+00	\N
931	2	STATUS_CHANGE	article	30	{"new_status": "published", "old_status": "draft"}	\N	2026-05-26 09:16:51.151+00	\N
932	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.41	2026-05-26 09:25:02.949+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
933	2	CREATE	disclosure	24	{"document": {"title": "test disclosure", "status": "active", "category": "full-disclosure", "date_passed": "2026-05-26", "document_path": "full_disclosure/aldjvihc1-1779787725015.pdf"}}	\N	2026-05-26 09:25:23.983+00	\N
934	2	DELETE	disclosure	24	{"deleted_document": {"title": "test disclosure"}}	\N	2026-05-26 09:25:40.245+00	\N
935	2	FILE_UPLOAD	image	52	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/bflfrmd3j-1779788217747.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9iZmxmcm1kM2otMTc3OTc4ODIxNzc0Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4MDE2LCJleHAiOjE4MTEzMjQwMTZ9.clLYAx1KDT3RGBhHKXFa-0hj-4VXiz_eWeTPyFyxyZ8"}	\N	2026-05-26 09:33:40.289+00	\N
936	2	CREATE	media	52	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/bflfrmd3j-1779788217747.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9iZmxmcm1kM2otMTc3OTc4ODIxNzc0Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4MDE2LCJleHAiOjE4MTEzMjQwMTZ9.clLYAx1KDT3RGBhHKXFa-0hj-4VXiz_eWeTPyFyxyZ8", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:33:40.392+00	\N
937	2	UPDATE	article	30	{"changes": {"featured_media_id": 52}}	\N	2026-05-26 09:33:40.886+00	\N
938	2	FILE_UPLOAD	image	53	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/y1011w3sv-1779788633877.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95MTAxMXczc3YtMTc3OTc4ODYzMzg3Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4NDMyLCJleHAiOjE4MTEzMjQ0MzJ9.JInHG6JL7ZejKqvyJwMp3VaZNvED6bFGMJpPgQJxTcQ"}	\N	2026-05-26 09:40:34.806+00	\N
939	2	CREATE	media	53	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/y1011w3sv-1779788633877.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95MTAxMXczc3YtMTc3OTc4ODYzMzg3Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4NDMyLCJleHAiOjE4MTEzMjQ0MzJ9.JInHG6JL7ZejKqvyJwMp3VaZNvED6bFGMJpPgQJxTcQ", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:40:34.921+00	\N
940	2	UPDATE	article	29	{"changes": {"featured_media_id": 53}}	\N	2026-05-26 09:40:35.515+00	\N
941	2	FILE_UPLOAD	image	54	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/6rr29rjim-1779788740891.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy82cnIyOXJqaW0tMTc3OTc4ODc0MDg5MS53ZWJwIiwiaWF0IjoxNzc5Nzg4NTM5LCJleHAiOjE4MTEzMjQ1Mzl9.HevwqlBsuNha9DTPufBjG8CVtr9vHKL2RmH1Di4uaV4"}	\N	2026-05-26 09:42:21.832+00	\N
942	2	CREATE	media	54	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/6rr29rjim-1779788740891.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy82cnIyOXJqaW0tMTc3OTc4ODc0MDg5MS53ZWJwIiwiaWF0IjoxNzc5Nzg4NTM5LCJleHAiOjE4MTEzMjQ1Mzl9.HevwqlBsuNha9DTPufBjG8CVtr9vHKL2RmH1Di4uaV4", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:42:21.946+00	\N
943	2	UPDATE	article	28	{"changes": {"featured_media_id": 54}}	\N	2026-05-26 09:42:22.596+00	\N
944	2	FILE_UPLOAD	image	55	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/nmxvd0q02-1779788901169.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ubXh2ZDBxMDItMTc3OTc4ODkwMTE2OS53ZWJwIiwiaWF0IjoxNzc5Nzg4Njk5LCJleHAiOjE4MTEzMjQ2OTl9.hI8yTWE7_MMR_HwsBNhsMlaxwkRGrKKTWBN-pUX_AuI"}	\N	2026-05-26 09:45:03.887+00	\N
945	2	CREATE	media	55	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/nmxvd0q02-1779788901169.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ubXh2ZDBxMDItMTc3OTc4ODkwMTE2OS53ZWJwIiwiaWF0IjoxNzc5Nzg4Njk5LCJleHAiOjE4MTEzMjQ2OTl9.hI8yTWE7_MMR_HwsBNhsMlaxwkRGrKKTWBN-pUX_AuI", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:45:04+00	\N
946	2	UPDATE	article	26	{"changes": {"featured_media_id": 55}}	\N	2026-05-26 09:45:04.733+00	\N
947	2	FILE_UPLOAD	image	56	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/7pj1f7mkr-1779789245990.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy83cGoxZjdta3ItMTc3OTc4OTI0NTk5MC53ZWJwIiwiaWF0IjoxNzc5Nzg5MDQ0LCJleHAiOjE4MTEzMjUwNDR9.Xdx9XUWqeHQl1ngBCmSzLzKbhuKFlxu7eSH-OotUpVc"}	\N	2026-05-26 09:50:51.611+00	\N
948	2	CREATE	media	56	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/7pj1f7mkr-1779789245990.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy83cGoxZjdta3ItMTc3OTc4OTI0NTk5MC53ZWJwIiwiaWF0IjoxNzc5Nzg5MDQ0LCJleHAiOjE4MTEzMjUwNDR9.Xdx9XUWqeHQl1ngBCmSzLzKbhuKFlxu7eSH-OotUpVc", "created_by": 2, "media_type": "image"}	\N	2026-05-26 09:50:51.726+00	\N
949	2	UPDATE	article	25	{"changes": {"featured_media_id": 56}}	\N	2026-05-26 09:50:52.59+00	\N
950	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	110.54.191.78	2026-05-29 02:47:44.591+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
951	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	209.35.169.88	2026-05-29 07:44:48.14+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
952	2	CREATE	user_account	37	{"role": "admin", "username": "test.admin", "created_by": 2, "permissions": ["dashboard", "banners", "news", "disclosure-portal", "downloadable-forms", "publications", "chatbot", "categories", "activity-logs", "user-management"]}	\N	2026-05-29 07:46:50.468+00	\N
953	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-29 07:46:55.468+00	\N
954	37	LOGIN_FAILED	user_account	37	{"username": "test.admin"}	209.35.169.88	2026-05-29 07:47:04.044+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
955	37	LOGIN_FAILED	user_account	37	{"username": "test.admin"}	209.35.169.88	2026-05-29 07:47:14.516+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
956	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	209.35.169.88	2026-05-29 07:47:34.286+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
957	2	PASSWORD_RESET	user_account	37	{"reset_by": 2, "target_username": "test.admin"}	\N	2026-05-29 07:47:53.603+00	\N
958	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-29 07:47:59.02+00	\N
959	37	LOGIN_SUCCESS	user_account	37	{"username": "test.admin"}	209.35.169.88	2026-05-29 07:48:08.61+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
960	2	LOGIN_FAILED	user_account	2	{"username": "admin"}	160.20.41.107	2026-05-29 07:56:15.08+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
961	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	209.35.169.88	2026-05-29 07:57:24.352+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
962	2	DELETE	user_account	37	{"username": "test.admin", "deleted_by": 2}	\N	2026-05-29 07:57:37.807+00	\N
963	2	UPDATE	user_account	37	{"changes": {"role": "admin", "username": "test.admin", "is_active": false, "permissions": ["dashboard", "banners", "news", "disclosure-portal", "downloadable-forms", "publications", "chatbot", "categories", "activity-logs", "user-management"]}, "updated_by": 2}	\N	2026-05-29 07:58:00.567+00	\N
964	2	STATUS_CHANGE	user_account	37	{"new_status": "active", "old_status": "inactive"}	\N	2026-05-29 07:58:17.114+00	\N
965	2	UPDATE	user_account	37	{"changes": {"role": "admin", "username": "test.admin", "is_active": true, "permissions": ["dashboard", "banners", "news", "disclosure-portal", "downloadable-forms", "publications", "chatbot", "categories", "activity-logs", "user-management"]}, "updated_by": 2}	\N	2026-05-29 07:58:17.201+00	\N
966	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-29 07:58:22.344+00	\N
967	37	LOGIN_SUCCESS	user_account	37	{"username": "test.admin"}	209.35.169.88	2026-05-29 07:58:33.657+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
968	37	LOGOUT	user_account	37	{"reason": "manual"}	\N	2026-05-29 08:01:10.159+00	\N
969	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	209.35.169.88	2026-05-29 08:01:17.257+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
970	2	CREATE	user_account	38	{"role": "admin", "username": "editor", "created_by": 2, "permissions": ["dashboard", "banners", "news", "disclosure-portal", "downloadable-forms", "publications", "chatbot", "categories", "activity-logs", "user-management"]}	\N	2026-05-29 08:01:37.215+00	\N
971	2	LOGOUT	user_account	2	{"reason": "manual"}	\N	2026-05-29 08:01:43.042+00	\N
972	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	209.35.169.88	2026-05-29 08:01:52.983+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
973	38	LOGOUT	user_account	38	{"reason": "manual"}	\N	2026-05-29 08:01:56.729+00	\N
974	2	LOGIN_FAILED	user_account	2	{"username": "admin"}	160.20.41.107	2026-05-29 08:06:53.639+00	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1
975	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	131.226.106.163	2026-05-29 10:24:50.099+00	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1
976	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	49.144.162.97	2026-05-29 11:24:12.753+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1053	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 09:22:41.323+00	\N
1056	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 09:22:41.354+00	\N
977	38	FILE_UPLOAD	image	57	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/61436ghe4-1780053864765.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzYxNDM2Z2hlNC0xNzgwMDUzODY0NzY1LnBuZyIsImlhdCI6MTc4MDA1Mzg3MCwiZXhwIjoxODExNTg5ODcwfQ.TUqLTfzdSHuTxEysYViYMCGN4HHKWzsgwZeOJDnlxeQ"}	\N	2026-05-29 11:24:33.692+00	\N
978	38	CREATE	media	57	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/61436ghe4-1780053864765.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzYxNDM2Z2hlNC0xNzgwMDUzODY0NzY1LnBuZyIsImlhdCI6MTc4MDA1Mzg3MCwiZXhwIjoxODExNTg5ODcwfQ.TUqLTfzdSHuTxEysYViYMCGN4HHKWzsgwZeOJDnlxeQ", "created_by": 38, "media_type": "image"}	\N	2026-05-29 11:24:33.78+00	\N
979	38	CREATE	banner	25	{"title": null, "created_by": 38, "image_media_id": 57}	\N	2026-05-29 11:24:34.168+00	\N
980	38	FILE_UPLOAD	image	58	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/e40so3ulw-1780053924812.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2U0MHNvM3Vsdy0xNzgwMDUzOTI0ODEyLnBuZyIsImlhdCI6MTc4MDA1MzkzMCwiZXhwIjoxODExNTg5OTMwfQ.8kjQyndTQ3C4EtM3LYKtXjjVi8hCZTDeOmSi5m6_A8s"}	\N	2026-05-29 11:25:33.423+00	\N
981	38	CREATE	media	58	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/e40so3ulw-1780053924812.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2U0MHNvM3Vsdy0xNzgwMDUzOTI0ODEyLnBuZyIsImlhdCI6MTc4MDA1MzkzMCwiZXhwIjoxODExNTg5OTMwfQ.8kjQyndTQ3C4EtM3LYKtXjjVi8hCZTDeOmSi5m6_A8s", "created_by": 38, "media_type": "image"}	\N	2026-05-29 11:25:33.552+00	\N
982	38	CREATE	banner	26	{"title": null, "created_by": 38, "image_media_id": 58}	\N	2026-05-29 11:25:33.978+00	\N
983	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-05-29 11:25:47.616+00	\N
984	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-05-29 11:25:47.644+00	\N
985	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-05-29 11:25:47.675+00	\N
986	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-05-29 11:25:49.427+00	\N
987	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-05-29 11:25:49.702+00	\N
988	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	49.145.9.222	2026-05-30 05:09:46.543+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
989	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	49.145.9.222	2026-05-30 05:12:39.452+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
990	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	160.20.41.1	2026-06-01 01:58:18.255+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
991	38	CREATE	chat_message	103	{"sent_by": 38, "conversation_id": 47}	\N	2026-06-01 01:59:17.578+00	\N
992	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.1	2026-06-01 04:17:04.69+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
993	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	160.20.41.11	2026-06-02 03:12:41.721+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
994	38	UPDATE	banner	23	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:13:00.113+00	\N
995	38	UPDATE	banner	22	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:13:06.018+00	\N
996	38	FILE_UPLOAD	image	59	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fkzzwitoc-1780370006103.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Zrenp3aXRvYy0xNzgwMzcwMDA2MTAzLnBuZyIsImlhdCI6MTc4MDM2OTk5NiwiZXhwIjoxODExOTA1OTk2fQ.uMGQUJolu31WnvzsuOjxJ2PjMiRI6bG6da4blC5QwSU"}	\N	2026-06-02 03:13:21.698+00	\N
997	38	CREATE	media	59	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fkzzwitoc-1780370006103.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Zrenp3aXRvYy0xNzgwMzcwMDA2MTAzLnBuZyIsImlhdCI6MTc4MDM2OTk5NiwiZXhwIjoxODExOTA1OTk2fQ.uMGQUJolu31WnvzsuOjxJ2PjMiRI6bG6da4blC5QwSU", "created_by": 38, "media_type": "image"}	\N	2026-06-02 03:13:21.792+00	\N
998	38	CREATE	banner	27	{"title": null, "created_by": 38, "image_media_id": 59}	\N	2026-06-02 03:13:22.269+00	\N
999	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:13:41.441+00	\N
1000	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 03:13:41.449+00	\N
1001	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 03:13:41.477+00	\N
1002	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 03:13:41.637+00	\N
1003	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 5}, "updated_by": 38}	\N	2026-06-02 03:13:43.234+00	\N
1004	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 03:13:43.257+00	\N
1005	38	UPDATE	banner	22	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:13:48.341+00	\N
1006	38	UPDATE	banner	23	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:13:56.663+00	\N
1007	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:15:42.234+00	\N
1008	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 03:15:42.233+00	\N
1009	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 5}, "updated_by": 38}	\N	2026-06-02 03:15:42.234+00	\N
1010	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 03:15:42.241+00	\N
1011	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 03:15:42.242+00	\N
1012	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 03:15:42.378+00	\N
1054	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 09:22:41.321+00	\N
1014	38	FILE_UPLOAD	image	60	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/lnc1um0sn-1780370531814.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2xuYzF1bTBzbi0xNzgwMzcwNTMxODE0LnBuZyIsImlhdCI6MTc4MDM3MDUyMywiZXhwIjoxODExOTA2NTIzfQ.--xK-fIhAjnjfx79dfkj-MylyaQbwcvD6zIJnZkgDks"}	\N	2026-06-02 03:22:10.926+00	\N
1015	38	CREATE	media	60	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/lnc1um0sn-1780370531814.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2xuYzF1bTBzbi0xNzgwMzcwNTMxODE0LnBuZyIsImlhdCI6MTc4MDM3MDUyMywiZXhwIjoxODExOTA2NTIzfQ.--xK-fIhAjnjfx79dfkj-MylyaQbwcvD6zIJnZkgDks", "created_by": 38, "media_type": "image"}	\N	2026-06-02 03:22:11.016+00	\N
1016	38	CREATE	banner	28	{"title": null, "created_by": 38, "image_media_id": 60}	\N	2026-06-02 03:22:11.441+00	\N
1018	38	UPDATE	banner	22	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:22:58.873+00	\N
1019	38	DELETE	banner	28	{"title": null, "deleted_by": 38}	\N	2026-06-02 03:23:54.956+00	\N
1020	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 03:24:28.301+00	\N
1021	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 5}, "updated_by": 38}	\N	2026-06-02 03:24:28.325+00	\N
1022	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 03:24:28.338+00	\N
1023	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 03:24:28.343+00	\N
1024	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 03:24:28.359+00	\N
1025	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:24:30.17+00	\N
1026	38	UPDATE	banner	23	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:24:35.575+00	\N
1027	38	UPDATE	banner	22	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:24:41.961+00	\N
1028	38	UPDATE	banner	24	{"changes": {"title": null, "active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:25:30.73+00	\N
1029	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 03:26:03.624+00	\N
1030	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 03:26:03.65+00	\N
1031	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 03:26:03.651+00	\N
1032	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 03:26:03.659+00	\N
1033	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 5}, "updated_by": 38}	\N	2026-06-02 03:26:03.656+00	\N
1034	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:26:05.396+00	\N
1035	38	UPDATE	banner	22	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:26:10.175+00	\N
1036	38	UPDATE	banner	23	{"changes": {"active": false, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:26:18.742+00	\N
1038	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 2}, "updated_by": 38}	\N	2026-06-02 03:27:23.54+00	\N
1037	38	UPDATE	banner	26	{"changes": {"active": true, "order_index": 1}, "updated_by": 38}	\N	2026-06-02 03:27:23.541+00	\N
1039	38	UPDATE	banner	23	{"changes": {"active": true, "order_index": 4}, "updated_by": 38}	\N	2026-06-02 03:27:23.546+00	\N
1040	38	UPDATE	banner	24	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 03:27:23.556+00	\N
1041	38	UPDATE	banner	27	{"changes": {"active": true, "order_index": 0}, "updated_by": 38}	\N	2026-06-02 03:27:23.562+00	\N
1042	38	UPDATE	banner	22	{"changes": {"active": true, "order_index": 5}, "updated_by": 38}	\N	2026-06-02 03:27:23.644+00	\N
1043	38	DELETE	banner	23	{"title": null, "deleted_by": 38}	\N	2026-06-02 03:27:31.766+00	\N
1044	38	DELETE	banner	22	{"title": "AIP AT 2026 BUDGET NG SAN PABLO LGU, INADOPT AT INAPRUBAHAN", "deleted_by": 38}	\N	2026-06-02 03:27:36.241+00	\N
1045	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	160.20.41.11	2026-06-02 07:05:49.413+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1046	38	CREATE	chat_message	110	{"sent_by": 38, "conversation_id": 51}	\N	2026-06-02 07:06:02.998+00	\N
1047	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.11	2026-06-02 08:16:57.185+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1048	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.11	2026-06-02 08:17:52.75+00	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
1049	38	LOGIN_SUCCESS	user_account	38	{"username": "editor"}	160.20.41.11	2026-06-02 09:22:13.2+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1050	38	FILE_UPLOAD	image	61	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/bfp5y0zpu-1780392153219.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2JmcDV5MHpwdS0xNzgwMzkyMTUzMjE5LnBuZyIsImlhdCI6MTc4MDM5MjE0NCwiZXhwIjoxODExOTI4MTQ0fQ.9_cJLfsQPzUTrQLvFpKLERGg4cNQFJiglHQ-MZOtG4k"}	\N	2026-06-02 09:22:27.525+00	\N
1051	38	CREATE	media	61	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/bfp5y0zpu-1780392153219.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2JmcDV5MHpwdS0xNzgwMzkyMTUzMjE5LnBuZyIsImlhdCI6MTc4MDM5MjE0NCwiZXhwIjoxODExOTI4MTQ0fQ.9_cJLfsQPzUTrQLvFpKLERGg4cNQFJiglHQ-MZOtG4k", "created_by": 38, "media_type": "image"}	\N	2026-06-02 09:22:27.612+00	\N
1052	38	CREATE	banner	29	{"title": null, "created_by": 38, "image_media_id": 61}	\N	2026-06-02 09:22:28.078+00	\N
1057	38	UPDATE	banner	25	{"changes": {"active": true, "order_index": 3}, "updated_by": 38}	\N	2026-06-02 09:22:43.092+00	\N
1058	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.58	2026-06-04 05:08:41.644+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1059	2	CREATE	chat_message	115	{"sent_by": 2, "conversation_id": 54}	\N	2026-06-04 05:09:06.415+00	\N
1060	2	UPDATE	banner	24	{"changes": {"title": "86th Charter Anniversary", "active": true, "order_index": 0}, "updated_by": 2}	\N	2026-06-04 05:18:18.86+00	\N
1061	2	UPDATE	banner	24	{"changes": {"title": null, "active": true, "order_index": 0}, "updated_by": 2}	\N	2026-06-04 05:19:00.667+00	\N
1062	2	UPDATE	banner	27	{"changes": {"active": true, "order_index": 1}, "updated_by": 2}	\N	2026-06-04 05:19:10.492+00	\N
1063	2	UPDATE	banner	25	{"changes": {"active": true, "order_index": 3}, "updated_by": 2}	\N	2026-06-04 05:19:10.517+00	\N
1064	2	UPDATE	banner	24	{"changes": {"active": true, "order_index": 4}, "updated_by": 2}	\N	2026-06-04 05:19:10.684+00	\N
1065	2	UPDATE	banner	26	{"changes": {"active": true, "order_index": 2}, "updated_by": 2}	\N	2026-06-04 05:19:12.247+00	\N
1066	2	UPDATE	banner	29	{"changes": {"active": true, "order_index": 0}, "updated_by": 2}	\N	2026-06-04 05:19:12.455+00	\N
1067	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	::1	2026-06-04 05:38:13.564+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1068	2	FILE_UPLOAD	image	62	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/vgzfv9ja2-1780551510733.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL3ZnemZ2OWphMi0xNzgwNTUxNTEwNzMzLndlYnAiLCJpYXQiOjE3ODA1NTEzMDYsImV4cCI6MTgxMjA4NzMwNn0.AMuhdf1Cz1d9v4DMKAZlnNstQd3X0_XrSS1IdEnz8v8"}	\N	2026-06-04 05:38:36.719+00	\N
1069	2	CREATE	media	62	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/vgzfv9ja2-1780551510733.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL3ZnemZ2OWphMi0xNzgwNTUxNTEwNzMzLndlYnAiLCJpYXQiOjE3ODA1NTEzMDYsImV4cCI6MTgxMjA4NzMwNn0.AMuhdf1Cz1d9v4DMKAZlnNstQd3X0_XrSS1IdEnz8v8", "created_by": 2, "media_type": "image"}	\N	2026-06-04 05:38:36.859+00	\N
1070	2	CREATE	banner	30	{"title": null, "created_by": 2, "image_media_id": 62}	\N	2026-06-04 05:38:37.313+00	\N
1071	2	DELETE	banner	30	{"title": null, "deleted_by": 2}	\N	2026-06-04 05:38:59.85+00	\N
1072	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.58	2026-06-04 05:38:50.029+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
1073	2	FILE_UPLOAD	image	63	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/uzfb2gx36-1780551750094.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL3V6ZmIyZ3gzNi0xNzgwNTUxNzUwMDk0LndlYnAiLCJpYXQiOjE3ODA1NTE1NDUsImV4cCI6MTgxMjA4NzU0NX0.lJn1ixZxO4YSVNfvxiUZMCkDAZKEIzf_Z-x3Mqyc2MM"}	\N	2026-06-04 05:39:10.248+00	\N
1074	2	CREATE	media	63	{"file_path": "https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/uzfb2gx36-1780551750094.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL3V6ZmIyZ3gzNi0xNzgwNTUxNzUwMDk0LndlYnAiLCJpYXQiOjE3ODA1NTE1NDUsImV4cCI6MTgxMjA4NzU0NX0.lJn1ixZxO4YSVNfvxiUZMCkDAZKEIzf_Z-x3Mqyc2MM", "created_by": 2, "media_type": "image"}	\N	2026-06-04 05:39:10.341+00	\N
1075	2	CREATE	banner	31	{"title": null, "created_by": 2, "image_media_id": 63}	\N	2026-06-04 05:39:11.12+00	\N
1076	2	UPDATE	banner	31	{"changes": {"title": "test banner file path", "active": true, "order_index": 0}, "updated_by": 2}	\N	2026-06-04 05:40:01.387+00	\N
1077	2	UPDATE	banner	31	{"changes": {"active": false, "order_index": 0}, "updated_by": 2}	\N	2026-06-04 05:40:05.81+00	\N
1078	2	DELETE	banner	31	{"title": "test banner file path", "deleted_by": 2}	\N	2026-06-04 05:40:23.223+00	\N
1079	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.209	2026-06-09 03:04:07.827+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
1080	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.209	2026-06-09 03:07:29.542+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
1081	2	CREATE	chat_message	130	{"sent_by": 2, "conversation_id": 56}	\N	2026-06-09 03:07:57.562+00	\N
1082	2	LOGIN_SUCCESS	user_account	2	{"username": "admin"}	160.20.41.209	2026-06-10 00:29:42.206+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (banner_id, title, file_path, is_active, created_at, updated_at, description, image_media_id, link_url, order_index, active) FROM stdin;
24	\N	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fcixprvkd-1779768914788.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2ZjaXhwcnZrZC0xNzc5NzY4OTE0Nzg4LnBuZyIsImlhdCI6MTc3OTc2ODcxNCwiZXhwIjoxODExMzA0NzE0fQ.o8zDwU1Sjo7leUNvwGpEqNNjhtgFUc1M_3HeE86oNPg	t	2026-05-26 04:15:46.739	2026-06-04 05:19:10.592	\N	40	\N	4	t
25	\N	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/61436ghe4-1780053864765.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzYxNDM2Z2hlNC0xNzgwMDUzODY0NzY1LnBuZyIsImlhdCI6MTc4MDA1Mzg3MCwiZXhwIjoxODExNTg5ODcwfQ.TUqLTfzdSHuTxEysYViYMCGN4HHKWzsgwZeOJDnlxeQ	t	2026-05-29 11:24:34.073	2026-06-04 05:19:10.426	\N	57	\N	3	t
26	\N	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/e40so3ulw-1780053924812.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2U0MHNvM3Vsdy0xNzgwMDUzOTI0ODEyLnBuZyIsImlhdCI6MTc4MDA1MzkzMCwiZXhwIjoxODExNTg5OTMwfQ.8kjQyndTQ3C4EtM3LYKtXjjVi8hCZTDeOmSi5m6_A8s	t	2026-05-29 11:25:33.877	2026-06-04 05:19:12.152	\N	58	\N	2	t
27	\N	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fkzzwitoc-1780370006103.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Zrenp3aXRvYy0xNzgwMzcwMDA2MTAzLnBuZyIsImlhdCI6MTc4MDM2OTk5NiwiZXhwIjoxODExOTA1OTk2fQ.uMGQUJolu31WnvzsuOjxJ2PjMiRI6bG6da4blC5QwSU	t	2026-06-02 03:13:22.162	2026-06-04 05:19:10.403	\N	59	\N	1	t
29	\N	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/bfp5y0zpu-1780392153219.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2JmcDV5MHpwdS0xNzgwMzkyMTUzMjE5LnBuZyIsImlhdCI6MTc4MDM5MjE0NCwiZXhwIjoxODExOTI4MTQ0fQ.9_cJLfsQPzUTrQLvFpKLERGg4cNQFJiglHQ-MZOtG4k	t	2026-06-02 09:22:27.966	2026-06-04 05:19:12.365	\N	61	\N	0	t
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (category_id, name, slug, description, parent_category_id, created_at, updated_at) FROM stdin;
13	Governance	governance		\N	2026-05-26 04:18:25.313	2026-05-26 04:18:25.313
14	Financial Aid	financial-aid		\N	2026-05-26 04:21:15.091	2026-05-26 04:21:15.092
15	Environment	environment		\N	2026-05-26 04:21:20.68	2026-05-26 04:21:20.68
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_messages (id, conversation_id, sender_type, content, is_read, created_at, sender_id) FROM stdin;
121	57	visitor	Paano po magbayad ng amilyar online?	t	2026-06-04 14:56:16.532409+00	\N
130	56	agent	Di ko sure.	f	2026-06-09 03:07:57.419489+00	2
99	48	visitor	may i ask for any contact number from the mayors office	t	2026-05-29 06:17:07.612928+00	\N
100	48	visitor	may i ask for any cellphone number of the mayor's office?	t	2026-05-29 06:18:26.344624+00	\N
101	48	visitor	wer cai i send an email atb the mayor's office	t	2026-05-29 06:19:33.180388+00	\N
102	48	visitor	MAY I ASK FOR biggs inc. culture fit corporations in san pablo laguna	t	2026-05-29 06:55:22.101818+00	\N
98	47	visitor	Saan ang papuntang Mega?	t	2026-05-29 03:01:03.384077+00	\N
103	47	agent	Walang google map, utoy?	f	2026-06-01 01:59:17.429434+00	38
109	51	visitor	Paano makakuha ng Postal ID?	t	2026-06-02 06:19:51.949682+00	\N
110	51	agent	di ko din alam.	f	2026-06-02 07:06:02.8301+00	38
108	50	visitor	numero ng kagawaran ng katarungan	t	2026-06-02 01:45:44.378546+00	\N
104	49	visitor	would like to inquire if na update na po ung corrected birth certificate ng Nanay ko. It's been more than a year na po.	t	2026-06-01 23:14:11.672686+00	\N
105	49	visitor	Please email the response to anivid0809@gmail.com please	t	2026-06-01 23:14:35.333561+00	\N
106	49	visitor	nasa abroad po ako	t	2026-06-01 23:14:40.805811+00	\N
107	49	visitor	Her name is Editha Orlina Glorioso (Maiden Name)x	t	2026-06-01 23:32:07.463152+00	\N
111	52	visitor	San po pde humingi ng form para sa PWD?	t	2026-06-03 15:12:53.083305+00	\N
112	52	visitor	Meron po ba makakuha ng form ng PWD sa online at ano po requirements? Salamat po	t	2026-06-03 15:15:02.190807+00	\N
113	53	visitor	What are the requirements for applying PWD ID? and what is the contact number of PDAO?	t	2026-06-04 01:46:53.636462+00	\N
114	54	visitor	When is the birthrate of the calamity?	t	2026-06-04 05:08:24.505624+00	\N
115	54	agent	tf	f	2026-06-04 05:09:06.278785+00	2
116	55	visitor	Yow	t	2026-06-04 05:12:00.370719+00	\N
117	56	visitor	Bakit asul ang kulay ng langit?	t	2026-06-04 08:07:17.856108+00	\N
118	56	visitor	Bakit tinawag na trex ang trex?	t	2026-06-04 08:08:00.554442+00	\N
119	56	visitor	Ano ba ang nauna itlog o manok?	t	2026-06-04 08:08:10.613457+00	\N
120	56	visitor	Kumain ka na ba? 🥹	t	2026-06-04 08:10:47.465626+00	\N
122	58	visitor	who is the planning and development officer?	t	2026-06-05 01:24:25.836428+00	\N
123	58	visitor	where is the City Planning and Development Office Located?	t	2026-06-05 01:24:50.050719+00	\N
124	58	visitor	Contact information of the City Planning and Development Office?	t	2026-06-05 01:25:15.550008+00	\N
125	59	visitor	Bakit wala sa listahan ng pwd ang anak ko sa Barangay Bagong Bayan	t	2026-06-05 05:17:48.042661+00	\N
126	59	visitor	PWD ID # 0434240003253 , expiration date ng ID 01/03/2029	t	2026-06-05 05:20:16.740282+00	\N
127	59	visitor	Shanaia Mae C. Del Mundo name, with intellectual disability (down syndrome)	t	2026-06-05 05:21:06.567775+00	\N
128	59	visitor	Worried lang po sapagkat hindi sya nakakasama sa mga benefits na nararapat nya matanggap bilang PWD	t	2026-06-05 05:21:52.102612+00	\N
129	60	visitor	Mgpapataas ako bakod sa likod ng bahay dahil wala pa syang bakod ko sa Savana, Brgy Soledad. Hndi sya gaano kataas. Kailangan po ba ng permit? Ano po requirements?	t	2026-06-08 07:09:50.122774+00	\N
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversations (id, created_at, full_name, email, phone, subject, message, source_node, status, ip_address, closed_at, assigned_to, visitor_token) FROM stdin;
48	2026-05-29 06:17:07.43693+00	Leia Veronica Felix Bandin	leiacookie13@gmail.com	09614746268	Iba Pa	may i ask for any contact number from the mayors office	iba-pa	open	136.158.103.134	\N	\N	cd803d1e321e062d8617a2739e2d2a019357f5805db7b3b2fdc69d54971be038
47	2026-05-29 03:01:03.253266+00	Gab Gonzales	gab@gmail.com	09946784648	Iba Pa	Saan ang papuntang Mega?	iba-pa	assigned	110.54.191.78	\N	38	d40cc289438c8c19019dbf0a29a47deff86d8189b4d2fd42cc9f6e675aedd9e2
49	2026-06-01 23:14:11.453532+00	Divina Gracia Glorioso Montague	anivid0809@icloud.com	09175900809	Iba Pa	would like to inquire if na update na po ung corrected birth certificate ng Nanay ko. It's been more than a year na po.	iba-pa	open	73.70.167.23	\N	\N	dc0bba5f599aecc42a92c39d15839323bed94928964ec40c2b4ef5e3c482b52c
50	2026-06-02 01:45:44.238272+00	miel tan	khyletan25@gmail.com	09613598540	Iba Pa	numero ng kagawaran ng katarungan	iba-pa	open	111.90.221.83	\N	\N	0917995895737b8c749b087583f67e4b39e7a9b3e3f8f6b0a3a9bd434ae4a6da
51	2026-06-02 06:19:51.6428+00	Trisha Samillano	samillanotrisha768@gmail.com	09627962460	Iba Pa	Paano makakuha ng Postal ID?	iba-pa	assigned	160.20.41.11	\N	38	da617a5e3286ce1b06f9198d44ff36661e1e368a7197da34e84adce76c0aa433
52	2026-06-03 15:12:52.864894+00	Abigail Taningco	abigailtaningco@yhoo.com	09173191298	Iba Pa	San po pde humingi ng form para sa PWD?	iba-pa	open	136.158.66.205	\N	\N	068bed644b338552e2755e09c915ce2dc8d1c1dc341c3a22985e26905b66b3e1
53	2026-06-04 01:46:53.508625+00	Sarah Pontanoza	castillosarah029@gmail.com	09565996269	Iba Pa	What are the requirements for applying PWD ID? and what is the contact number of PDAO?	iba-pa	open	168.149.181.8	\N	\N	b952d2a9344341f7b766d5407dc9cb704cf148d18dcf55e01bc8be646f747813
54	2026-06-04 05:08:24.366171+00	Ningning	ning@ning.com	09464543484	Iba Pa	When is the birthrate of the calamity?	iba-pa	assigned	160.20.41.58	\N	2	2097260a182c7ed7eb4118546541a0bee8e089804d9cbd971e1c50a64f3840bb
55	2026-06-04 05:12:00.235469+00	Ningning	ning@ning.com	09464543484	Iba Pa	Yow	iba-pa	open	160.20.41.58	\N	\N	36d087e15dca7a2b2bc8b6213cffcf09cad9d4e7cef714e9e508aab4a455ac60
57	2026-06-04 14:56:16.356705+00	Marisa Achevarra	marisaachevarra@gmail.com	09452793917	Iba Pa	Paano po magbayad ng amilyar online?	iba-pa	open	119.56.75.243	\N	\N	04061acf65929783b17ef6d7979b687bf8f9a8d900863f1ea55d3d79e5ebb9c9
58	2026-06-05 01:24:25.616123+00	Matuto, Maricel	maricelmatuto@lspu.edu.ph	09463424868	Iba Pa	who is the planning and development officer?	iba-pa	open	175.176.53.35	\N	\N	7440f942ebe4c43104704e55ae1ebd729171e58bc1385a9a81d47bf5aa5ce78b
59	2026-06-05 05:17:47.87765+00	Saudino del Mundo	saudinodelmundo@gmail.com	09188142613	Iba Pa	Bakit wala sa listahan ng pwd ang anak ko sa Barangay Bagong Bayan	iba-pa	open	49.144.195.24	\N	\N	8473a549814ff0c0e8315359cfc7f0d3789f347fe6d6630f993390aa6c3aa2c1
60	2026-06-08 07:09:49.977583+00	CHRIS FAITH V TAGLE	cfaithtagle@gmail.com	09456621362	Iba Pa	Mgpapataas ako bakod sa likod ng bahay dahil wala pa syang bakod ko sa Savana, Brgy Soledad. Hndi sya gaano kataas. Kailangan po ba ng permit? Ano po requirements?	iba-pa	open	112.198.70.124	\N	\N	289fbf5addf1f992276b25c018121894abc8c594968061b9c1854d0aa8776229
56	2026-06-04 08:07:17.695961+00	Mang Juan	gokejo8179@5nek.com	09999999999	Iba Pa	Bakit asul ang kulay ng langit?	iba-pa	assigned	160.20.41.58	\N	2	63eeae940e2706ec2011db25d75ea6448e77b90cb5799b90e297592ffba2382d
\.


--
-- Data for Name: disclosure; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.disclosure (document_id, category, title, date_passed, document_path, status, uploaded_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (event_id, title, description, start_date, end_date, location, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (faq_id, question, answer, created_at, updated_at) FROM stdin;
1	Mga Contact Number ng mga Opisina	Bureau of Fire Protection:\nLandline: 5627-654\n\nCDRRMO\nLandline: 8000-405\nSmart: 09089078124\nGlobe: 09955619456\n\nCHO\nLandline: 576-9119\nSmart: 09392022318\nGlobe: 09673625480\n\nPolice\nLandline: 5626-474\nLandline: 5210-610\n\nWelfare & Development Office\nLandline: (049) 3000-065	2026-04-23 05:52:27.46974+00	2026-04-23 05:52:27.46974+00
2	Lokasyon ng mga Terminal	Para sa kumpletong listahan ng mga terminal, mangyaring bisitahin ang City Hall o makipag-ugnayan sa LTFRB San Pablo.	2026-04-23 05:52:27.46974+00	2026-04-23 05:52:27.46974+00
\.


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms (id, title, date_issued, file_url, status, created_at, updated_at, category) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (media_id, file_path, media_type, caption, uploaded_by, related_article_id, related_event_id, related_banner_id, order_index, created_at, updated_at) FROM stdin;
4	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/1776846797590-0r3htuxxxrfk.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzE3NzY4NDY3OTc1OTAtMHIzaHR1eHh4cmZrLmpwZyIsImlhdCI6MTc3Njg0NjYwNiwiZXhwIjoxODA4MzgyNjA2fQ.MoRO7vYXv1FFhyAnI6rwuNMM_D4eh7SfM42PlZOiBnk	image	test banner	2	\N	\N	\N	0	2026-04-22 08:33:41.289	2026-04-22 08:33:41.289
5	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/1776912747227-184efludag2.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzE3NzY5MTI3NDcyMjctMTg0ZWZsdWRhZzIucG5nIiwiaWF0IjoxNzc2OTEyNTU1LCJleHAiOjE4MDg0NDg1NTV9.sNhSnH73Py4D2FVthFy1svGyzyxwYP1ZKooryoNoWeo	image	\N	2	\N	\N	\N	0	2026-04-23 02:52:32.136	2026-04-23 02:52:32.136
7	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1776913047798-m6ri4n65ka.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xNzc2OTEzMDQ3Nzk4LW02cmk0bjY1a2EucG5nIiwiaWF0IjoxNzc2OTEyODU2LCJleHAiOjE4MDg0NDg4NTZ9.GqX3uOGgLYTYQiBR_1NTN_50-CaqWqBSapVtg9R3umI	image	This is a news title.	2	\N	\N	\N	0	2026-04-23 02:57:31.776	2026-04-23 02:57:31.777
18	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/1777363425876-sb6lrbm7h3.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzE3NzczNjM0MjU4NzYtc2I2bHJibTdoMy53ZWJwIiwiaWF0IjoxNzc3MzYzMjMyLCJleHAiOjE4MDg4OTkyMzJ9.nJlPV6SVi4Wg6Ei3VNi865D2W98_ElPaOv38zcfd1gA	image	this is a .webp image	\N	\N	\N	\N	0	2026-04-28 08:01:19.129	2026-04-28 08:01:19.129
19	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/1777363565291-jjba6qrgyw.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzE3NzczNjM1NjUyOTEtampiYTZxcmd5dy53ZWJwIiwiaWF0IjoxNzc3MzYzMzcyLCJleHAiOjE4MDg4OTkzNzJ9.8SWK8Qt3GD-Xd8c_54O8tmNyJtr55Bev1glyYp4MPaA	image	this is a .webp image	\N	\N	\N	\N	0	2026-04-28 08:02:54.692	2026-04-28 08:02:54.692
30	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/7vc2zfdid-1778552686009.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy83dmMyemZkaWQtMTc3ODU1MjY4NjAwOS5qcGciLCJpYXQiOjE3Nzg1NTI0ODksImV4cCI6MTgxMDA4ODQ4OX0.xw6tOwLNDCbpMvUM02U-svRW4HDTJMr2nQWy66BH4ys	image	This is a test news articles	2	\N	\N	\N	0	2026-05-12 02:21:49.264	2026-05-12 02:21:49.264
31	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/lxzebnyjj-1778634209443.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2x4emVibnlqai0xNzc4NjM0MjA5NDQzLndlYnAiLCJpYXQiOjE3Nzg2MzQwMTIsImV4cCI6MTgxMDE3MDAxMn0.U1G-0QTt-TpOoQ3TI4k6EwY3rpiAIgn2S2hAkJ917jA	image	test banner	2	\N	\N	\N	0	2026-05-13 01:04:02.935	2026-05-13 01:04:02.935
32	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/amylkzxpt-1779416643944.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2FteWxrenhwdC0xNzc5NDE2NjQzOTQ0LnBuZyIsImlhdCI6MTc3OTQxNjQ0NCwiZXhwIjoxODEwOTUyNDQ0fQ.KvniJYr-vQX5Z-kziasXKhAMQXCFd3B_36W0eOsyZwc	image	\N	2	\N	\N	\N	0	2026-05-22 02:24:20.718	2026-05-22 02:24:20.718
34	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/rvx7oiggb-1779416792014.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ydng3b2lnZ2ItMTc3OTQxNjc5MjAxNC5wbmciLCJpYXQiOjE3Nzk0MTY1OTEsImV4cCI6MTgxMDk1MjU5MX0.wJ6yYXl7DmL39bUuFLb3mpvHwRk1GZEfR-1uPdBd33w	image	Test news article	2	\N	\N	\N	0	2026-05-22 02:26:42.335	2026-05-22 02:26:42.335
35	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/jxfz3pdi1-1779416813321.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9qeGZ6M3BkaTEtMTc3OTQxNjgxMzMyMS5wbmciLCJpYXQiOjE3Nzk0MTY2MTIsImV4cCI6MTgxMDk1MjYxMn0.55LqyHOZnhs4bRQJSQsMf965RZGFF7Ii2sKSXpMsGSY	image	Test news article 2	2	\N	\N	\N	0	2026-05-22 02:27:07.52	2026-05-22 02:27:07.521
37	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/ojq85zrnz-1779765548766.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL29qcTg1enJuei0xNzc5NzY1NTQ4NzY2LndlYnAiLCJpYXQiOjE3Nzk3NjUzNDcsImV4cCI6MTgxMTMwMTM0N30.7DzUZmnBI0iJH3k8oovFzw31-JiFS_rARdcwCD7KbVw	image	HONDA PCX 150	2	\N	\N	\N	0	2026-05-26 03:19:16.417	2026-05-26 03:19:16.417
40	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fcixprvkd-1779768914788.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2ZjaXhwcnZrZC0xNzc5NzY4OTE0Nzg4LnBuZyIsImlhdCI6MTc3OTc2ODcxNCwiZXhwIjoxODExMzA0NzE0fQ.o8zDwU1Sjo7leUNvwGpEqNNjhtgFUc1M_3HeE86oNPg	image	86th CHARTER ANNIVESARY OF CITY OF SAN PABLO	2	\N	\N	\N	0	2026-05-26 04:15:45.997	2026-05-26 04:15:45.997
41	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/295r01v7c-1779769000736.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yOTVyMDF2N2MtMTc3OTc2OTAwMDczNi5qcGciLCJpYXQiOjE3Nzk3Njg3OTksImV4cCI6MTgxMTMwNDc5OX0.BCrnLi4kIijQfhw7rYoaKpRFxpDHyUWXRfZpoG9Q4aM	image	Mayor Najie, Nagpasalamat sa mga kawani at San Pableño	2	\N	\N	\N	0	2026-05-26 04:17:25.071	2026-05-26 04:17:25.071
42	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/wdffoxywk-1779769729917.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy93ZGZmb3h5d2stMTc3OTc2OTcyOTkxNy53ZWJwIiwiaWF0IjoxNzc5NzY5NTI4LCJleHAiOjE4MTEzMDU1Mjh9.lS9xCbdszz6FiVAv-6Bn0gwUssZqGsj5FggGaU2o0uU	image	P3.5M Aid, 619 San Pableños Assisted	2	\N	\N	\N	0	2026-05-26 04:31:25.839	2026-05-26 04:31:25.839
43	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/2wl2usa5r-1779770243016.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8yd2wydXNhNXItMTc3OTc3MDI0MzAxNi53ZWJwIiwiaWF0IjoxNzc5NzcwMDQyLCJleHAiOjE4MTEzMDYwNDJ9.pwZ8lmQMc1C8Mo12Ub54urQZW9AA6p5pkkat9B8AkI8	image	Sampaloc Lake to Undergo Temporary Rest Period	2	\N	\N	\N	0	2026-05-26 04:38:33.504	2026-05-26 04:38:33.505
44	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/99a1z0tno-1779770515841.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy85OWExejB0bm8tMTc3OTc3MDUxNTg0MS5qcGciLCJpYXQiOjE3Nzk3NzAzMTUsImV4cCI6MTgxMTMwNjMxNX0.zwuAr37TXYYUgI3Ie8L5GhUpDQp9-9L6oUjqSWrvQIM	image	Mga Naipong Basura ng Undas Binigyang Aksyon	2	\N	\N	\N	0	2026-05-26 04:42:50.492	2026-05-26 04:42:50.492
45	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/yafppuf2e-1779786423375.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95YWZwcHVmMmUtMTc3OTc4NjQyMzM3NS5qcGciLCJpYXQiOjE3Nzk3ODYyMjIsImV4cCI6MTgxMTMyMjIyMn0.BMuRXaGrBlHiju5Bl3sNRNlUlWAsOh5ZtMpLynQzunQ	image	Government Services to Reach Barangays via UGNAYANG NBG	2	\N	\N	\N	0	2026-05-26 09:04:24.501	2026-05-26 09:04:24.501
46	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/t13bsco7m-1779786626137.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy90MTNic2NvN20tMTc3OTc4NjYyNjEzNy5wbmciLCJpYXQiOjE3Nzk3ODY0MjUsImV4cCI6MTgxMTMyMjQyNX0.Gif-Pwa6UGvW_nL98xwn84oj0E66jira3ANCUi2290k	image	Centenarian may P20,000 cash benefit mula LGU	2	\N	\N	\N	0	2026-05-26 09:07:45.461	2026-05-26 09:07:45.461
47	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/x4syh9jzy-1779786800383.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy94NHN5aDlqenktMTc3OTc4NjgwMDM4My5qcGciLCJpYXQiOjE3Nzk3ODY1OTgsImV4cCI6MTgxMTMyMjU5OH0.csTkpjHu0KqxKKF-3v3RNMS3q0tEfuJOM2LpZYeqDak	image	KALAYAAN SA PAGSASALITA AT BAKIT MAHALAGA ITO SA GOVERNANCE TRANSPARENCY SA SAN PABLO	2	\N	\N	\N	0	2026-05-26 09:11:08.326	2026-05-26 09:11:08.326
48	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/ukulbm677-1779787007966.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy91a3VsYm02NzctMTc3OTc4NzAwNzk2Ni5qcGciLCJpYXQiOjE3Nzk3ODY4MDYsImV4cCI6MTgxMTMyMjgwNn0.f1v5f4tNg_N5tDGhGB56-hiXGI8lYZQMXK7odOcF7Cs	image	BOYSEN AT DAVIES, KINILALA NI MAYOR NAJIE	2	\N	\N	\N	0	2026-05-26 09:13:39.442	2026-05-26 09:13:39.442
49	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/c71isduvf-1779787099960.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9jNzFpc2R1dmYtMTc3OTc4NzA5OTk2MC5qcGciLCJpYXQiOjE3Nzk3ODY4OTgsImV4cCI6MTgxMTMyMjg5OH0.lF-Axux9o2QrvqiXrjJfB3rNZ7Eujp7d2a3akFmL-DY	image	BAGONG INVESTMENT SA SPORTS, 2 TENNIS COURTS, BINUKSAN SA SAN PABLO CITY	2	\N	\N	\N	0	2026-05-26 09:15:15.863	2026-05-26 09:15:15.863
50	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI	image	BAGONG INVESTMENT SA SPORTS, 2 TENNIS COURTS, BINUKSAN SA SAN PABLO CITY	2	\N	\N	\N	0	2026-05-26 09:16:22.654	2026-05-26 09:16:22.654
51	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/1zaw4wv6x-1779787174828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy8xemF3NHd2NngtMTc3OTc4NzE3NDgyOC5qcGciLCJpYXQiOjE3Nzk3ODY5NzMsImV4cCI6MTgxMTMyMjk3M30.j_eSm30AnwKO7URS1fpdLHMt4ob9ZZBolcpvX5okARI	image	KONSULTASYON, ISINAGAWA KAUGNAY NG CITY ORDINANCE NO. 2011-01 PARA SA SEKTOR NG TRICYCLE	2	\N	\N	\N	0	2026-05-26 09:16:46.92	2026-05-26 09:16:46.92
52	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/bflfrmd3j-1779788217747.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9iZmxmcm1kM2otMTc3OTc4ODIxNzc0Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4MDE2LCJleHAiOjE4MTEzMjQwMTZ9.clLYAx1KDT3RGBhHKXFa-0hj-4VXiz_eWeTPyFyxyZ8	image	KONSULTASYON, ISINAGAWA KAUGNAY NG CITY ORDINANCE NO. 2011-01 PARA SA SEKTOR NG TRICYCLE	2	\N	\N	\N	0	2026-05-26 09:33:39.709	2026-05-26 09:33:39.709
53	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/y1011w3sv-1779788633877.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy95MTAxMXczc3YtMTc3OTc4ODYzMzg3Ny53ZWJwIiwiaWF0IjoxNzc5Nzg4NDMyLCJleHAiOjE4MTEzMjQ0MzJ9.JInHG6JL7ZejKqvyJwMp3VaZNvED6bFGMJpPgQJxTcQ	image	BAGONG INVESTMENT SA SPORTS, 2 TENNIS COURTS, BINUKSAN SA SAN PABLO CITY	2	\N	\N	\N	0	2026-05-26 09:40:34.659	2026-05-26 09:40:34.659
54	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/6rr29rjim-1779788740891.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy82cnIyOXJqaW0tMTc3OTc4ODc0MDg5MS53ZWJwIiwiaWF0IjoxNzc5Nzg4NTM5LCJleHAiOjE4MTEzMjQ1Mzl9.HevwqlBsuNha9DTPufBjG8CVtr9vHKL2RmH1Di4uaV4	image	BOYSEN AT DAVIES, KINILALA NI MAYOR NAJIE	2	\N	\N	\N	0	2026-05-26 09:42:21.445	2026-05-26 09:42:21.445
55	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/nmxvd0q02-1779788901169.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy9ubXh2ZDBxMDItMTc3OTc4ODkwMTE2OS53ZWJwIiwiaWF0IjoxNzc5Nzg4Njk5LCJleHAiOjE4MTEzMjQ2OTl9.hI8yTWE7_MMR_HwsBNhsMlaxwkRGrKKTWBN-pUX_AuI	image	Centenarian may P20,000 cash benefit mula LGU	2	\N	\N	\N	0	2026-05-26 09:45:03.381	2026-05-26 09:45:03.381
56	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/articles/7pj1f7mkr-1779789245990.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcnRpY2xlcy83cGoxZjdta3ItMTc3OTc4OTI0NTk5MC53ZWJwIiwiaWF0IjoxNzc5Nzg5MDQ0LCJleHAiOjE4MTEzMjUwNDR9.Xdx9XUWqeHQl1ngBCmSzLzKbhuKFlxu7eSH-OotUpVc	image	Government Services to Reach Barangays via UGNAYANG NBG	2	\N	\N	\N	0	2026-05-26 09:50:51.254	2026-05-26 09:50:51.254
57	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/61436ghe4-1780053864765.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzLzYxNDM2Z2hlNC0xNzgwMDUzODY0NzY1LnBuZyIsImlhdCI6MTc4MDA1Mzg3MCwiZXhwIjoxODExNTg5ODcwfQ.TUqLTfzdSHuTxEysYViYMCGN4HHKWzsgwZeOJDnlxeQ	image	\N	38	\N	\N	\N	0	2026-05-29 11:24:33.593	2026-05-29 11:24:33.593
58	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/e40so3ulw-1780053924812.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2U0MHNvM3Vsdy0xNzgwMDUzOTI0ODEyLnBuZyIsImlhdCI6MTc4MDA1MzkzMCwiZXhwIjoxODExNTg5OTMwfQ.8kjQyndTQ3C4EtM3LYKtXjjVi8hCZTDeOmSi5m6_A8s	image	\N	38	\N	\N	\N	0	2026-05-29 11:25:33.05	2026-05-29 11:25:33.05
59	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/fkzzwitoc-1780370006103.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2Zrenp3aXRvYy0xNzgwMzcwMDA2MTAzLnBuZyIsImlhdCI6MTc4MDM2OTk5NiwiZXhwIjoxODExOTA1OTk2fQ.uMGQUJolu31WnvzsuOjxJ2PjMiRI6bG6da4blC5QwSU	image	\N	38	\N	\N	\N	0	2026-06-02 03:13:21.572	2026-06-02 03:13:21.572
61	https://yljsclzmrxuhejgcesiv.supabase.co/storage/v1/object/sign/media/banners/bfp5y0zpu-1780392153219.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NGM0Nzc4My1kNGMzLTRlNDktOWUwYy01YjJlYmIxNzA2OGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9iYW5uZXJzL2JmcDV5MHpwdS0xNzgwMzkyMTUzMjE5LnBuZyIsImlhdCI6MTc4MDM5MjE0NCwiZXhwIjoxODExOTI4MTQ0fQ.9_cJLfsQPzUTrQLvFpKLERGg4cNQFJiglHQ-MZOtG4k	image	\N	38	\N	\N	\N	0	2026-06-02 09:22:27.275	2026-06-02 09:22:27.275
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publications (publication_id, filename, file_path, uploaded_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (service_id, name, slug, description, requirements, fees, processing_time, online_application_url, created_at, updated_at) FROM stdin;
1	Citizens Charter	citizens-charter	Official citizens charter document for San Pablo City	\N	\N	\N	https://files.sanpablocity.gov.ph/A7d9F3kH2mX0QwL5Z8vR1tY4nP6sB0.pdf	2026-04-23 05:52:27.46974+00	2026-04-23 05:52:27.46974+00
2	Fare Price Matrix	fare-price	Tricycle fare price matrix for San Pablo, Laguna	\N	\N	\N	https://files.sanpablocity.gov.ph/kT7x3qR2pF9L8aM1wV0zN6jH4bE5yC.pdf	2026-04-23 05:52:27.46974+00	2026-04-29 02:17:07.411157+00
\.


--
-- Data for Name: user_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_accounts (user_id, username, password_hash, role, is_active, last_login, created_at, updated_at, permissions) FROM stdin;
38	editor	$2b$10$nSoXVU7IVl0gkpJMaBfc/.YgSM/YR8jSbFCmMwPYHG23OQkdvVsWO	admin	t	2026-06-02 09:22:12.896	2026-05-29 08:01:37.113	2026-06-02 09:22:13.119856	{dashboard,banners,news,disclosure-portal,downloadable-forms,publications,chatbot,categories,activity-logs,user-management}
37	test.admin	$2b$10$rBtWZOaMaGcbafE.LfFe7uOgdNe0Yh9Wd0ZB/llqaVBA4.dWkz642	admin	t	2026-05-29 07:58:33.553	2026-05-29 07:46:50.309	2026-05-29 07:58:33.599327	{dashboard,banners,news,disclosure-portal,downloadable-forms,publications,chatbot,categories,activity-logs,user-management}
2	admin	$2b$10$riXsOFBRRWuDy38NZktSQeBb2j/QM9ymdRTKfR9kdMgmlDdI/iARm	admin	t	2026-06-10 00:29:42.055	2026-04-21 00:45:02.939929	2026-06-10 00:29:42.126434	{dashboard,banners,news,disclosure-portal,downloadable-forms,publications,chatbot,categories,activity-logs,user-management}
\.


--
-- Name: articles_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.articles_article_id_seq', 30, true);


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_log_id_seq', 1082, true);


--
-- Name: banners_banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_banner_id_seq', 31, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 15, true);


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_id_seq', 60, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 130, true);


--
-- Name: disclosure_documents_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.disclosure_documents_document_id_seq', 25, true);


--
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_event_id_seq', 1, false);


--
-- Name: faqs_faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_faq_id_seq', 9, true);


--
-- Name: forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forms_id_seq', 19, true);


--
-- Name: media_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_media_id_seq', 63, true);


--
-- Name: publications_publication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.publications_publication_id_seq', 25, true);


--
-- Name: services_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_service_id_seq', 4, true);


--
-- Name: user_accounts_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_accounts_user_id_seq', 38, true);


--
-- Name: about_us about_us_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us
    ADD CONSTRAINT about_us_pkey PRIMARY KEY (photo_id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (article_id);


--
-- Name: articles articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_key UNIQUE (slug);


--
-- Name: audit_log audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (banner_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: conversations chat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- Name: disclosure disclosure_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disclosure
    ADD CONSTRAINT disclosure_documents_pkey PRIMARY KEY (document_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (faq_id);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (media_id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (publication_id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);


--
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- Name: user_accounts user_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_pkey PRIMARY KEY (user_id);


--
-- Name: user_accounts user_accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_username_key UNIQUE (username);


--
-- Name: chat_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_created_at_idx ON public.conversations USING btree (created_at DESC);


--
-- Name: chat_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_email_idx ON public.conversations USING btree (email);


--
-- Name: chat_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_status_idx ON public.conversations USING btree (status);


--
-- Name: idx_articles_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_articles_category ON public.articles USING btree (category_id);


--
-- Name: idx_articles_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_articles_published ON public.articles USING btree (published_at);


--
-- Name: idx_articles_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_articles_slug ON public.articles USING btree (slug);


--
-- Name: idx_articles_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_articles_status ON public.articles USING btree (status);


--
-- Name: idx_audit_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_created ON public.audit_log USING btree (created_at);


--
-- Name: idx_audit_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_entity ON public.audit_log USING btree (entity_type, entity_id);


--
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_user ON public.audit_log USING btree (user_id);


--
-- Name: idx_categories_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_parent ON public.categories USING btree (parent_category_id);


--
-- Name: idx_categories_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);


--
-- Name: idx_chat_messages_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages USING btree (conversation_id);


--
-- Name: idx_chat_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);


--
-- Name: idx_conversations_visitor_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_visitor_token ON public.conversations USING btree (visitor_token);


--
-- Name: idx_disclosure_category_date_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_disclosure_category_date_status ON public.disclosure USING btree (category, status, date_passed DESC);


--
-- Name: idx_disclosure_date_passed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_disclosure_date_passed ON public.disclosure USING btree (date_passed);


--
-- Name: idx_media_article; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_article ON public.media USING btree (related_article_id);


--
-- Name: idx_media_uploaded; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_uploaded ON public.media USING btree (uploaded_by);


--
-- Name: idx_publications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_publications_created_at ON public.publications USING btree (created_at);


--
-- Name: idx_publications_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_publications_title ON public.publications USING btree (filename);


--
-- Name: idx_services_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_slug ON public.services USING btree (slug);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.user_accounts USING btree (role);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.user_accounts USING btree (username);


--
-- Name: about_us about_us_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER about_us_updated_at BEFORE UPDATE ON public.about_us FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: faqs trg_faqs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: services trg_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_accounts update_user_accounts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON public.user_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: articles articles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: articles articles_featured_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_featured_media_id_fkey FOREIGN KEY (featured_media_id) REFERENCES public.media(media_id) ON DELETE SET NULL;


--
-- Name: audit_log audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: banners banners_image_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_image_media_id_fkey FOREIGN KEY (image_media_id) REFERENCES public.media(media_id) ON DELETE SET NULL;


--
-- Name: categories categories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: conversations conversations_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: disclosure disclosure_documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disclosure
    ADD CONSTRAINT disclosure_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: media media_related_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_related_banner_id_fkey FOREIGN KEY (related_banner_id) REFERENCES public.banners(banner_id) ON DELETE CASCADE;


--
-- Name: media media_related_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_related_event_id_fkey FOREIGN KEY (related_event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- Name: media media_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: publications publications_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.user_accounts(user_id) ON DELETE SET NULL;


--
-- Name: articles Allow all on articles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on articles" ON public.articles USING (true) WITH CHECK (true);


--
-- Name: audit_log Allow all on audit_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on audit_log" ON public.audit_log USING (true) WITH CHECK (true);


--
-- Name: banners Allow all on banners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on banners" ON public.banners USING (true) WITH CHECK (true);


--
-- Name: categories Allow all on categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on categories" ON public.categories USING (true) WITH CHECK (true);


--
-- Name: events Allow all on events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on events" ON public.events USING (true) WITH CHECK (true);


--
-- Name: media Allow all on media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on media" ON public.media USING (true) WITH CHECK (true);


--
-- Name: publications Allow all on publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on publications" ON public.publications USING (true) WITH CHECK (true);


--
-- Name: user_accounts Allow all on user_accounts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all on user_accounts" ON public.user_accounts USING (true) WITH CHECK (true);


--
-- Name: audit_log Allow anon read audit_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anon read audit_log" ON public.audit_log FOR SELECT TO anon USING (true);


--
-- Name: conversations Allow anonymous insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous insert" ON public.conversations FOR INSERT TO anon WITH CHECK (true);


--
-- Name: conversations Allow authenticated read/write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated read/write" ON public.conversations TO authenticated USING (true);


--
-- Name: user_accounts Allow login lookup; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow login lookup" ON public.user_accounts FOR SELECT USING (true);


--
-- Name: forms Allow public read access for active forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for active forms" ON public.forms FOR SELECT TO anon USING ((status = 'active'::text));


--
-- Name: conversations Allow read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access" ON public.conversations FOR SELECT USING (true);


--
-- Name: about_us Authenticated users can manage about_us; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage about_us" ON public.about_us USING ((auth.role() = 'authenticated'::text));


--
-- Name: about_us Public can read about_us; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read about_us" ON public.about_us FOR SELECT USING (true);


--
-- Name: disclosure Public can read active disclosure documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read active disclosure documents" ON public.disclosure FOR SELECT TO anon USING (((status)::text = 'active'::text));


--
-- Name: articles Public can read articles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read articles" ON public.articles FOR SELECT USING (true);


--
-- Name: banners Public can read banners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read banners" ON public.banners FOR SELECT USING (true);


--
-- Name: categories Public can read categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);


--
-- Name: events Public can read events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read events" ON public.events FOR SELECT USING (true);


--
-- Name: media Public can read media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read media" ON public.media FOR SELECT USING (true);


--
-- Name: publications Public can read publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read publications" ON public.publications FOR SELECT USING (true);


--
-- Name: audit_log Service role full access to audit_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access to audit_log" ON public.audit_log TO service_role USING (true) WITH CHECK (true);


--
-- Name: disclosure Service role has full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access" ON public.disclosure TO service_role USING (true) WITH CHECK (true);


--
-- Name: about_us; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages anon can insert visitor messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "anon can insert visitor messages" ON public.chat_messages FOR INSERT TO anon WITH CHECK ((sender_type = 'visitor'::text));


--
-- Name: chat_messages anon can read messages by conversation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "anon can read messages by conversation" ON public.chat_messages FOR SELECT TO anon USING (true);


--
-- Name: articles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: faqs authenticated users can manage faqs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "authenticated users can manage faqs" ON public.faqs TO authenticated USING (true) WITH CHECK (true);


--
-- Name: services authenticated users can manage services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "authenticated users can manage services" ON public.services TO authenticated USING (true) WITH CHECK (true);


--
-- Name: banners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: disclosure; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.disclosure ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: faqs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

--
-- Name: forms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

--
-- Name: media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

--
-- Name: faqs public can read faqs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public can read faqs" ON public.faqs FOR SELECT USING (true);


--
-- Name: services public can read services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public can read services" ON public.services FOR SELECT USING (true);


--
-- Name: publications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: user_accounts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 1wMp0R3syVXeMjMavslqqHhjOa5EJhp27qEw5hXTphUmq2yUhG04KtKbZdivxXr


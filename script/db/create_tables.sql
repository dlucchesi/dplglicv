--  use db_dplglic schema

-- Table
CREATE TABLE public.glucose
(
    id bigint NOT NULL,
    entry_date timestamp without time zone NOT NULL,
    entry integer NOT NULL,
    obs character varying,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.glucose
    OWNER to usr_dpluser;
-- Primary key is id
CREATE SEQUENCE public."glucosePk"
    START 1;

ALTER SEQUENCE public."glucosePk"
    OWNED BY public.glucose.id;

ALTER SEQUENCE public."glucosePk"
    OWNER TO usr_dpluser;


-- Table
CREATE TABLE public.weight
(
    id bigint NOT NULL,
    entry_date timestamp without time zone NOT NULL,
    entry integer NOT NULL,
    obs character varying,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.weight
    OWNER to usr_dpluser;    
-- Primary key is id
CREATE SEQUENCE public."weightPk"
    START 1;

ALTER SEQUENCE public."weightPk"
    OWNED BY public.weight.id;

ALTER SEQUENCE public."weightPk"
    OWNER TO usr_dpluser;    
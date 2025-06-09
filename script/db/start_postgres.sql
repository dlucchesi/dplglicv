-- Database: db_dplglic
-- User: usr_dpluser

-- DROP DATABASE IF EXISTS db_dplglic;

CREATE DATABASE db_dplglic
    WITH
    OWNER = usr_dpluser
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;



-- Database: db_dpl_test

-- DROP DATABASE IF EXISTS db_dpl_test;

CREATE DATABASE db_dplglic_test
    WITH
    OWNER = usr_dpluser
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
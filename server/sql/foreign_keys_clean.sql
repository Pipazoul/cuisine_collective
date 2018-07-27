CREATE OR REPLACE FUNCTION pg_temp.drop_foreign_keys(CHARACTER VARYING)
    RETURNS void AS 
$func$
DECLARE r RECORD;
DECLARE default_schema CHARACTER VARYING = $1;
BEGIN
FOR r IN (SELECT constraint_name, table_name FROM information_schema.table_constraints WHERE table_schema = default_schema AND constraint_type = 'FOREIGN KEY') LOOP
  RAISE INFO '%','dropping '||r.constraint_name;
  EXECUTE CONCAT('ALTER TABLE ' || default_schema || '.' || r.table_name || ' DROP CONSTRAINT ' || r.constraint_name);
END LOOP;
END;
$func$ language plpgsql;

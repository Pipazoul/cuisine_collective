
CREATE OR REPLACE FUNCTION pg_temp.create_foreign_keys(CHARACTER VARYING)
    RETURNS void AS 
$func$

DECLARE fetched_row RECORD;
DECLARE default_schema CHARACTER VARYING = $1;

DECLARE data SCROLL CURSOR FOR
    SELECT fk.table_name fk_table_name, fk.column_name fk_column_name, pk.table_name pk_table_name, pk.column_name pk_column_name
    FROM information_schema.columns fk
    INNER JOIN information_schema.columns pk ON SUBSTRING(fk.column_name FROM '(.*)id') = pk.table_name
    WHERE fk.table_schema = default_schema AND pk.table_schema = default_schema AND pk.column_name = 'id';

BEGIN
OPEN data;

-- Custom indexes (execution first to override auto-generated index if necessary)

-- Iterate and create foreign keys + indexes
LOOP
	FETCH data INTO fetched_row;
    EXIT WHEN NOT FOUND;
	
    -- Foreign key
    EXECUTE 'ALTER TABLE'
    || ' ' || default_schema || '.' || fetched_row.fk_table_name
    || ' ADD CONSTRAINT'
    || ' fk_' || fetched_row.fk_table_name || '_' || fetched_row.pk_table_name || '_' || fetched_row.fk_column_name 
    || ' FOREIGN KEY (' || fetched_row.fk_column_name || ')'
    || ' REFERENCES ' || default_schema || '.' || fetched_row.pk_table_name || '(' || fetched_row.pk_column_name || ')';

    -- Index
    EXECUTE 'CREATE INDEX IF NOT EXISTS ' || fetched_row.fk_table_name || '_' || fetched_row.fk_column_name || '_index'
    || ' ON ' || default_schema || '.' || fetched_row.fk_table_name
    || ' (' || fetched_row.fk_column_name || ')';
END LOOP;

END;

$func$ language plpgsql;

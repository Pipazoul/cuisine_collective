CREATE OR REPLACE FUNCTION pg_temp.unaccent_string(CHARACTER VARYING)
    RETURNS void AS 
$func$
DECLARE default_schema CHARACTER VARYING = $1;
BEGIN

    EXECUTE 'CREATE OR REPLACE FUNCTION ' || default_schema || '.' || 'unaccent_string(text) ' ||
        'RETURNS text IMMUTABLE STRICT AS ' ||
    '$$ ' ||
        'SELECT translate($1, ' ||
            '''àáâãäåāăąÀÁÂÃÄÅĀĂĄÇçèéêëēĕėęěÈÉÊËĒĔĖĘĚìíîïĩīĭÌÍÎÏĨĪĬòóôõöōŏőÒÓÔÕÖŌŎŐùúûüũūŭůÙÚÛÜŨŪŬŮÿŸ'', ' ||
            '''aaaaaaaaaaaaaaaaaacceeeeeeeeeeeeeeeeeeiiiiiiiiiiiiiioooooooooooooooouuuuuuuuuuuuuuuuyy'');' ||
    '$$ LANGUAGE sql;';

END;
$func$ language plpgsql;
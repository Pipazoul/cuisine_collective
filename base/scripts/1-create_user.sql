CREATE USER cuisine_collective_dev WITH
                LOGIN
                NOSUPERUSER
                NOCREATEDB
                NOCREATEROLE
                INHERIT
                NOREPLICATION
                CONNECTION LIMIT -1
                PASSWORD 'cuisine_collective_dev';

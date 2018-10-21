CREATE TABLE verselibs (
    code text NOT NULL UNIQUE,
    verses text NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    format_version integer NOT NULL
);

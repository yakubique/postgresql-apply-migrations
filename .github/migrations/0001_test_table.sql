DROP TABLE IF EXISTS "test";
CREATE TABLE "public"."test" (
"id" integer NOT NULL,
"value" text,
"test" smallint,
CONSTRAINT "test_id" UNIQUE ("id")
) WITH (oids = false);

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_type" AS ENUM('image', 'video', 'document');
  CREATE TYPE "public"."enum_site_settings_theme_settings_default_mode" AS ENUM('light', 'dark', 'system');
  CREATE TABLE "site_settings_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  ALTER TABLE "media" ADD COLUMN "type" "enum_media_type" DEFAULT 'image';
  ALTER TABLE "journey" ADD COLUMN "order" numeric NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "theme_settings_default_mode" "enum_site_settings_theme_settings_default_mode";
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_nav_order_idx" ON "site_settings_nav" USING btree ("_order");
  CREATE INDEX "site_settings_nav_parent_id_idx" ON "site_settings_nav" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_nav" CASCADE;
  ALTER TABLE "media" DROP COLUMN "type";
  ALTER TABLE "journey" DROP COLUMN "order";
  ALTER TABLE "site_settings" DROP COLUMN "theme_settings_default_mode";
  DROP TYPE "public"."enum_media_type";
  DROP TYPE "public"."enum_site_settings_theme_settings_default_mode";`)
}

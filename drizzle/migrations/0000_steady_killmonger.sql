DO $$ BEGIN
 CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'scheduled', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"sender_wallet" varchar(255) NOT NULL,
	"receiver_wallet" varchar(255) NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"scheduled_for" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);

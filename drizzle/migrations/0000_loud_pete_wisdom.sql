CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_email" text NOT NULL,
	"employee_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"department" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"work_type" text DEFAULT 'hybrid' NOT NULL,
	"joined_date" text NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);

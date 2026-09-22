import { now, table, text } from "@agent-native/core/db/schema";

export const employees = table("employees", {
  id: text("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  employeeCode: text("employee_code").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("active"),
  workType: text("work_type").notNull().default("hybrid"),
  joinedDate: text("joined_date").notNull(),
  createdAt: text("created_at").notNull().default(now()),
  updatedAt: text("updated_at").notNull().default(now()),
});

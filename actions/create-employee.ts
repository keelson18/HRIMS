import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const employeeStatus = z.enum(["active", "on_leave", "probation"]);
const workType = z.enum(["hybrid", "remote", "on-site"]);

export default defineAction({
  description:
    "Create an employee record for the signed-in user's HR workspace.",
  schema: z.object({
    employeeCode: z
      .string()
      .trim()
      .min(1)
      .max(32)
      .describe("Unique employee identifier"),
    firstName: z.string().trim().min(1).max(80).describe("Employee first name"),
    lastName: z.string().trim().min(1).max(80).describe("Employee last name"),
    email: z.string().trim().email().max(254).describe("Employee work email"),
    department: z.string().trim().min(1).max(100).describe("Department name"),
    role: z.string().trim().min(1).max(120).describe("Job title"),
    status: employeeStatus
      .default("active")
      .describe('Employee status: "active", "on_leave", or "probation"'),
    workType: workType
      .default("hybrid")
      .describe('Work arrangement: "hybrid", "remote", or "on-site"'),
    joinedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Joining date in YYYY-MM-DD format"),
  }),
  run: async (args) => {
    const ownerEmail = await getRequestUserEmail();
    if (!ownerEmail) {
      throw fail("Authentication is required.", {
        errorCode: "unauthorized",
        statusCode: 401,
      });
    }

    const db = getDb();
    const [existing] = await db
      .select({ id: schema.employees.id })
      .from(schema.employees)
      .where(
        and(
          eq(schema.employees.ownerEmail, ownerEmail),
          or(
            eq(schema.employees.employeeCode, args.employeeCode),
            eq(schema.employees.email, args.email),
          ),
        ),
      );
    if (existing) {
      throw fail("Employee ID or work email is already in use.", {
        errorCode: "employee_code_taken",
        statusCode: 409,
      });
    }

    const [row] = await db
      .insert(schema.employees)
      .values({
        id: crypto.randomUUID(),
        ownerEmail,
        ...args,
      })
      .returning();
    return row;
  },
});

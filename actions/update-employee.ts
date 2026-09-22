import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const employeeStatus = z.enum(["active", "on_leave", "probation"]);
const workType = z.enum(["hybrid", "remote", "on-site"]);

export default defineAction({
  description:
    "Update an employee record in the signed-in user's HR workspace.",
  schema: z.object({
    id: z.string().uuid().describe("Employee id"),
    employeeCode: z
      .string()
      .trim()
      .min(1)
      .max(32)
      .optional()
      .describe("Unique employee identifier"),
    firstName: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional()
      .describe("Employee first name"),
    lastName: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional()
      .describe("Employee last name"),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .optional()
      .describe("Employee work email"),
    department: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .describe("Department name"),
    role: z.string().trim().min(1).max(120).optional().describe("Job title"),
    status: employeeStatus
      .optional()
      .describe('Employee status: "active", "on_leave", or "probation"'),
    workType: workType
      .optional()
      .describe('Work arrangement: "hybrid", "remote", or "on-site"'),
    joinedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Joining date in YYYY-MM-DD format"),
  }),
  http: { method: "PUT" },
  run: async ({ id, ...changes }) => {
    const ownerEmail = await getRequestUserEmail();
    if (!ownerEmail) {
      throw fail("Authentication is required.", {
        errorCode: "unauthorized",
        statusCode: 401,
      });
    }
    if (Object.keys(changes).length === 0) {
      throw fail("At least one employee field is required.", {
        errorCode: "empty_patch",
        statusCode: 400,
      });
    }

    const db = getDb();
    if (changes.employeeCode || changes.email) {
      const [duplicate] = await db
        .select({ id: schema.employees.id })
        .from(schema.employees)
        .where(
          and(
            eq(schema.employees.ownerEmail, ownerEmail),
            or(
              changes.employeeCode
                ? eq(schema.employees.employeeCode, changes.employeeCode)
                : undefined,
              changes.email
                ? eq(schema.employees.email, changes.email)
                : undefined,
            ),
          ),
        );
      if (duplicate && duplicate.id !== id) {
        throw fail("Employee ID or work email is already in use.", {
          errorCode: "employee_identity_taken",
          statusCode: 409,
        });
      }
    }

    const [row] = await db
      .update(schema.employees)
      .set({ ...changes, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(schema.employees.id, id),
          eq(schema.employees.ownerEmail, ownerEmail),
        ),
      )
      .returning();
    if (!row) {
      throw fail("Employee not found.", {
        errorCode: "employee_not_found",
        statusCode: 404,
      });
    }
    return row;
  },
});

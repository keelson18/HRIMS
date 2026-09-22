import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, asc, count, desc, eq, gte, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const employeeStatus = z.enum(["all", "active", "on_leave", "probation"]);

export default defineAction({
  description:
    "List the signed-in user's employees with optional search, status filtering, and pagination.",
  schema: z.object({
    query: z
      .string()
      .trim()
      .max(100)
      .default("")
      .describe("Search name, email, employee code, department, or role"),
    status: employeeStatus
      .default("all")
      .describe('Status filter: "all", "active", "on_leave", or "probation"'),
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .describe("One-based page number"),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Rows per page, from 1 to 50"),
  }),
  http: { method: "GET" },
  run: async ({ query, status, page, pageSize }) => {
    const ownerEmail = await getRequestUserEmail();
    if (!ownerEmail) {
      throw fail("Authentication is required.", {
        errorCode: "unauthorized",
        statusCode: 401,
      });
    }

    const db = getDb();
    const searchFilter = query
      ? or(
          ilike(schema.employees.firstName, `%${query}%`),
          ilike(schema.employees.lastName, `%${query}%`),
          ilike(schema.employees.email, `%${query}%`),
          ilike(schema.employees.employeeCode, `%${query}%`),
          ilike(schema.employees.department, `%${query}%`),
          ilike(schema.employees.role, `%${query}%`),
        )
      : undefined;
    const statusFilter =
      status === "all" ? undefined : eq(schema.employees.status, status);
    const where = and(
      eq(schema.employees.ownerEmail, ownerEmail),
      searchFilter,
      statusFilter,
    );
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: schema.employees.id,
          employeeCode: schema.employees.employeeCode,
          firstName: schema.employees.firstName,
          lastName: schema.employees.lastName,
          email: schema.employees.email,
          department: schema.employees.department,
          role: schema.employees.role,
          status: schema.employees.status,
          workType: schema.employees.workType,
          joinedDate: schema.employees.joinedDate,
        })
        .from(schema.employees)
        .where(where)
        .orderBy(
          desc(schema.employees.updatedAt),
          asc(schema.employees.lastName),
          asc(schema.employees.firstName),
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(schema.employees).where(where),
    ]);

    return {
      rows,
      total: Number(total),
      page,
      pageSize,
      pageCount: Math.max(1, Math.ceil(Number(total) / pageSize)),
    };
  },
});

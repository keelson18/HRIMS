import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description:
    "Delete an employee record from the signed-in user's HR workspace.",
  schema: z.object({
    id: z.string().uuid().describe("Employee id"),
  }),
  http: { method: "DELETE" },
  run: async ({ id }) => {
    const ownerEmail = await getRequestUserEmail();
    if (!ownerEmail) {
      throw fail("Authentication is required.", {
        errorCode: "unauthorized",
        statusCode: 401,
      });
    }

    const db = getDb();
    const [row] = await db
      .delete(schema.employees)
      .where(
        and(
          eq(schema.employees.id, id),
          eq(schema.employees.ownerEmail, ownerEmail),
        ),
      )
      .returning({ id: schema.employees.id });
    if (!row) {
      throw fail("Employee not found.", {
        errorCode: "employee_not_found",
        statusCode: 404,
      });
    }
    return row;
  },
});

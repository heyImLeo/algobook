import { defineRelations } from "drizzle-orm";

import * as schema from "./";

export const relations = defineRelations(schema, (r) => ({
  questionProgress: {
    user: r.one.user({
      from: r.questionProgress.userId,
      to: r.user.id,
    }),
  },
}));

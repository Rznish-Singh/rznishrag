// routerStrategy -> q
// {q, mode -> web | direct}

import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { webPath } from "./webPipeline.js";
import { directPath } from "./directPipeline.js";
import { routerStep } from "./routeStrategy.js";
import { finalValidateAndPolish } from "./finalValidate.js";
import { SearchInput } from "../utils/schemas.js";

// web -> webPath
// directPath

// final validation
// JSON

// LCEL ->
// A, B , C

const branch = RunnableBranch.from<{ q: string; mode: "web" | "direct" }, any>([
  [(input) => input.mode === "web", webPath],
  directPath,
]);

export const searchChain = RunnableSequence.from([
  routerStep,
  branch,
  finalValidateAndPolish,
]);

export async function runSearch(input: SearchInput) {
  return await searchChain.invoke(input);
}

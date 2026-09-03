import { RunnableLambda } from "@langchain/core/runnables";
import { SearchInputSchema } from "../utils/schemas";

export function routeStrategy(q: string): "web" | "direct" {
  const trimedQuery = q.toLowerCase().trim();

  const isLongQuery = trimedQuery.length > 70;

  const recentYearRegex = /\b20(2[4-9]|3[0-9])\b/.test(trimedQuery);

  // this patterns can change based on the tool that u r creating
  // ppt,
  // e-commerce
  // chating
  //treding reel
  const patterns: RegExp[] = [
    /\btop[-\s]*\d+\b/u,
    /\bbest\b/u,
    /\brank(?:ing|ings)?\b/u,
    /\bwhich\s+is\s+better\b/u,
    /\b(?:vs\.?|versus)\b/u,
    /\bcompare|comparison\b/u,

    /\bprice|prices|pricing|cost|costs|cheapest|cheaper|affordable\b/u,
    /\bunder\s*\d+(?:\s*[kK])?\b/u,
    /\p{Sc}\s*\d+/u,

    /\blatest|today|now|current\b/u,
    /\bnews|breaking|trending\b/u,
    /\b(released?|launch|launched|announce|announced|update|updated)\b/u,
    /\bchangelog|release\s*notes?\b/u,

    /\bdeprecated|eol|end\s*of\s*life|sunset\b/u,
    /\broadmap\b/u,

    /\bworks\s+with|compatible\s+with|support(?:ed)?\s+on\b/u,
    /\binstall(ation)?\b/u,

    /\btrending\s+(audio|sound|music|song)\b/u,
    /\bviral\s+(audio|sound|song)\b/u,
    /\binsta\s+trending\s+(audio|sound|song)\b/u,
    /\breels?\s+(audio|sound|song)\b/u,
    /\bbackground\s+(music|sound)\b/u,
    /\buse\s+this\s+sound\b/u,
    /\bnew\s+(audio|sound)\s+trend\b/u,
    /\bpopular\s+(audio|sound)\b/u,
    /\btrending\s+beat\b/u,


    /\btrending\s+(video|reel|reels)\b/u,
    /\bviral\s+(video|reel|clip)\b/u,
    /\breels?\s+trend(?:ing)?\b/u,
    /\binsta\s+reels?\b/u,
    /\bmost\s+viewed\s+reels?\b/u,
    /\bexplore\s+page\b/u,
    /\bgoing\s+viral\b/u,
    /\bblowing\s+up\b/u,


    /\b\d+(?:\.\d+)?\s*(k|m)\s*(views?|likes?)\b/iu,
    /\bmillions?\s+of\s+views?\b/u,
    /\bhigh\s+engagement\b/u,
    /\bviral\s+trend\b/u,
    /\bhot\s+right\s+now\b/u,


    /\bdance\s+challenge\b/u,
    /\bviral\s+challenge\b/u,
    /\btrend\s+challenge\b/u,
    /\binsta\s+dance\b/u,
    /\btransition\s+trend\b/u,
    /\boutfit\s+transition\b/u,
    /\bglow\s*up\s+trend\b/u,
    /\bbefore\s+after\s+trend\b/u,


    /\bcontent\s+creator\b/u,
    /\binfluencer\b/u,
    /\breels?\s+ideas?\b/u,
    /\bcreator\s+trend\b/u,
    /\binsta\s+growth\b/u,



    /\bnear\s+me|nearby\b/u,
  ];

  const isQueryPresentInPatterns = patterns.some((pattern) =>
    pattern.test(trimedQuery)
  );

  if (isLongQuery || recentYearRegex || isQueryPresentInPatterns) {
    return "web";
  } else {
    return "direct";
  }
}

// routerstep
// LCEL
// query -> string, mode : web/direct
// {query, mode}

export const routerStep = RunnableLambda.from(async (input: { q: string }) => {
  const { q } = SearchInputSchema.parse(input);

  // decide the mode -> web, direct
  const mode = routeStrategy(q);

  return {
    q,
    mode,
  };
});

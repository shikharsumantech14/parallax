// Corrected share calculation: use REAL per-turn API usage for the overall
// cumulative-context-across-turns total and for the prefix constant (turn-1
// cache_creation), and use the transcript's real char-level tool-result vs
// model-output totals only to SPLIT the non-prefix remainder proportionally.

function compute(label, { turns, sumRealContext, firstTurnCacheCreation, toolResultChars, outputChars }) {
  console.log(`\n=== ${label} ===`);
  const realPrefixTokens = firstTurnCacheCreation;
  const prefixContribution = realPrefixTokens * turns; // present in every turn's context
  console.log(`turns: ${turns}`);
  console.log(`real prefix (turn-1 cache_creation): ${realPrefixTokens} tok`);
  console.log(`prefix contribution to sum-over-turns = ${realPrefixTokens} x ${turns} = ${prefixContribution} tok`);
  console.log(`real sum-over-turns of context length (cache_creation+cache_read+input, all turns): ${sumRealContext} tok`);
  const prefixShare = prefixContribution / sumRealContext;
  console.log(`  => prefix share = ${prefixContribution} / ${sumRealContext} = ${(prefixShare*100).toFixed(1)}%`);

  const remainder = sumRealContext - prefixContribution;
  console.log(`remainder (tool-results + model-output + non-first user text), tokens: ${sumRealContext} - ${prefixContribution} = ${remainder}`);

  const totalNonPrefixChars = toolResultChars + outputChars;
  const toolShareOfRemainder = toolResultChars / totalNonPrefixChars;
  const outputShareOfRemainder = outputChars / totalNonPrefixChars;
  console.log(`from the transcript: tool-result chars=${toolResultChars}, model-output chars=${outputChars}`);
  console.log(`  tool-result share of non-prefix content = ${toolResultChars}/${totalNonPrefixChars} = ${(toolShareOfRemainder*100).toFixed(1)}%`);
  console.log(`  model-output share of non-prefix content = ${outputChars}/${totalNonPrefixChars} = ${(outputShareOfRemainder*100).toFixed(1)}%`);

  const toolTokens = remainder * toolShareOfRemainder;
  const outputTokens = remainder * outputShareOfRemainder;
  console.log(`applying that split to the remainder:`);
  console.log(`  tool-results contribution ≈ ${remainder} x ${(toolShareOfRemainder*100).toFixed(1)}% = ${Math.round(toolTokens)} tok = ${(100*toolTokens/sumRealContext).toFixed(1)}% of total`);
  console.log(`  model-output contribution ≈ ${remainder} x ${(outputShareOfRemainder*100).toFixed(1)}% = ${Math.round(outputTokens)} tok = ${(100*outputTokens/sumRealContext).toFixed(1)}% of total`);
  console.log(`CHECK sum: prefix ${(prefixShare*100).toFixed(1)}% + tool ${(100*toolTokens/sumRealContext).toFixed(1)}% + output ${(100*outputTokens/sumRealContext).toFixed(1)}% = ${(prefixShare*100 + 100*toolTokens/sumRealContext + 100*outputTokens/sumRealContext).toFixed(1)}%`);
}

compute('RESEARCHER — travel (largest researcher run)', {
  turns: 47,
  sumRealContext: 5591047,
  firstTurnCacheCreation: 56767,
  toolResultChars: 178559,
  outputChars: 68345,
});

compute('DRAFTER — earth (largest drafter run)', {
  turns: 45,
  sumRealContext: 5284164,
  firstTurnCacheCreation: 37152,
  toolResultChars: 354077,
  outputChars: 52640,
});

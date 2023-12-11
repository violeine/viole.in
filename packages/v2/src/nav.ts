import { datascriptQuery } from "@viole.in/logseq";
import { stringRules } from "@viole.in/logseq/rules";

export const paths = [
  { name: 'devlog', base: 'devlog' },
  { name: 'devlog:viole.in', base: 'devlog', log: 'viole.in' },
  { name: 'devlog:rye', base: 'devlog', log: 'rye' },
  { name: "meta", base: 'meta' },
  { name: "til", base: 'til' },
  { name: undefined, base: 'home' }
]

export async function buildPathFromLogseq({ properties, base }: { properties: string, base: string }) {
  const pl = [
    `
  [
    :find (pull ?b [:block/properties])
    :in $ % 
    :where (has-property ?b :${properties})
  ] `,
    `[${stringRules}]`,
  ];
  return await datascriptQuery(pl).then(e => new Set(e.flat(Infinity).flatMap((el: any) => ({ name: `devlog:${el.properties[properties]}`, base }))));
}


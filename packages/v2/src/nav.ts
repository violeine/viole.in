import { datascriptQuery } from "@viole.in/logseq";
import { stringRules } from "@viole.in/logseq/rules";

export const paths = [
  { name: 'devlog', base: 'devlog' },
  { name: 'devlog:viole.in', base: 'devlog', log: 'viole.in' },
  { name: 'devlog:rye', base: 'devlog', log: 'rye' },
  { name: 'devlog:sketch', base: 'devlog', log: 'sketch' },
  { name: "meta", base: 'meta' },
  { name: "til", base: 'til' },
  { name: 'marks', base: 'marks' },
  { name: 'reading', base: 'reading' },
  { name: 'notes', base: 'notes' },
  { name: 'sketch', base: 'sketch' },
  { name: undefined, base: 'home' }
]

export async function buildPathFromLogseq({ properties, base }: { properties: string, base: string }) {
  const pl = [
    ` [ 
    :find (pull ?b [:block/properties-text-values :block/uuid])
    :in $ % 
    :where (has-property ?b :${properties})]`,
    `[${stringRules}]`,
  ];

  return await datascriptQuery(pl).then(e =>
    new Set(e.flat(Infinity).flatMap((el: any) => {
      return {
        name: `${properties}:${slug(el['properties-text-values'][properties])}`,
        base,
        id: el.uuid,
        title: el['properties-text-values'][properties]
      }
    }
    )));
}

//this make "sadf, `csolskj`" into "sadf-csolskj"
const slug = (s: string) => s.replace(/[^a-z\d ]+/ig, " ").replace(/\s{2,}/g, " ").trim().split(" ").join("-")
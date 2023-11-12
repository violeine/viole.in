const base = (method: string) => async (x: unknown[]) => {
  return await fetch("https://regret.rat-bushi.ts.net/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test",
    },
    body: JSON.stringify({
      method,
      args: x
    }),
  }).then((r) => r.json());
};

export const datascriptQuery = base("logseq.DB.datascriptQuery");

export const q = base("logseq.DB.q");

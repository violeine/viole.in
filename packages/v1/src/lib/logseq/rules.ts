// copy from rules / upstream
// https://github.com/logseq/logseq/blob/master/deps/db/src/logseq/db/rules.cljc
export const rules = {
	namespace: `
	[(namespace ?p ?c)
		[?c :block/namespace ?p]]
	 [(namespace ?p ?c)
		[?t :block/namespace ?p]
		(namespace ?t ?c)]
	`,
	alias: `
	[(alias ?e2 ?e1)
		[?e2 :block/alias ?e1]]
	 [(alias ?e2 ?e1)
		[?e1 :block/alias ?e2]]
	 [(alias ?e1 ?e3)
		[?e1 :block/alias ?e2]
		[?e2 :block/alias ?e3]]
	 [(alias ?e3 ?e1)
		[?e1 :block/alias ?e2]
		[?e2 :block/alias ?e3]]
	`,
};

export const dsl_rules = {
	page_property: `
	 [(page-property ?p ?key ?val)
		[?p :block/name]
		[?p :block/properties ?prop]
		[(get ?prop ?key) ?v]
		(or [(= ?v ?val)] [(contains? ?v ?val)])]
	`,
	has_page_property: `
	 [(has-page-property ?p ?key)
		[?p :block/name]
		[?p :block/properties ?prop]
		[(get ?prop ?key)]]
	`,
	task: `
	 [(task ?b ?markers)
		[?b :block/marker ?marker]
		[(contains? ?markers ?marker)]]
	`,
	piority: `
	 [(priority ?b ?priorities)
		[?b :block/priority ?priority]
		[(contains? ?priorities ?priority)]]
	`,
	page_tags: `
	 [(page-tags ?p ?tags)
		[?p :block/tags ?t]
		[?t :block/name ?tag]
		[(contains? ?tags ?tag)]]
	`,
	all_page_tags: `
	 [(all-page-tags ?p)
		[_ :block/tags ?p]]
	`,
	between: `
	 [(between ?b ?start ?end)
		[?b :block/page ?p]
		[?p :block/journal? true]
		[?p :block/journal-day ?d]
		[(>= ?d ?start)]
		[(<= ?d ?end)]]`
	,
	has_property: `
	 [(has-property ?b ?prop)
		[?b :block/properties ?bp]
		[(missing? $ ?b :block/name)]
		[(get ?bp ?prop)]]
`,
	block_content: `
	 [(block-content ?b ?query)
		[?b :block/content ?content]
		[(clojure.string/includes? ?content ?query)]]
`,
	page:
		`[(page ?b ?page-name)
		[?b :block/page ?bp]
		[?bp :block/name ?page-name]]
		`,
	namespace:
		`[(namespace ?p ?namespace)
		[?p :block/namespace ?parent]
		[?parent :block/name ?namespace]]`,
	property: `
	[(property ?b ?key ?val)
		[?b :block/properties ?prop]
		[(missing? $ ?b :block/name)]
		[(get ?prop ?key) ?v]
		[(str ?val) ?str-val]
		(or [(= ?v ?val)]
				[(contains? ?v ?val)]
				[(contains? ?v ?str-val)])]
	`,
	page_ref: `
	 [(page-ref ?b ?page-name)
		[?b :block/path-refs ?br]
		[?br :block/name ?page-name]]
	`
};

export const stringRules = `
	${Object.values(rules).join("\n")}
	${Object.values(dsl_rules).join("\n")}
`;
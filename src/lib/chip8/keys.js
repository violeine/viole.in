export function keys() {
	const keymaps= { 
		0x1 : "1", 0x2: "2", 0x3: "3" , 0xc: "4",
		0x4 : "q", 0x5: "w", 0x6: "e", 0xd: "r",
		0x7: "a", 0x8: "s", 0x9: "d", 0xe: "f",
		0xa: "z", 0x0: "x", 0xb: "c", 0xf: "v"
	};

	const lookupKeymaps = Object.fromEntries(Object.entries(keymaps).map(([k,v])=>([v, Number(k)])));

	let keyPress = null;

	const getKey= () => {
		return lookupKeymaps[keyPress] ?? null;
	};

	const setKey= (keys) => {
		keyPress = keys;
	};

	const resetKey =  () => {
		keyPress = null;
	};
	const waitKey = ()=>{
		const t =  lookupKeymaps[keyPress];
		keyPress=null;
		return t;
	};
	return {getKey, setKey, resetKey, waitKey};
}


import { useState } from "preact/hooks";

export function Noise() {
	const [config, setConfig] = useState({
		baseFreq: 0.25,
		numOctaves: 6,
	});
	return <div>
		<pre>
			{JSON.stringify(config)}
		</pre>

		<input type="range" min="0" max="10" step="0.025" name="baseFreq" value={config.baseFreq} onInput={(e) => setConfig({ ...config, baseFreq: e.target.value })} />
		<input type="range" min="0" max="7" step="1" name="baseFreq" value={config.numOctaves} onInput={(e) => setConfig({ ...config, numOctaves: e.target.value })} />

		<svg viewBox="0 0 200 200" xmlns='http://www.w3.org/2000/svg' >
			<filter id='noiseFilter'>
				<feTurbulence
					type='fractalNoise'
					baseFrequency={config.baseFreq}
					numOctaves={config.numOctaves}
					stitchTiles='noStitch' />
			</filter>
			<rect width='100%' height='100%' filter='url(#noiseFilter)' id="noise" />
		</svg >
	</div>;
}

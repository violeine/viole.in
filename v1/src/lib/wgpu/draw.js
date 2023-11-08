const textureWidth = 5;
const textureHeight = 7;
const _ = [255, 0, 0, 255];
const y = [255, 255, 0, 255];
const b = [0, 0, 255, 255];
//prettier-ignore
const textureData = new Uint8Array([
b, _, _, _, _,
_, y, y, y, _,
_, y, _, _, _,
_, y, y, _, _,
_, y, _, _, _,
_, y, _, _, _,
_, _, _, _, _,  
].flat());

export function draw(ctx, device){
		const shaderModule = device.createShaderModule({
			label: "shader modules",
			code: `
        struct VertexShaderOutput {
            @builtin(position) position: vec4f, 
            @location(0) texcoord: vec2f,
       }

        @vertex fn vs(@builtin(vertex_index) vertexIndex: u32) -> VertexShaderOutput{
        let pos = array(
            vec2f(0.0, 0.0), 
            vec2f(1.0, 0.0),
            vec2f(0.0, 1.0),

            vec2f(0.0, 1.0), 
            vec2f(1.0, 0.0),
            vec2f(1.0, 1.0),
            );
        var vsOutput: VertexShaderOutput;

        let xy = pos[vertexIndex];
        vsOutput.position = vec4f(xy, 0.0, 1.0);
        vsOutput.texcoord = vec2f(xy.x, 1.0 - xy.y);
        return vsOutput;
        }

        @group(0) @binding(0) var ourSampler: sampler;
        @group(0) @binding(1) var ourTexture: texture_2d<f32>;

        @fragment fn fs(inp: VertexShaderOutput) -> @location(0) vec4f {
          return textureSample(ourTexture, ourSampler, inp.texcoord);
        }
`,
		});

}

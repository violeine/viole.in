<script>
	import { onMount } from "svelte";
	let canvas;
	let adapter;
	let device;
	onMount(async () => {
		const ctx = canvas.getContext("webgpu");
		adapter = await navigator.gpu.requestAdapter();
		device = await adapter?.requestDevice();
		const presentationFormat =
			navigator.gpu.getPreferredCanvasFormat();
		ctx.configure({
			device,
			format: presentationFormat,
		});
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

		const texture = device.createTexture({
			size: [textureWidth, textureHeight],
			format: "rgba8unorm",
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST,
		});
		console.log("is it running");
		device.queue.writeTexture(
			{ texture },
			textureData,
			{ bytesPerRow: textureWidth * 4 },
			{ width: textureWidth, height: textureHeight }
		);

		const pipeline = device.createRenderPipeline({
			label: "hardcoded red triangle pipeline",
			layout: "auto",
			vertex: {
				module: shaderModule,
				entryPoint: "vs",
			},
			fragment: {
				module: shaderModule,
				entryPoint: "fs",
				targets: [{ format: presentationFormat }],
			},
		});

		const renderPassDescriptor = {
			label: "canvas render pass",
			colorAttachments: [
				{
					clearValue: [0, 0.3, 0.3, 1],
					loadOp: "clear",
					storeOp: "store",
				},
			],
		};

		const sampler = device.createSampler();
		const bindGroup = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sampler },
				{ binding: 1, resource: texture.createView() },
			],
		});

		function render() {
			renderPassDescriptor.colorAttachments[0].view = ctx
				.getCurrentTexture()
				.createView();

			const encoder = device.createCommandEncoder({
				label: "our encoder",
			});
			const pass =
				encoder.beginRenderPass(renderPassDescriptor);
			pass.setPipeline(pipeline);
			pass.setBindGroup(0, bindGroup);

			pass.draw(6);
			pass.end();

			const commandBuffer = encoder.finish();

			device.queue.submit([commandBuffer]);
		}
		render();
	});
</script>

<canvas bind:this={canvas} width="600" height="800" />

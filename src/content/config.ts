import { z, defineCollection } from "astro:content";

const aboutCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.date(),
	})
});

export const collections = {
	"about": aboutCollection
};

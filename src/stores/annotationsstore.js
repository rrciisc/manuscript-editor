import { writable, derived } from 'svelte/store';

export const imageAnnotations = writable({ rectangleLines: [], loaded: false, imageName: '' });

const getStoreField = (key) => {
	let ans = undefined;
	imageAnnotations.update(annots => {
		ans = annots[key];
		return annots;
	});
	return ans;
};

const areAnnotationsLoaded = () => getStoreField('loaded');
const extractRectangles = (text) => {
	const textLines = text.split("\n");
		const lines = [];
		textLines.forEach(textline => {
			try {
				if (textline && textline !== "") {
					const rectsTextArray = Array.from(textline.matchAll(/\((.*?)\)/g)).map(el => el[1]);
					const line = [];
					rectsTextArray.forEach(textrect => {
						const nums = textrect.split(", ").map(el => +el);
						line.push({
							left: nums[0],
							top: nums[1],
							width: nums[2],
							height: nums[3]
						});
					});
					if (line.length > 0) {
						lines.push(line);
					}
				}
			} catch(e) {
				// ignore
			}
		});

		return lines;
};

export const loadImageAnnotations = async () => {
	if (areAnnotationsLoaded()) { return; }

	const imageLocation = '/image.jpg';
	const boundingRectsLocation = '/boundingrects.csv';

	const res = await fetch(boundingRectsLocation);
	const data = await res.text();
	const lines = extractRectangles(data);
	imageAnnotations.set({ rectangleLines: lines, loaded: true, imageName: imageLocation });
};

export const rectangles = derived(
	imageAnnotations,
	$imageAnnotations => {
		const lines = $imageAnnotations.rectangleLines;
		const rects = [];
		lines.forEach(line => { rects.push(...line); });
		return rects;
	}
);

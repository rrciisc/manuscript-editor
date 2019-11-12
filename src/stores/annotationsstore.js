import { writable, derived } from 'svelte/store';
import { manuscripts } from './manuscriptsstore.js';

const createImageAnnotations = () => {
	const { subscribe, set, update } = writable({
		lines: [],
		loaded: false,
		imageName: '',
		imageWidth: 0,
		imageHeight: 0,
		selectedLine: 0,
		selectedColumn: 0,
		showAnnotations: true
	});

	const getField = (key) => {
		let ans = undefined;
		update(annot => {
			ans = annot[key];
			return annot;
		});
		return ans;
	};

	const moveToPreviousRectangle = (data) => {
		update(annot => {
			const currentLine = annot.lines[annot.selectedLine];
			currentLine.rectangles[annot.selectedColumn].data = data;
			if (annot.selectedLine === 0 && annot.selectedColumn <= 0) {
				return annot;
			}
			if (annot.selectedColumn > 0) {
				annot.selectedColumn -= 1;
				return annot;
			}
			if (annot.selectedColumn <= 0) {
				annot.selectedLine -= 1;
				const prevLine = annot.lines[annot.selectedLine];
				annot.selectedColumn = prevLine.rectangles.length - 1;
				return annot;
			}
		});
	};

	const moveToNextRectangle = (data) => {
		update(annot => {
			if (annot.selectedLine >= annot.lines.length) {
				return annot;
			}
			const currentLine = annot.lines[annot.selectedLine];
			currentLine.rectangles[annot.selectedColumn].data = data;
			if (annot.selectedLine === (annot.lines.length-1) && annot.selectedColumn === (currentLine.rectangles.length-1)) {
				return annot;
			}
			if ((annot.selectedColumn+1) < currentLine.rectangles.length) {
				annot.selectedColumn += 1;
			} else if ((annot.selectedColumn+1) === currentLine.rectangles.length) {
				annot.selectedColumn = 0;
				annot.selectedLine += 1;
			}
			return annot;
		});
	};

	const toggleAnnotationsVisibility = () => {
		update(annot => {
			annot.showAnnotations = !annot.showAnnotations;
			return annot;
		});
	};

	return { subscribe, set, update,
		getKey: (key) => getField(key),
		areLoaded: () => getField('loaded'),
		moveToPreviousRectangle, moveToNextRectangle, toggleAnnotationsVisibility
	};
};

export const imageAnnotations = createImageAnnotations();

const extractLines = (text, bottomText) => {
	const textLines = text.split("\n");
	const bottomLines = bottomText.split("\n");
	const lines = [];
	textLines.forEach((textline, i) => {
		try {
			if (textline && textline !== "") {
				const rectsTextArray = Array.from(textline.matchAll(/\((.*?)\)/g)).map(el => el[1]);
				const rects = [];
				rectsTextArray.forEach(textrect => {
					const nums = textrect.split(", ").map(el => +el);
					rects.push({
						left: nums[0],
						top: nums[1],
						width: nums[2],
						height: nums[3],
						data: ""
					});
				});

				if (i==0) {
					if (rects.length > 0) {
						lines.push({rectangles: rects, bottom: +bottomLines[i], width: +bottomLines[1]- +bottomLines[0]});
					}
				}
				else {
					if (rects.length > 0) {
						lines.push({rectangles: rects, bottom: +bottomLines[i], width: +bottomLines[i]- +bottomLines[i-1]});
					}
				}
			}
		} catch(e) {
			// ignore
		}
	});

	return lines;
};

export const loadImageAnnotations = async (userId, id) => {
	imageAnnotations.set({
		lines: [],
		loaded: false,
		imageName: '',
		imageWidth: 0,
		imageHeight: 0,
		selectedLine: 0,
		selectedColumn: 0,
		showAnnotations: true
	});

	if (manuscripts.getUserId() !== userId) {
		await manuscripts.loadManuscripts(userId);
	}

	// first fetch manuscript metadata
	const manuscript = manuscripts.getManuscriptById(id);

	const bottomRes = await fetch(manuscript.linesUrl);
	const bottomData = await bottomRes.text();

	const rectRes = await fetch(manuscript.rectanglesUrl);
	const rectData = await rectRes.text();
	const lines = extractLines(rectData, bottomData);
	imageAnnotations.set({
		lines: lines,
		loaded: true,
		imageName: manuscript.imageUrl,
		imageWidth: manuscript.width,
		imageHeight: manuscript.height,
		selectedLine: 0,
		selectedColumn: 0,
		showAnnotations: true
	});
};

export const rectangles = derived(imageAnnotations, $imageAnnotations => {
		const lines = $imageAnnotations.lines;
		const rects = [];
		lines.forEach(line => { rects.push(...line.rectangles); });
		return rects;
	}
);

export const currentLine = derived(imageAnnotations, $imageAnnotations => {
	return $imageAnnotations.lines[$imageAnnotations.selectedLine];
});

export const selectedRectangleIdx = derived(imageAnnotations, $imageAnnotations => {
		let idx = 0;
		$imageAnnotations.lines.forEach((line, i) => {
			if (i > $imageAnnotations.selectedLine) {
				return;
			}
			if (i < $imageAnnotations.selectedLine) {
				idx += line.rectangles.length;
				return;
			}
			if (i === $imageAnnotations.selectedLine) {
				idx += $imageAnnotations.selectedColumn;
			}
		});
		return idx;
	}
);

export const annotatedData = derived(imageAnnotations, $imageAnnotations => {
	let data = "";
	$imageAnnotations.lines.forEach(line => {
		line.rectangles.forEach(rectangle => {
			data += rectangle.data;
		});
		data += "\n";
	});
	return data;
});

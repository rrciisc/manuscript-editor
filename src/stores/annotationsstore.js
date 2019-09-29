import { writable, derived } from 'svelte/store';

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
				if (rects.length > 0) {
					lines.push({rectangles: rects, bottom: +bottomLines[i]});
				}
			}
		} catch(e) {
			// ignore
		}
	});

	return lines;
};

export const loadImageAnnotations = async () => {
	if (imageAnnotations.areLoaded()) { return; }

	const imageLocation = '/image1.jpg';
	const boundingRectsLocation = '/boundingrects1.csv';
	const linesLocations = '/linepositions1.csv';
	const imageWidth = 4709;
	const imageHeight = 426;

	const bottomRes = await fetch(linesLocations);
	const bottomData = await bottomRes.text();

	const rectRes = await fetch(boundingRectsLocation);
	const rectData = await rectRes.text();
	const lines = extractLines(rectData, bottomData);
	imageAnnotations.set({
		lines: lines,
		loaded: true,
		imageName: imageLocation,
		imageWidth: imageWidth,
		imageHeight: imageHeight,
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
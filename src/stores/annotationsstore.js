import { writable, derived } from 'svelte/store';

const createImageAnnotations = () => {
	const { subscribe, set, update } = writable({
		rectangleLines: [],
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
			const currentLine = annot.rectangleLines[annot.selectedLine];
			currentLine[annot.selectedColumn].data = data;
			if (annot.selectedLine === 0 && annot.selectedColumn <= 0) {
				return annot;
			}
			if (annot.selectedColumn > 0) {
				annot.selectedColumn -= 1;
				return annot;
			}
			if (annot.selectedColumn <= 0) {
				annot.selectedLine -= 1;
				const prevLine = annot.rectangleLines[annot.selectedLine];
				annot.selectedColumn = prevLine.length - 1;
				return annot;
			}
		});
	};

	const moveToNextRectangle = (data) => {
		update(annot => {
			if (annot.selectedLine >= annot.rectangleLines.length) {
				return annot;
			}
			const currentLine = annot.rectangleLines[annot.selectedLine];
			currentLine[annot.selectedColumn].data = data;
			if (annot.selectedLine === (annot.rectangleLines.length-1) && annot.selectedColumn === (currentLine.length-1)) {
				return annot;
			}
			if ((annot.selectedColumn+1) < currentLine.length) {
				annot.selectedColumn += 1;
			} else if ((annot.selectedColumn+1) === currentLine.length) {
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
							height: nums[3],
							data: ""
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
	if (imageAnnotations.areLoaded()) { return; }

	const imageLocation = '/image.jpg';
	const boundingRectsLocation = '/boundingrects.csv';

	const res = await fetch(boundingRectsLocation);
	const data = await res.text();
	const lines = extractRectangles(data);
	imageAnnotations.set({
		rectangleLines: lines,
		loaded: true,
		imageName: imageLocation,
		imageWidth: 2500,
		imageHeight: 1207,
		selectedLine: 0,
		selectedColumn: 0,
		showAnnotations: true
	});
};

export const rectangles = derived(imageAnnotations, $imageAnnotations => {
		const lines = $imageAnnotations.rectangleLines;
		const rects = [];
		lines.forEach(line => { rects.push(...line); });
		return rects;
	}
);

export const selectedRectangleIdx = derived(imageAnnotations, $imageAnnotations => {
		let idx = 0;
		$imageAnnotations.rectangleLines.forEach((line, i) => {
			if (i > $imageAnnotations.selectedLine) {
				return;
			}
			if (i < $imageAnnotations.selectedLine) {
				idx += line.length;
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
	$imageAnnotations.rectangleLines.forEach(line => {
		line.forEach(rectangle => {
			data += rectangle.data;
		});
		data += "\n";
	});
	return data;
});
<script>
	import * as sapper from '@sapper/app';
  import { manuscripts } from '../stores/manuscriptsstore.js';
  let localImageFileName = '';
  let localRectanglesFileName = '';
  let localLinesFileName = '';
	let imageWidth = '';
	let imageHeight = '';

  $: isSubmitDisabled = !localImageFileName || !imageWidth || !imageHeight || !localRectanglesFileName || !localLinesFileName;
  
  async function handleSubmit(event) {
    const options = {
			width: imageWidth,
      height: imageHeight,
      imageFile: event.target.file.files[0],
      rectsFile: event.target.rectsFile.files[0],
      linesFile: event.target.linesFile.files[0]
		};
    await manuscripts.createManuscript(options);
    sapper.goto(`manuscripts?id=${manuscripts.getUserId()}`);
  }
</script>

<form class="w-full max-w-xl" autocomplete="off" enctype="multipart/form-data"  on:submit|once|preventDefault={handleSubmit}>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2 text-right">
      <label class="label-sm md:label" for="inline-width">Image Width</label>
    </div>
    <div class="md:w-1/2">
      <input class="label-input w-full" id="inline-width" name="width" type="text" bind:value={imageWidth} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2 text-right">
      <label class="label-sm md:label" for="inline-height">Image Height</label>
    </div>
    <div class="md:w-1/2">
      <input class="label-input w-full" id="inline-height" name="height" type="text" bind:value={imageHeight} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2 text-right">
      <label class="label-sm md:label" for="inline-local-file-name">Choose Image File</label>
    </div>
    <div class="md:w-1/2">
      <input bind:value={localImageFileName}
             class="label-input w-full"
             name="file"
             id="inline-local-file-name"
             placeholder="Pick a jpg file to upload"
             type="file"
             accept="image/jpeg" />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2 text-right">
      <label class="label-sm md:label" for="inline-local-rects-file-name">Choose Rectangles File</label>
    </div>
    <div class="md:w-1/2">
      <input bind:value={localRectanglesFileName}
             class="label-input w-full"
             name="rectsFile"
             id="inline-local-rects-file-name"
             placeholder="Pick a csv file to upload"
             type="file"
             accept=".csv" />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2 text-right">
      <label class="label-sm md:label" for="inline-local-lines-file-name">Choose Lines File</label>
    </div>
    <div class="md:w-1/2">
      <input bind:value={localLinesFileName}
             class="label-input w-full"
             name="linesFile"
             id="inline-local-lines-file-name"
             placeholder="Pick a csv file to upload"
             type="file"
             accept=".csv" />
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/2"></div>
    <div class="md:w-1/2">
      <button class="primary-btn" disabled={isSubmitDisabled} type="submit">
        Add
      </button>
    </div>
  </div>
</form>

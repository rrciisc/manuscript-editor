<script>
	import * as sapper from '@sapper/app';
  import { manuscripts } from '../stores/manuscriptsstore.js';
	let localImageFileName = '';
	let imageWidth = '';
	let imageHeight = '';

  $: isSubmitDisabled = !localImageFileName || !imageWidth || !imageHeight;
  
  async function handleSubmit(event) {
    const fileData = new FormData();
		fileData.append('files[]', event.target.file.files[0]);
		const options = {
			width: imageWidth,
			height: imageHeight
		};
		await manuscripts.createManuscript(options, fileData);
		sapper.goto(`manuscripts?id=${manuscripts.getUserId()}`);
  }
</script>

<form class="w-full max-w-sm" autocomplete="off" enctype="multipart/form-data"  on:submit|once|preventDefault={handleSubmit}>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-width">Image Width</label>
    </div>
    <div class="md:w-2/3">
      <input class="label-input w-full" id="inline-width" name="width" type="text" bind:value={imageWidth} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-height">Image Height</label>
    </div>
    <div class="md:w-2/3">
      <input class="label-input w-full" id="inline-height" name="height" type="text" bind:value={imageHeight} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-local-file-name">Choose Image File</label>
    </div>
    <div class="md:w-2/3">
      <input bind:value={localImageFileName}
             class="label-input w-full"
             name="file"
             id="inline-local-file-name"
             placeholder="Pick a jpg file to upload"
             type="file"
             accept=".jpg" />
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="primary-btn" disabled={isSubmitDisabled} type="submit">
        Add
      </button>
    </div>
  </div>
</form>
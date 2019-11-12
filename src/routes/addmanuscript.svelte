<script>
	import * as sapper from '@sapper/app';
  import { manuscripts } from '../stores/manuscriptsstore.js';
  let localImageFileName = '';
  
  $: isSubmitDisabled = !localImageFileName;
  
  async function handleSubmit(event) {
    const options = {
			imageFile: event.target.file.files[0]
		};
    await manuscripts.createManuscript(options);
    sapper.goto(`manuscripts?id=${manuscripts.getUserId()}`);
  }
</script>

<form class="w-full max-w-xl" autocomplete="off" enctype="multipart/form-data"  on:submit|once|preventDefault={handleSubmit}>
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
  <div class="md:flex md:items-center">
    <div class="md:w-1/2"></div>
    <div class="md:w-1/2">
      <button class="primary-btn" disabled={isSubmitDisabled} type="submit">
        Add
      </button>
    </div>
  </div>
</form>

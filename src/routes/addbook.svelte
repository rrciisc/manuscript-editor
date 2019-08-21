<script>
  import * as sapper from '@sapper/app';
  import { createBook } from '../stores/bookstore.js';
  export let bookName = '';
  export let bookDescription = '';
  export let localFileName = '';

  $: isSubmitDisabled = !bookName || !bookDescription || !localFileName;
  
  async function handleSubmit(event) {
    const fileData = new FormData();
    fileData.append('files[]', event.target.file.files[0]);
    await createBook(bookName, bookDescription, fileData);
    sapper.goto('library');
  }
</script>

<form class="w-full max-w-sm" autocomplete="off" enctype="multipart/form-data"  on:submit|once|preventDefault={handleSubmit}>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-book-name">Book Name</label>
    </div>
    <div class="md:w-2/3">
      <input class="label-input" id="inline-book-name" name="name" type="text" bind:value={bookName} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-book-description">Description</label>
    </div>
    <div class="md:w-2/3">
      <input class="label-input" id="inline-book-description" name="description" type="text" bind:value={bookDescription} />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-local-file-name">Choose File</label>
    </div>
    <div class="md:w-2/3">
      <input bind:value={localFileName}
             class="label-input"
             name="file"
             id="inline-local-file-name"
             placeholder="Pick a file to upload"
             type="file"
             accept=".pdf" />
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="primary-btn" disabled={isSubmitDisabled} type="submit">
        Create
      </button>
    </div>
  </div>
</form>
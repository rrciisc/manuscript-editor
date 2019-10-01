<script>
	import * as sapper from '@sapper/app';
  import { users } from '../stores/usersstore.js';
  export let userName = '';

	$: isSubmitDisabled = !userName;

  async function handleSubmit(event) {
    await users.createUser(userName);
    sapper.goto('.');
  }
</script>

<form class="w-full max-w-sm" autocomplete="off" enctype="multipart/form-data"  on:submit|once|preventDefault={handleSubmit}>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="label-sm md:label" for="inline-user-name">User Name</label>
    </div>
    <div class="md:w-2/3">
      <input class="label-input w-full" id="inline-user-name" name="name" type="text" bind:value={userName} />
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
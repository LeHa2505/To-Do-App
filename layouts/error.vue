<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary">
        <nuxt-link to="/">
            Back home
        </nuxt-link>
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {

}
</script>

<style>

</style>
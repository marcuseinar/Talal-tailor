<script>
  import EmptyState from '../components/EmptyState.svelte';
</script>

<div class="wrap">
  <EmptyState icon="search" title="Nothing here" description="That page does not exist in this demo.">
    <a class="btn btn--sm" href="#/">Back to the start</a>
  </EmptyState>
</div>

<style>
  .wrap {
    display: grid;
    place-items: center;
    min-block-size: 60dvh;
    padding: 24px;
  }
</style>

<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Raw Transaction</title>
  <meta name="description" content="Transaction raw data"/>
</svelte:head>

<h1 class="visually-hidden">Transactions</h1>

<ul>
  {#each data.transactions as transaction}
    <li id="{transaction.id}">
      <h2>{transaction.subject}</h2>
      <p>{transaction.date}</p>
      <p>{transaction.email}</p>
      <p>Is processed: {transaction.processed}</p>
      <p>{transaction.rawData.substring(300, 500)}</p>
    </li>
  {/each}
</ul>

<!--
  Kumiki wordmark + glyph. The glyph is a stylised 組木 joinery cross-pattern,
  drawn as crisp geometric paths. SVG is inlined so it inherits currentColor
  and reads well at any size.
-->
<script lang="ts">
  type Props = { size?: number; showWord?: boolean };
  let { size = 24, showWord = true }: Props = $props();
</script>

<a href="/" class="logo" aria-label="Kumiki — homepage">
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Square frame -->
    <rect
      x="3"
      y="3"
      width="26"
      height="26"
      rx="1.5"
      stroke="currentColor"
      stroke-width="1.6"
      fill="none"
    />
    <!-- Joined timbers — vertical and horizontal locking pieces -->
    <path
      d="M16 3 V14 H10 V18 H16 V29 M3 16 H14 V10 H18 V16 H29"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="square"
      fill="none"
    />
    <!-- Vermillion pin marking the joint -->
    <circle cx="16" cy="16" r="1.4" fill="var(--k-shu)" />
  </svg>
  {#if showWord}
    <span class="word">
      <span class="latin">Kumiki</span>
      <span class="kanji" aria-hidden="true">組木</span>
    </span>
  {/if}
</a>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--k-ink-1);
    text-decoration: none;
    font-family: var(--k-font-display);
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  .logo:hover {
    color: var(--k-ink-1);
    text-decoration: none;
  }
  .word {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
  }
  .latin {
    font-size: 18px;
    font-variation-settings:
      'opsz' 48,
      'SOFT' 30;
  }
  .kanji {
    font-family: var(--k-font-display);
    font-size: 12px;
    color: var(--k-ink-3);
    letter-spacing: 0.05em;
  }
</style>

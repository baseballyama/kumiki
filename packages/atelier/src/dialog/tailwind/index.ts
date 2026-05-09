/**
 * `@kumiki/atelier/dialog` Tailwind variant — barrel.
 *
 * Same compound surface as `@kumiki/components/dialog` (Root, Trigger,
 * Overlay, Content, Title, Description, Close) — each subcomponent is
 * a thin wrapper that injects opinionated Tailwind v4 classes and
 * forwards everything else.
 */
import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Overlay from './Overlay.svelte';
import Content from './Content.svelte';
import Title from './Title.svelte';
import Description from './Description.svelte';
import Close from './Close.svelte';

export { Root, Trigger, Overlay, Content, Title, Description, Close };

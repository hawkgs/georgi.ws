export function appendCssVar(
  el: HTMLElement,
  name: string,
  value: string | null,
): void {
  const pairs = el.style.cssText.split(';').map((pair) => pair.trim());
  const varIdx = pairs.findIndex((pair) => pair.startsWith(`--${name}`));

  if (varIdx > -1) {
    pairs.splice(varIdx, 1);
  }

  if (value !== null) {
    pairs.push(`--${name}:${value}`);
  }

  el.style.cssText = pairs.join(';');
}

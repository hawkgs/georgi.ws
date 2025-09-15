const REFLECTION_CENTER_DOT_CLASS = 'gs-debug-refl-center';

export function renderReflectionSurfaceCenter(
  {
    x,
    y,
  }: {
    x: number;
    y: number;
  },
  isFixed?: boolean,
) {
  const dot = document.createElement('div');
  dot.classList.add(REFLECTION_CENTER_DOT_CLASS);

  dot.style.background = 'red';
  dot.style.position = isFixed ? 'fixed' : 'absolute';
  dot.style.width = '6px';
  dot.style.height = '6px';
  dot.style.transform = 'translate(-3px, -3px)';
  dot.style.top = y + 'px';
  dot.style.left = x + 'px';
  dot.style.zIndex = '99999999';

  document.body.appendChild(dot);
}

export function removeAllReflectionSurfaceCenterDots() {
  const dots = document.querySelectorAll('.' + REFLECTION_CENTER_DOT_CLASS);
  for (const dot of dots) {
    dot.remove();
  }
}

'use strict';

export const animateFadeIn = (cmp) => {
  cmp.style.display = 'block';
  cmp.style.opacity = 0;
  cmp.style.transform = 'translateX(-10%)';
  cmp.style.animation = 'route-fade-in 0.3s ease';
  cmp.style.animationIterationCount = 1;
  cmp.style.animationFillMode = 'forwards';
};

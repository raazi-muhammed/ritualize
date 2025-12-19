export const pageSlideAnimation = () => {
  document.documentElement.animate(
    [
      { opacity: 1, scale: 1, transform: "translateX(0)" },
      { opacity: 1, scale: 0.9, transform: "translateX(-100px)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(.2,.88,.27,.95)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }],
    {
      duration: 300,
      easing: "cubic-bezier(.2,.88,.27,.95)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

export const pageSlideBackAnimation = () => {
  document.documentElement.animate(
    [
      { opacity: 1, scale: 1, transform: "translateX(0)" },
      { opacity: 1, scale: 0.9, transform: "translateX(100px)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(.2,.88,.27,.95)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
    {
      duration: 300,
      easing: "cubic-bezier(.2,.88,.27,.95)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

export const PRESSABLE_ANIMATION_CLASSES = `transition-transform active:scale-90 duration-200 ease-in-out`;

import { useCallback } from 'react'

/**
 * You need to add the following css style
 * 
  ::view-transition-image-pair(root) {
    isolation: auto;
  }
  
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
    display: block;
  }
 * 
 * @returns 
 */
export const useViewTransition = () => {
  const startTransition = useCallback(
    (
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      callback?: () => void,
      options?: KeyframeEffectOptions,
    ) => {
      const x = event?.clientX || window.screen.width / 2
      const y = event?.clientY || window.screen.height / 2

      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )

      const transition = window.document.startViewTransition(() => {
        callback?.()
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        window.document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 1000,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
            ...options,
          },
        )
      })
    },
    [],
  )

  return {
    startTransition,
  }
}

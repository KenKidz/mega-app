export default defineAppConfig({
  ui: {
    navigationMenu: {
      slots: {
        item: 'mb-2',
        linkTrailingBadge: 'text-xs px-2 py-1 rounded-full',
        childItem: 'mb-1',
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'pill',
          active: true,
          class: {
            link: 'dark:bg-[var(--surface-element-1)] bg-blue-100 rounded-md',
          }
        },
        {
          orientation: 'vertical',
          collapsed: true,
          class: {
            link: 'px-1.5 justify-center'
          }
        }
      ],
    },
    card: {
      slots: {
        root: 'shadow-md'
      },
      variants: {
        variant: {
          soft: {
            root: 'bg-white dark:bg-gray-800 divide-y divide-default'
          },
          subtle: {
            root: 'bg-white ring ring-default divide-y divide-default'
          }
        }
      },
      defaultVariants: {
        variant: 'soft'
      }
    }
  }
})



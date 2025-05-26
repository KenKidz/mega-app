export const t = (entry: string, replacers?: any) => {
  try {
    return useI18n().t(entry, replacers)
  } catch {
    try {
      if (import.meta.client) {
        return (window as any).useNuxtApp().$i18n.t(entry, replacers)
      } else {
        return entry
      }
    } catch {
      return entry
    }
  }
}

interface Document {
  startViewTransition(cb: () => Promise<void> | void): ViewTransition
}

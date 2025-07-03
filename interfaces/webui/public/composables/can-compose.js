function canCompose(vm) {
  return {
    composableList: {},
    compose(name, composable) {
      this.composableList[name] = composable;
      vm[name] = composable;
    },
    callComposablesLifeCycleMethod(name) {
      for (const [n, composable] of Object.entries(this.composableList)) {
        composable[name] && composable[name]();
      }
    },
  };
}

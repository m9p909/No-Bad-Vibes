class IDGenerator {
  #maxId;

  constructor(maxId) {
    this.#maxId = maxId;
  }

  allocate() {
    // Incrementing this before the rule is actually added
    // might result in wasted IDs, but this is better than the alternative
    // of accidentally reusing the same ID.
    ++this.#maxId;
    return this.#maxId;
  }

  free(id) {
    if (id == this.#maxId) {
      --this.#maxId;
    }
  }
}

export default IDGenerator;

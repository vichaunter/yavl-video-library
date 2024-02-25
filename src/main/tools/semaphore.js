class Semaphore {
  counter = 0;

  waiting = [];

  constructor(max) {
    this.max = max;
  }

  acquire() {
    let released = false;
    const release = () => {
      if (released) {
        throw new Error('Try to release the semaphore more than once');
      }
      released = true;
      if (this.waiting.length) { // run next one
        const resolve = this.waiting.shift();
        resolve();
      } else {
        this.counter -= 1;
      }
    };

    if (this.counter < this.max) {
      this.counter += 1;
      return new Promise((resolve) => resolve(release));
    }
    return new Promise((resolve) => {
      this.waiting.push(() => resolve(release));
    });
  }
}

export default Semaphore;

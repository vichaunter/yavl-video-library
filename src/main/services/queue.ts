type RequestCallback = () => Promise<any>;

class RequestQueue {
  private processing: boolean = false;

  run(callback: RequestCallback) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        if (!this.processing) {
          this.processing = true;
          const res = await this.process(callback);
          clearInterval(interval);
          resolve(res);
        }
      }, 1000);
    });
  }

  async process(callback: RequestCallback) {
    const response = await callback();
    this.processing = false;

    return response;
  }
}

export default RequestQueue;
